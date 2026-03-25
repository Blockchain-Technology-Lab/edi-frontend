import { useCallback, useEffect, useRef } from 'react'

type UseContributorSectionNavigationOptions = {
  currentPath: string
  contributorPath: string
  navigateToContributor: () => void
}

function runAfterPaint(task: () => void) {
  requestAnimationFrame(() => {
    requestAnimationFrame(task)
  })
}

export function useContributorSectionNavigation({
  currentPath,
  contributorPath,
  navigateToContributor
}: UseContributorSectionNavigationOptions) {
  const contributorRef = useRef<HTMLDivElement | null>(null)

  const scrollToContributor = useCallback(() => {
    runAfterPaint(() => {
      contributorRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      })
    })
  }, [])

  useEffect(() => {
    if (currentPath === contributorPath) {
      scrollToContributor()
    }
  }, [currentPath, contributorPath, scrollToContributor])

  const handleContributorScrollClick = useCallback(() => {
    if (currentPath === contributorPath) {
      scrollToContributor()
      return
    }

    navigateToContributor()
  }, [currentPath, contributorPath, navigateToContributor, scrollToContributor])

  return { contributorRef, handleContributorScrollClick }
}
