class SoundSystem {
  private enabled: boolean = true

  toggle() {
    this.enabled = !this.enabled
  }

  taskComplete(leverageScore: number) {
    if (!this.enabled) return
    // Placeholder - will be implemented with Web Audio API later
    console.log(`Task complete sound: leverage ${leverageScore}`)
  }

  levelUp() {
    if (!this.enabled) return
    console.log('Level up sound!')
  }

  achievementUnlocked() {
    if (!this.enabled) return
    console.log('Achievement sound!')
  }

  streakMilestone(days: number) {
    if (!this.enabled) return
    console.log(`Streak milestone sound: ${days} days`)
  }

  powerUpActivated() {
    if (!this.enabled) return
    console.log('Power-up activated sound!')
  }
}

export const soundSystem = new SoundSystem()
