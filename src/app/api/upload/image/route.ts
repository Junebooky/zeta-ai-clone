import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service Role Key를 사용한 Supabase 클라이언트 (서버 전용)
const getStorageClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://cgrzhsfcfubbwschexub.supabase.co'
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY가 환경변수에 설정되지 않았습니다.')
  }
  
  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}

/**
 * 구조화된 파일명 생성 함수
 * 형식: userId_timestamp_optionalLabel.extension
 */
const generateStructuredFilename = (
  originalFilename: string,
  userId: string = '',
  label: string = ''
): string => {
  try {
    // 파일 확장자 추출
    const extension = originalFilename.split('.').pop()?.toLowerCase() || 'jpg'
    
    // 타임스탬프 생성 (ISO 8601 기반, 파일명에 안전한 형태)
    const timestamp = new Date().toISOString()
      .replace(/[-:]/g, '')  // 하이픈과 콜론 제거
      .replace(/\./g, '')    // 점 제거
      .slice(0, 15)          // YYYYMMDDTHHMMSS 형태
    
    // 사용자 ID 처리 (없으면 'guest' + 랜덤 식별자)
    const userPrefix = userId || `guest_${Math.random().toString(36).substring(2, 8)}`
    
    // 라벨 처리 (있으면 추가)
    const labelPart = label ? `_${label}` : ''
    
    // 최종 파일명 구성
    const structuredFilename = `${userPrefix}_${timestamp}${labelPart}.${extension}`
    
    console.log('구조화된 파일명 생성:', {
      원본: originalFilename,
      결과: structuredFilename,
      사용자ID: userPrefix,
      타임스탬프: timestamp,
      라벨: label || '없음'
    })
    
    return structuredFilename
  } catch (error) {
    console.error('파일명 생성 오류:', error)
    // 오류 시 기본 파일명 반환
    return `upload_${Date.now()}.jpg`
  }
}

/**
 * Supabase Storage 버킷 존재 확인 및 생성
 */
const ensureBucketExists = async (supabase: any, bucketName: string) => {
  try {
    console.log(`🔍 버킷 '${bucketName}' 존재 여부 확인...`)
    
    // 버킷 목록 조회
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('❌ 버킷 목록 조회 실패:', listError)
      throw new Error(`버킷 목록 조회 실패: ${listError.message}`)
    }
    
    console.log('📋 기존 버킷 목록:', buckets?.map((b: any) => b.name) || [])
    
    // 버킷이 이미 존재하는지 확인
    const bucketExists = buckets?.some((bucket: any) => bucket.name === bucketName)
    
    if (bucketExists) {
      console.log(`✅ 버킷 '${bucketName}'이 이미 존재합니다.`)
      return true
    }
    
    // 버킷이 없으면 생성
    console.log(`🔨 버킷 '${bucketName}' 생성 중...`)
    const { data: newBucket, error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,  // 공개 버킷으로 설정
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB 제한
    })
    
    if (createError) {
      console.error('❌ 버킷 생성 실패:', createError)
      throw new Error(`버킷 생성 실패: ${createError.message}`)
    }
    
    console.log(`✅ 버킷 '${bucketName}' 생성 완료:`, newBucket)
    return true
    
  } catch (error) {
    console.error('❌ 버킷 준비 실패:', error)
    throw error
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== 이미지 업로드 API 시작 (Service Role Key 사용) ===')
    
    // Service Role Key로 Supabase 클라이언트 초기화
    const supabase = getStorageClient()
    console.log('✅ Service Role Key로 Supabase Storage 클라이언트 초기화 완료')
    
    // FormData 파싱
    const formData = await request.formData()
    const image = formData.get('image') as File
    const userId = formData.get('userId') as string || ''
    const label = formData.get('label') as string || 'avatar'
    
    console.log('📝 요청 데이터:', {
      이미지파일: image?.name || '없음',
      파일크기: image?.size || 0,
      파일타입: image?.type || '알 수 없음',
      사용자ID: userId || 'Guest',
      라벨: label
    })
    
    // 파일 유효성 검사
    if (!image) {
      return NextResponse.json({
        success: false,
        error: '이미지 파일이 제공되지 않았습니다.'
      }, { status: 400 })
    }
    
    // 파일 타입 검증
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
    if (!allowedTypes.includes(image.type)) {
      return NextResponse.json({
        success: false,
        error: `지원되지 않는 파일 형식입니다. 허용된 형식: ${allowedTypes.join(', ')}`
      }, { status: 400 })
    }
    
    // 파일 크기 검증 (5MB 제한)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (image.size > maxSize) {
      return NextResponse.json({
        success: false,
        error: `파일 크기가 너무 큽니다. 최대 크기: ${maxSize / 1024 / 1024}MB`
      }, { status: 400 })
    }
    
    console.log('✅ 파일 유효성 검사 통과')
    
    // 버킷 준비
    const bucketName = 'character-images'
    await ensureBucketExists(supabase, bucketName)
    
    // 구조화된 파일명 생성
    const structuredFilename = generateStructuredFilename(image.name, userId, label)
    
    // 파일을 ArrayBuffer로 변환
    const arrayBuffer = await image.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)
    
    console.log('📤 Storage에 파일 업로드 시작...')
    console.log('- 버킷:', bucketName)
    console.log('- 파일명:', structuredFilename)
    console.log('- 파일 크기:', fileBuffer.length, 'bytes')
    
    // Supabase Storage에 업로드
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(structuredFilename, fileBuffer, {
        contentType: image.type,
        duplex: 'half'
      })
    
    if (uploadError) {
      console.error('❌ Storage 업로드 실패:', uploadError)
      return NextResponse.json({
        success: false,
        error: `Storage 업로드 실패: ${uploadError.message}`,
        details: uploadError
      }, { status: 500 })
    }
    
    console.log('✅ Storage 업로드 성공:', uploadData)
    
    // Public URL 생성 (Service Role Key 사용)
    console.log('🔗 이미지 URL 생성 중...')
    
    let imageUrl = ''
    let urlType = ''
    
    try {
      // 공개 URL 생성 시도
      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(structuredFilename)
      
      if (publicUrlData?.publicUrl) {
        imageUrl = publicUrlData.publicUrl
        urlType = 'public'
        console.log('✅ Public URL 생성 성공:', imageUrl)
      } else {
        throw new Error('Public URL 생성 실패')
      }
    } catch (publicError) {
      console.warn('⚠️ Public URL 생성 실패, Signed URL로 대체:', publicError)
      
      // Signed URL 생성 (10년 유효)
      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from(bucketName)
        .createSignedUrl(structuredFilename, 60 * 60 * 24 * 365 * 10) // 10년
      
      if (signedUrlError || !signedUrlData?.signedUrl) {
        console.error('❌ Signed URL 생성도 실패:', signedUrlError)
        return NextResponse.json({
          success: false,
          error: 'URL 생성에 실패했습니다.',
          details: { publicError, signedUrlError }
        }, { status: 500 })
      }
      
      imageUrl = signedUrlData.signedUrl
      urlType = 'signed'
      console.log('✅ Signed URL 생성 성공:', imageUrl)
    }
    
    const result = {
      success: true,
      message: '이미지 업로드 및 URL 생성 완료',
      filename: structuredFilename,
      imageUrl: imageUrl,
      urlType: urlType,
      uploadData: uploadData,
      fileSize: image.size,
      contentType: image.type
    }
    
    console.log('🎉 이미지 업로드 완료:', result)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('=== 이미지 업로드 API 전체 오류 ===', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
      details: error
    }, { status: 500 })
  }
} 