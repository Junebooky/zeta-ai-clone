'use client'

import React, { useState } from 'react'
import { Plus, Upload, X, ChevronDown, ArrowLeft } from 'lucide-react'
import Footer from './footer'
import { useAuth } from '@/contexts/AuthContext'
import TermsModal from './terms-modal'

interface CreatePageProps {
  onAgree: () => void;
}

interface CharacterFormData {
  title: string
  description: string
  name: string
  personality: string
  voice: string
  imageFile: File | null
  uploadedImageUrl: string | null
  creatorName: string
  avatarUrl: string
  tags: string[]
}

const CreatePage = ({ onAgree }: CreatePageProps) => {
  const [showTerms, setShowTerms] = useState(true)
  const [activeTab, setActiveTab] = useState('content')
  const [showForm, setShowForm] = useState(false)
  const { user } = useAuth()

  const [formData, setFormData] = useState<CharacterFormData>({
    title: '',
    description: '',
    name: '',
    personality: '',
    voice: '설정 안 함',
    imageFile: null,
    uploadedImageUrl: null,
    creatorName: '',
    avatarUrl: '',
    tags: []
  })

  const [dragActive, setDragActive] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleAgree = () => {
    setShowTerms(false)
    onAgree()
  }

  const handleStartCreation = () => {
    setShowForm(true)
  }

  // 개발 모드: 로그인 없이도 폼 표시 허용
  const handleStartCreationWithoutLogin = () => {
    setShowForm(true)
  }

  /**
   * 이미지 업로드 처리 함수 (구조화된 파일명 사용)
   */
  const handleImageUpload = async (file: File) => {
    setUploadingImage(true)
    
    try {
      console.log('=== 이미지 업로드 프로세스 시작 ===')
      console.log('업로드할 파일:', {
        name: file.name,
        size: file.size,
        type: file.type
      })

      // FormData 생성
      const uploadFormData = new FormData()
      uploadFormData.append('image', file)
      uploadFormData.append('userId', user?.id || '')
      uploadFormData.append('label', 'avatar')

      console.log('FormData 준비 완료, API 호출 시작...')

      // 이미지 업로드 API 호출
      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log('API 응답 상태:', response.status, response.statusText)

      const result = await response.json()
      console.log('=== 이미지 업로드 API 응답 ===')
      console.log('전체 응답:', result)

      if (result.success && result.imageUrl) {
        console.log('✅ 이미지 업로드 성공!')
        console.log('- 반환된 imageUrl:', result.imageUrl)
        console.log('- 구조화된 파일명:', result.filename)
        console.log('- URL 타입:', result.urlType)
        
        // 폼 데이터 업데이트
        setFormData(prev => {
          const newFormData = { 
            ...prev, 
            imageFile: file,
            uploadedImageUrl: result.imageUrl,
            avatarUrl: result.imageUrl,
            creatorName: user?.name || 'Guest'
          }
          console.log('=== FormData State 업데이트 ===')
          console.log('이전 uploadedImageUrl:', prev.uploadedImageUrl)
          console.log('새로운 uploadedImageUrl:', newFormData.uploadedImageUrl)
          return newFormData
        })

        alert(`✅ 이미지가 성공적으로 업로드되었습니다!\n\n파일명: ${result.filename}\nURL: ${result.imageUrl}\n타입: ${result.urlType}`)
      } else {
        console.error('❌ 이미지 업로드 실패 또는 URL 누락')
        console.error('- success:', result.success)
        console.error('- imageUrl:', result.imageUrl)
        console.error('- error:', result.error)
        
        alert(`❌ 이미지 업로드에 실패했습니다:\n${result.error || '알 수 없는 오류'}`)
      }

    } catch (error) {
      console.error('=== 이미지 업로드 중 예외 발생 ===', error)
      alert('❌ 이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.')
    } finally {
      setUploadingImage(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleImageUpload(e.dataTransfer.files[0])
    }
  }

  const handleSubmit = async () => {
    try {
      // 폼 유효성 검사
      if (!formData.name.trim()) {
        alert('캐릭터 이름을 입력해주세요.')
        return
      }

      if (!formData.description.trim()) {
        alert('캐릭터 설명을 입력해주세요.')
        return
      }

      // 이미지 상태 검증
      if (formData.imageFile && !formData.uploadedImageUrl) {
        const confirmWithoutImage = confirm(
          '⚠️ 이미지 파일이 선택되었지만 업로드가 완료되지 않았습니다.\n\n기본 이미지로 캐릭터를 생성하시겠습니까?\n\n- 확인: 기본 이미지로 생성\n- 취소: 이미지 업로드 완료 후 다시 시도'
        )
        
        if (!confirmWithoutImage) {
          alert('💡 이미지 업로드 영역에서 "다시 업로드" 버튼을 클릭하여 이미지 업로드를 완료해주세요.')
          return
        }
      }

      console.log('=== 캐릭터 생성 프로세스 시작 ===')
      console.log('현재 FormData 상태:', {
        title: formData.title,
        name: formData.name,
        description: formData.description.substring(0, 50) + '...',
        hasImageFile: !!formData.imageFile,
        imageFileName: formData.imageFile?.name,
        uploadedImageUrl: formData.uploadedImageUrl
      })

      // avatarUrl 결정 로직 명시적 처리
      const finalAvatarUrl = formData.uploadedImageUrl || '/img/girl.01.webp'
      console.log('=== Avatar URL 결정 ===')
      console.log('- formData.uploadedImageUrl:', formData.uploadedImageUrl)
      console.log('- 최종 사용할 avatarUrl:', finalAvatarUrl)
      console.log('- 업로드된 이미지 사용 여부:', !!formData.uploadedImageUrl)

      // API 요청 데이터 준비 (업로드된 이미지 URL 사용)
      const apiData = {
        title: formData.title,
        name: formData.name,
        description: formData.description,
        personality: formData.personality,
        voice: formData.voice,
        creatorName: formData.creatorName,
        tags: formData.tags,
        avatarUrl: finalAvatarUrl
      }

      console.log('=== 캐릭터 생성 API 호출 데이터 ===')
      console.log(JSON.stringify(apiData, null, 2))

      // API 호출
      const response = await fetch('/api/characters', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(apiData),
      })

      console.log('캐릭터 생성 API 응답 상태:', response.status)

      const result = await response.json()
      console.log('=== 캐릭터 생성 API 응답 ===')
      console.log('응답 결과:', result)

      if (result.success) {
        console.log('✅ 캐릭터 생성 성공!')
        console.log('생성된 캐릭터의 avatarUrl:', result.character.avatarUrl)
        
        const successMessage = formData.uploadedImageUrl 
          ? `✅ 캐릭터 "${result.character.name}"이(가) 업로드된 이미지와 함께 성공적으로 생성되었습니다!`
          : `✅ 캐릭터 "${result.character.name}"이(가) 기본 이미지로 성공적으로 생성되었습니다!`
        
        alert(`${successMessage}\n\n저장된 Avatar URL: ${result.character.avatarUrl}`)
        
        // 폼 초기화
        setFormData({
          title: '',
          description: '',
          name: '',
          personality: '',
          voice: '설정 안 함',
          imageFile: null,
          uploadedImageUrl: null,
          creatorName: '',
          avatarUrl: '',
          tags: []
        })
        
      } else {
        console.error('❌ 캐릭터 생성 실패:', result.error)
        alert(`❌ 캐릭터 생성에 실패했습니다: ${result.error}`)
      }

    } catch (error) {
      console.error('=== 캐릭터 생성 중 예외 발생 ===', error)
      alert('❌ 캐릭터 생성 중 오류가 발생했습니다. 다시 시도해주세요.')
    }
  }

  const tabs = [
    { id: 'content', label: '내용' },
    { id: 'intro', label: '인트로' },
    { id: 'situation', label: '상황 예시' },
    { id: 'info', label: '소개' }
  ]

  const voiceOptions = [
    '설정 안 함',
    '부드러운 목소리',
    '활기찬 목소리',
    '차분한 목소리',
    '귀여운 목소리',
    '성숙한 목소리'
  ]

  // 태그 추가 함수
  const addTag = () => {
    const trimmedTag = newTag.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setNewTag('')
    }
  }

  // 태그 제거 함수
  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  // Enter 키로 태그 추가
  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addTag()
    }
  }

  // 캐릭터 생성 폼이 활성화된 경우 (로그인 상태와 무관하게 표시)
  if (showForm) {
    return (
      <div className="min-h-screen bg-white">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowForm(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-bold text-gray-900">제작</h1>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              저장
            </button>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors">
              등록
            </button>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white border-b border-gray-200 sticky top-[73px] z-40">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 px-6 py-3 font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 캐릭터 생성 제한 표시 */}
        <div className="text-center py-4 text-gray-500 text-sm bg-gray-50">
          0/1,200자
        </div>

        <div className="max-w-2xl mx-auto p-6 pb-24 space-y-8">
          {/* 환영 메시지 */}
          <div className="text-center py-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {user ? `${user.name}님` : 'Guest님'} 만의 상상을 현실로 만들어 보세요
            </h2>
            {!user && (
              <p className="text-sm text-gray-500 mt-2">
                * 개발 모드: 로그인 없이 테스트 가능
              </p>
            )}
          </div>

          {/* 제목 입력 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              제목
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="ex) 갑자기 그녀가 짝꿍이 되자고 했다.."
                maxLength={20}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">
                {formData.title.length}/20
              </span>
            </div>
          </div>

          {/* 상세 설명 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              상세 설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder='ex) 남학생들의 관심을 전부 독차지하고 유이. 그러나, 그녀는 공부 말고는 관심이 없어보인다. 그런데, 어느 날 그녀가 나를 보며, "같이 짝꿍할래? 라는 말을 한다"'
              rows={6}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 이미지 업로드 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              캐릭터를 만들어 주세요
            </label>
            
            {/* 디버깅 정보 표시 */}
            {process.env.NODE_ENV === 'development' && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs">
                <p className="font-semibold text-yellow-800 mb-2">🔍 디버깅 정보 (개발 모드)</p>
                <p><strong>이미지 파일:</strong> {formData.imageFile?.name || '없음'}</p>
                <p><strong>업로드된 URL:</strong> {formData.uploadedImageUrl || '없음'}</p>
                <p><strong>업로드 상태:</strong> {uploadingImage ? '업로드 중...' : '대기'}</p>
                {formData.uploadedImageUrl && (
                  <p><strong>URL 유효성:</strong> 
                    <a 
                      href={formData.uploadedImageUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 underline ml-1"
                    >
                      테스트 링크
                    </a>
                  </p>
                )}
              </div>
            )}
            
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400 bg-gray-50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              {uploadingImage ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6 text-blue-500 animate-pulse" />
                  </div>
                  <p className="text-sm text-blue-600">이미지 업로드 중...</p>
                  <p className="text-xs text-gray-500">Storage에 파일을 저장하고 있습니다.</p>
                </div>
              ) : formData.imageFile && formData.uploadedImageUrl ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-green-100 rounded-lg mx-auto flex items-center justify-center">
                    <Upload className="w-6 h-6 text-green-500" />
                  </div>
                  <p className="text-sm text-gray-700 font-medium">{formData.imageFile.name}</p>
                  <p className="text-xs text-green-600">✅ 업로드 완료</p>
                  <div className="text-xs text-gray-500 max-w-md mx-auto break-all">
                    URL: {formData.uploadedImageUrl}
                  </div>
                  <button
                    onClick={() => setFormData(prev => ({ ...prev, imageFile: null, uploadedImageUrl: null }))}
                    className="text-xs text-red-500 hover:text-red-600 transition-colors"
                  >
                    제거
                  </button>
                </div>
              ) : formData.imageFile && !formData.uploadedImageUrl ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-red-100 rounded-lg mx-auto flex items-center justify-center">
                    <X className="w-6 h-6 text-red-500" />
                  </div>
                  <p className="text-sm text-red-600">⚠️ 업로드 실패</p>
                  <p className="text-xs text-gray-500">파일은 선택되었지만 Storage 업로드에 실패했습니다.</p>
                  <button
                    onClick={() => handleImageUpload(formData.imageFile!)}
                    className="text-xs text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    다시 업로드
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded-lg mx-auto flex items-center justify-center mb-4">
                    <Plus className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 mb-3">캐릭터 이미지를 추가해주세요</p>
                  <p className="text-xs text-gray-500 mb-3">
                    JPG, PNG, WEBP (최대 5MB)
                  </p>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => e.target.files?.[0] && handleImageUpload(e.target.files[0])}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="inline-block px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors text-gray-700"
                  >
                    파일 선택
                  </label>
                </>
              )}
            </div>
          </div>

          {/* 이름 입력 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              이름
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="예: 아스모데우스"
                maxLength={10}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <span className="absolute right-3 top-3 text-xs text-gray-400">
                {formData.name.length}/10
              </span>
            </div>
          </div>

          {/* 성격 입력 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              성격
            </label>
            <textarea
              value={formData.personality}
              onChange={(e) => setFormData(prev => ({ ...prev, personality: e.target.value }))}
              placeholder="예: 천진난만하고 호기심이 많으며, 마법에 능숙합니다. 어른스럽지만 아이다운 면도 있어서 매력적이에요."
              rows={4}
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* 목소리 설정 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              목소리
            </label>
            <div className="relative">
              <select
                value={formData.voice}
                onChange={(e) => setFormData(prev => ({ ...prev, voice: e.target.value }))}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none pr-10"
              >
                {voiceOptions.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          {/* 태그 입력 */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-700">
              태그 <span className="text-sm text-gray-500">(검색에 사용됩니다)</span>
            </label>
            
            {/* 기존 태그 목록 */}
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-blue-500 hover:text-blue-700"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 새 태그 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                placeholder="예: 마법, 학생, 천재, 귀여운"
                className="flex-1 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <button
                type="button"
                onClick={addTag}
                disabled={!newTag.trim()}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            
            <p className="text-xs text-gray-500">
              💡 태그는 다른 사용자들이 캐릭터를 쉽게 찾을 수 있도록 도와줍니다. 
              Enter 키나 추가 버튼을 눌러 태그를 추가하세요.
            </p>

            {/* 추천 태그 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-2">추천 태그 예시</h3>
              <div className="flex flex-wrap gap-2">
                {['마법', '학생', '천재', '귀여운', '활발한', '신비로운', '친근한', '도우미'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (!formData.tags.includes(tag)) {
                        setFormData(prev => ({
                          ...prev,
                          tags: [...prev.tags, tag]
                        }))
                      }
                    }}
                    className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:bg-gray-100 hover:border-gray-300 transition-colors"
                  >
                    +{tag}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 주의사항 */}
          <div className="text-xs text-gray-500 space-y-1 p-4 bg-gray-50 rounded-lg">
            <p>⚠️ 저작권 침해 / 신상정보 등 비허락적인 캐릭터는 삭제될 수 있어요 <span className="text-blue-500 underline cursor-pointer">더보기</span></p>
          </div>

          {/* 캐릭터 생성 전 확인 정보 */}
          {process.env.NODE_ENV === 'development' && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="font-semibold text-blue-800 mb-2">📋 생성 전 확인사항</p>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>캐릭터 이름:</strong> {formData.name || '(미입력)'}</p>
                <p><strong>사용될 이미지:</strong> {formData.uploadedImageUrl ? '업로드된 이미지' : '기본 이미지 (girl.01.webp)'}</p>
                {formData.uploadedImageUrl && (
                  <p className="text-xs break-all"><strong>이미지 URL:</strong> {formData.uploadedImageUrl}</p>
                )}
                <p><strong>생성자:</strong> {user?.name || 'Guest'}</p>
              </div>
            </div>
          )}

          {/* 등록 버튼 */}
          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            캐릭터 추가 1/20
          </button>
        </div>

        {/* 약관 모달 */}
        <TermsModal 
          isOpen={showTerms} 
          onClose={handleAgree} 
        />
      </div>
    )
  }

  // 로그인하지 않은 경우 (개발 모드에서도 폼 접근 가능)
  if (!user) {
    return (
      <>
        <main className="max-w-6xl mx-auto px-4 py-16 pb-20 bg-gray-50 min-h-screen">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-xl md:text-2xl text-gray-700 font-medium">
                대화하고 싶은 캐릭터가 없다면
              </h1>
              <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">
                내가 원하는 캐릭터를 직접 제작해보세요
              </h2>
            </div>
            <div className="pt-8 space-y-4">
              <button 
                onClick={handleStartCreationWithoutLogin}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
              >
                <Plus className="w-5 h-5" />
                캐릭터 제작하기 (개발 모드)
              </button>
              <p className="text-sm text-gray-500">
                * 개발 단계: 로그인 없이 테스트 가능
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  // 로그인한 사용자의 경우 - 캐릭터 생성 폼이 활성화되지 않은 경우
  return (
    <>
      <main className="max-w-6xl mx-auto px-4 py-16 pb-20 bg-gray-50 min-h-screen">
        <div className="text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-xl md:text-2xl text-gray-700 font-medium">
              대화하고 싶은 캐릭터가 없다면
            </h1>
            <h2 className="text-2xl md:text-3xl text-gray-900 font-bold">
              내가 원하는 캐릭터를 직접 제작해보세요
            </h2>
          </div>
          <div className="pt-8">
            <button 
              onClick={handleStartCreation}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors duration-200 text-lg"
            >
              <Plus className="w-5 h-5" />
              캐릭터 제작하기
            </button>
          </div>
          <div className="pt-4">
            <button className="text-blue-600 hover:text-blue-700 underline transition-colors duration-200">
              캐릭터 추천 기준이 궁금해요
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default CreatePage 