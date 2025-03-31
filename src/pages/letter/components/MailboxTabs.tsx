import React from 'react'
import * as S from '../letter-styles'
import { MailboxTabsProps } from '../types'

/**
 * 편지함 탭 컴포넌트
 */
const MailboxTabs: React.FC<MailboxTabsProps> = ({ activeTab, onTabChange }) => {
  return (
    <S.TabHeader>
      <S.Tab
        $active={activeTab === 'received'}
        onClick={() => onTabChange('received')}
      >
        받은 마음의 편지
      </S.Tab>
      <S.Tab 
        $active={activeTab === 'sent'} 
        onClick={() => onTabChange('sent')}
      >
        보낸 마음의 편지
      </S.Tab>
    </S.TabHeader>
  )
}

export default MailboxTabs
