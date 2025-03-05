// 편지 관련 타입 정의
export interface Letter {
  id: string
  title: string
  content: string
  roomNumber: string
  sender?: string
  recipient?: string
  date: string
  read: boolean
}

// 편지 작성 폼 데이터 타입
export interface LetterFormData {
  sender: string
  recipient: string
  title: string
  content: string
}

// 편지 목록 컴포넌트 props
export interface LetterListProps {
  letters: Letter[]
  onLetterClick: (letter: Letter) => void
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
