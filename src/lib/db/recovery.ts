import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { RecoveryEvent, Practice } from '../types'

// Get all recovery events
export async function getRecoveryEvents(): Promise<RecoveryEvent[]> {
  const events = await get(KEYS.RECOVERY_EVENTS)
  return events || []
}

// Get recovery events for a specific practice
export async function getRecoveryEventsForPractice(practiceId: string): Promise<RecoveryEvent[]> {
  const events = await getRecoveryEvents()
  return events.filter(e => e.practiceId === practiceId)
}

// Record a recovery event
export async function recordRecovery(
  practice: Practice,
  missedDate: string,
  missCount: number,
  strategy?: string
): Promise<RecoveryEvent> {
  const events = await getRecoveryEvents()

  const event: RecoveryEvent = {
    id: crypto.randomUUID(),
    practiceId: practice.id,
    practiceName: practice.name,
    missedDate,
    recoveredDate: new Date().toISOString().split('T')[0],
    missCount,
    recoveryStrategy: strategy,
    timestamp: new Date().toISOString()
  }

  await set(KEYS.RECOVERY_EVENTS, [...events, event])
  return event
}

// Check if practice should be marked at risk
export async function checkMissedPractices(): Promise<Practice[]> {
  const { getPractices, getTodaysPractices } = await import('./practices')

  const allPractices = await getPractices()
  const todaysPractices = await getTodaysPractices()

  const now = new Date()
  const today = now.toDateString()
  const atRiskPractices: Practice[] = []

  for (const practice of todaysPractices) {
    const lastLogged = new Date(practice.lastLoggedAt)
    const lastLoggedDate = lastLogged.toDateString()

    // Check if practice was supposed to be done but wasn't
    const daysSinceLastLog = Math.floor((now.getTime() - lastLogged.getTime()) / (1000 * 60 * 60 * 24))

    // If it's a new day and they haven't logged yet
    if (today !== lastLoggedDate && daysSinceLastLog >= 1) {
      const consecutiveMisses = (practice.consecutiveMisses || 0) + 1

      // Only mark at risk on first miss
      if (consecutiveMisses === 1) {
        atRiskPractices.push({
          ...practice,
          consecutiveMisses,
          lastMissDate: new Date().toISOString().split('T')[0],
          atRisk: true
        })
      }
    }
  }

  return atRiskPractices
}

// Update practice with recovery tracking
export async function updatePracticeRecoveryStatus(
  practice: Practice,
  completed: boolean
): Promise<Practice> {
  const { updatePractice } = await import('./practices')

  const consecutiveMisses = practice.consecutiveMisses || 0
  const lastMissDate = practice.lastMissDate
  const wasAtRisk = practice.atRisk || false

  let updates: Partial<Practice> = {}

  if (completed) {
    // They completed it!
    if (wasAtRisk && consecutiveMisses > 0 && lastMissDate) {
      // Record recovery
      await recordRecovery(practice, lastMissDate, consecutiveMisses)

      updates = {
        consecutiveMisses: 0,
        atRisk: false,
        recoveryCount: (practice.recoveryCount || 0) + 1
      }
    } else {
      // Normal completion, just reset
      updates = {
        consecutiveMisses: 0,
        atRisk: false
      }
    }
  } else {
    // They missed
    const newMissCount = consecutiveMisses + 1

    updates = {
      consecutiveMisses: newMissCount,
      lastMissDate: new Date().toISOString().split('T')[0],
      atRisk: newMissCount === 1 // Only mark at risk on first miss
    }
  }

  const result = await updatePractice(practice.id, updates)
  return result || practice
}

