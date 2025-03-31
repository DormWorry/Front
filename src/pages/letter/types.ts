// 편지 관련 타입 정의
export interface Letter {
  id: number
  title: string
  content: string
  senderRoomNumber: string
  senderName: string
  recipientRoomNumber: string
  recipientName: string
  createdAt: string
  isAnonymous: boolean
  read?: boolean
}

// 편지 작성 폼 데이터 타입
export interface LetterFormData {
  sender: string
  recipient: string
  title: string
  content: string
  isAnonymous?: boolean
}

// 편지 목록 컴포넌트 props
export interface LetterListProps {
  letters: Letter[]
  onLetterClick: (letterId: number) => void
  needsScroll: boolean
  onScroll: () => void
  isScrolledToBottom: boolean
  isEmptyMessage: string
}

// 편지 상세 컴포넌트 props
export interface LetterDetailProps {
  letter: Letter | null
  onClose: () => void
  onReply: (recipient: string) => void
  isReceived?: boolean
}

// 편지 작성 폼 props
export interface ComposeFormProps {
  onCancel: () => void
  onSubmit: (formData: LetterFormData) => void
  initialRecipient?: string
}

// ComposeSectionProps 타입 추가
export interface ComposeSectionProps {
  onReturn: () => void
  onSubmit: (data: LetterFormData) => void
  initialRecipient: string | null
}

// API 요청 타입
export interface LetterApiRequest {
  title: string
  content: string
  to: string
  isAnonymous?: boolean
}

// 레이아웃 컴포넌트 props
export interface MailboxLayoutProps {
  children: React.ReactNode
  onGoBack: () => void
}

// 프로필 컴포넌트 props
export interface ProfileProps {
  roomNumber: string
  userName: string
  avatarSrc: string
  onComposeClick: () => void
  onImageError: () => void
  imageError: boolean
}

// 탭 컴포넌트 props
export interface MailboxTabsProps {
  activeTab: 'sent' | 'received'
  onTabChange: (tab: 'sent' | 'received') => void
}
