import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    console.log('=== Supabase Storage 테스트 시작 ===')

    // 1. 버킷 목록 조회
    const { data: buckets, error: listError } = await supabase.storage.listBuckets()
    
    if (listError) {
      console.error('버킷 목록 조회 실패:', listError)
      return NextResponse.json({
        success: false,
        error: '버킷 목록 조회 실패',
        details: listError
      })
    }

    console.log('버킷 목록:', buckets)

    // 2. character-images 버킷 확인
    const characterImagesBucket = buckets?.find(bucket => bucket.name === 'character-images')
    console.log('character-images 버킷:', characterImagesBucket)

    // 3. character-images 버킷의 파일 목록 조회
    let files: any[] = []
    if (characterImagesBucket) {
      const { data: fileList, error: filesError } = await supabase.storage
        .from('character-images')
        .list('', {
          limit: 10,
          sortBy: { column: 'created_at', order: 'desc' }
        })

      if (filesError) {
        console.error('파일 목록 조회 실패:', filesError)
      } else {
        files = fileList || []
        console.log('파일 목록:', files)
      }
    }

    // 4. 응답 생성
    return NextResponse.json({
      success: true,
      storage: {
        totalBuckets: buckets?.length || 0,
        buckets: buckets?.map(b => ({
          name: b.name,
          id: b.id,
          public: b.public,
          created_at: b.created_at
        })) || [],
        characterImagesBucket: characterImagesBucket ? {
          exists: true,
          name: characterImagesBucket.name,
          public: characterImagesBucket.public,
          fileCount: files.length,
          recentFiles: files.map(f => ({
            name: f.name,
            size: f.metadata?.size,
            lastModified: f.updated_at
          }))
        } : {
          exists: false
        }
      },
      message: 'Storage 상태 조회 완료'
    })

  } catch (error) {
    console.error('=== Storage 테스트 오류 ===', error)
    return NextResponse.json({
      success: false,
      error: 'Storage 테스트 중 오류 발생',
      details: error instanceof Error ? error.message : '알 수 없는 오류'
    }, { status: 500 })
  }
} 