// Get recovery stats for a practice
export async function getRecoveryStats(practiceId: string): Promise<{
  totalRecoveries: number
  averageMissCount: number
  lastRecoveryDate?: string
  longestRecoveryStreak: number
}> {
  const events = await getRecoveryEventsForPractice(practiceId)

  if (events.length === 0) {
    return {
      totalRecoveries: 0,
      averageMissCount: 0,
      longestRecoveryStreak: 0
    }
  }

  const totalRecoveries = events.length
  const averageMissCount = events.reduce((sum, e) => sum + e.missCount, 0) / totalRecoveries
  const lastRecoveryDate = events[events.length - 1]?.recoveredDate

  // Calculate longest recovery streak (consecutive recoveries)
  let currentRecoveryStreak = 0
  let longestRecoveryStreak = 0

  for (const event of events) {
    if (event.missCount === 1) {
      currentRecoveryStreak++
      longestRecoveryStreak = Math.max(longestRecoveryStreak, currentRecoveryStreak)
    } else {
      currentRecoveryStreak = 0
    }
  }

  return {
    totalRecoveries,
    averageMissCount,
    lastRecoveryDate,
    longestRecoveryStreak
  }
}

// Get recovery suggestions based on practice characteristics
export function getRecoverySuggestions(practice: Practice): string[] {
  const suggestions: string[] = []

  // Based on consecutive misses
  const misses = practice.consecutiveMisses || 0

  if (misses === 1) {
    // First miss - encouraging recovery prompts
    suggestions.push("You missed once—that's an accident. Let's get back on track today!")
    suggestions.push("Your streak isn't broken yet. One small action now saves your progress.")
    suggestions.push(`Remember: "I am a person who ${practice.name.toLowerCase()}." Prove it today.`)

    // Based on Four Laws if available
    if (practice.fourLaws) {
      if (practice.fourLaws.easy.gateway) {
        suggestions.push(`Start with just: "${practice.fourLaws.easy.gateway}" (your 2-min version)`)
      }
      if (practice.fourLaws.obvious.time && practice.fourLaws.obvious.location) {
        suggestions.push(`Do it NOW: ${practice.fourLaws.obvious.time} at ${practice.fourLaws.obvious.location}`)
      }
      if (practice.fourLaws.attractive.bundle) {
        suggestions.push(`Reward yourself: ${practice.fourLaws.attractive.bundle}`)
      }
    }

    // Based on practice type
    if (practice.type === 'positive') {
      suggestions.push(`Even ${Math.floor(practice.target * 0.5)} ${practice.unit} is better than 0.`)
      suggestions.push("Lower the bar for today. Just show up.")
    }

    // Based on leverage score
    if (practice.leverageScore && practice.leverageScore >= 7) {
      suggestions.push("This is high-leverage. Missing it twice compounds negatively.")
    }
  } else if (misses >= 2) {
    // Second miss - more urgent
    suggestions.push("⚠️ STOP. Missing twice is the start of a new (bad) habit.")
    suggestions.push("This is the moment. What you do next defines who you become.")
    suggestions.push("Emergency protocol: Do ANY version of this habit in the next 5 minutes.")

    if (practice.fourLaws?.easy.gateway) {
      suggestions.push(`RIGHT NOW: "${practice.fourLaws.easy.gateway}" — that's all.`)
    } else {
      suggestions.push(`RIGHT NOW: Do just 10% of "${practice.name}" — that's all.`)
    }
  }

  // Add recovery count if they've bounced back before
  if (practice.recoveryCount && practice.recoveryCount > 0) {
    suggestions.push(`You've bounced back ${practice.recoveryCount} time${practice.recoveryCount > 1 ? 's' : ''} before. You can do it again.`)
  }

  return suggestions
}

// Get all at-risk practices (missed once)
export async function getAtRiskPractices(): Promise<Practice[]> {
  const { getPractices } = await import('./practices')
  const practices = await getPractices()
  return practices.filter(p => p.atRisk === true)
}

// Get all critical practices (missed twice or more)
export async function getCriticalPractices(): Promise<Practice[]> {
  const { getPractices } = await import('./practices')
  const practices = await getPractices()
  return practices.filter(p => (p.consecutiveMisses || 0) >= 2)
}
