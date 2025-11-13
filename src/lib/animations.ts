export function celebrateTaskComplete(leverageScore: number) {
  // Placeholder - will be implemented later
  console.log(`Task completed with leverage: ${leverageScore}`)
}

export function celebrateAchievement() {
  // Placeholder - will be implemented later
  console.log('Achievement unlocked!')
}

export function celebrateLevelUp() {
  // Placeholder - will be implemented later
  console.log('Level up!')
}

export function celebrateStreak(days: number) {
  // Placeholder - will be implemented later
  console.log(`Streak: ${days} days`)
}

export function showFloatingXP(element: HTMLElement, xp: number) {
  // Placeholder - will be implemented later
  console.log(`+${xp} XP`)
}

export function hapticFeedback(type: 'light' | 'medium' | 'heavy') {
  // Placeholder - will be implemented later
  if ('vibrate' in navigator) {
    const patterns = {
      light: [10],
      medium: [20],
      heavy: [30]
    }
    navigator.vibrate(patterns[type])
  }
}
