import { useRef } from 'react'

export type DivRef = React.RefObject<HTMLDivElement | null>

export const useAboutUsRefs = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const introRef = useRef<HTMLDivElement | null>(null)
  const descriptionRef = useRef<HTMLDivElement | null>(null)
  const topRowRef = useRef<HTMLDivElement | null>(null)
  const bottomRowRef = useRef<HTMLDivElement | null>(null)

  const bottomCardRef1 = useRef<HTMLDivElement | null>(null)
  const bottomCardRef2 = useRef<HTMLDivElement | null>(null)

  const bottomCardRefs: DivRef[] = [bottomCardRef1, bottomCardRef2]

  return {
    containerRef,
    introRef,
    descriptionRef,
    topRowRef,
    bottomRowRef,
    bottomCardRefs,
  }
}
