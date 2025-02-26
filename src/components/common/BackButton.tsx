import { useRouter } from 'next/router';
import { BackButton as StyledBackButton } from '@/pages/matching/styles';

export default function BackButton() {
    const router = useRouter();

    return (
        <StyledBackButton onClick={() => router.back()}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                    d="M19 12H5M12 19l-7-7 7-7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </StyledBackButton>
    );
} 