import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { MarginalGainLog, MarginalGainStats } from '../types'

// Get all marginal gain logs
export async function getMarginalGainLogs(): Promise<MarginalGainLog[]> {
  const logs = await get<MarginalGainLog[]>(KEYS.MARGINAL_GAIN_LOGS)
  return logs || []
}

// Get today's marginal gain log
export async function getTodayMarginalGains(): Promise<MarginalGainLog[]> {
  const logs = await getMarginalGainLogs()
  const today = new Date().toISOString().split('T')[0]
  return logs.filter(log => log.date === today)
}

// Log a marginal gain
export async function logMarginalGain(
  category: MarginalGainLog['category'],
  description: string,
  improvementPercent: number,
  practiceId?: string
): Promise<MarginalGainLog> {
  const logs = await getMarginalGainLogs()
  const today = new Date().toISOString().split('T')[0]

  const newLog: MarginalGainLog = {
    id: crypto.randomUUID(),
    date: today,
    category,
    description,
    improvementPercent,
    practiceId,
    createdAt: new Date().toISOString()
  }

  await set(KEYS.MARGINAL_GAIN_LOGS, [...logs, newLog])
  return newLog
}

// Delete a marginal gain log
export async function deleteMarginalGainLog(id: string): Promise<void> {
  const logs = await getMarginalGainLogs()
  const filtered = logs.filter(log => log.id !== id)
  await set(KEYS.MARGINAL_GAIN_LOGS, filtered)
}

// Get marginal gain statistics
export async function getMarginalGainStats(): Promise<MarginalGainStats> {
  const logs = await getMarginalGainLogs()

  if (logs.length === 0) {
    return {
      totalDays: 0,
      totalImprovements: 0,
      avgDailyImprovement: 0,
      currentMultiplier: 1,
      categoryBreakdown: [],
      longestStreak: 0,
      currentStreak: 0
    }
  }

  // Count unique days with improvements
  const uniqueDates = new Set(logs.map(log => log.date))
  const totalDays = uniqueDates.size

  // Calculate average daily improvement
  const totalImprovement = logs.reduce((sum, log) => sum + log.improvementPercent, 0)
  const avgDailyImprovement = totalImprovement / logs.length

  // Calculate current multiplier based on compound growth
  // Using avgDailyImprovement: (1 + avgImprovement/100)^totalDays
  const dailyMultiplier = 1 + (avgDailyImprovement / 100)
  const currentMultiplier = Math.pow(dailyMultiplier, totalDays)

  // Category breakdown
  const categoryMap = new Map<string, { count: number; totalImprovement: number }>()
  logs.forEach(log => {
    const existing = categoryMap.get(log.category) || { count: 0, totalImprovement: 0 }
    categoryMap.set(log.category, {
      count: existing.count + 1,
      totalImprovement: existing.totalImprovement + log.improvementPercent
    })
  })

  const categoryBreakdown = Array.from(categoryMap.entries()).map(([category, data]) => ({
    category,
    count: data.count,
    avgImprovement: data.totalImprovement / data.count
  }))

  // Calculate streaks
  const sortedDates = Array.from(uniqueDates).sort()
  const { longestStreak, currentStreak } = calculateStreaks(sortedDates)

  return {
    totalDays,
    totalImprovements: logs.length,
    avgDailyImprovement,
    currentMultiplier,
    categoryBreakdown,
    longestStreak,
    currentStreak
  }
}

// Helper function to calculate streaks from sorted dates
function calculateStreaks(sortedDates: string[]): { longestStreak: number; currentStreak: number } {
  if (sortedDates.length === 0) {
    return { longestStreak: 0, currentStreak: 0 }
  }

  let longestStreak = 1
  let currentStreakCount = 1
  let tempStreak = 1

  const today = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1])
    const currDate = new Date(sortedDates[i])
    const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      tempStreak++
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
    } else {
      tempStreak = 1
    }
  }

  // Calculate current streak
  const lastDate = sortedDates[sortedDates.length - 1]
  if (lastDate === today || lastDate === yesterday) {
    // Count backwards from last date
    currentStreakCount = 1
    for (let i = sortedDates.length - 2; i >= 0; i--) {
      const prevDate = new Date(sortedDates[i])
      const currDate = new Date(sortedDates[i + 1])
      const diffDays = Math.floor((currDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24))

      if (diffDays === 1) {
        currentStreakCount++
      } else {
        break
      }
    }
  } else {
    currentStreakCount = 0
  }

  return { longestStreak, currentStreak: currentStreakCount }
}

// Calculate compound growth projection
export function calculateProjection(
  avgDailyImprovement: number,
  days: number
): { multiplier: number; percentIncrease: number } {
  const dailyMultiplier = 1 + (avgDailyImprovement / 100)
  const multiplier = Math.pow(dailyMultiplier, days)
  const percentIncrease = (multiplier - 1) * 100

  return { multiplier, percentIncrease }
}

// Get example 1% improvement suggestions
export const MARGINAL_GAIN_EXAMPLES = {
  skill: [
    'Read 10 pages of a technical book',
    'Practice coding for 15 minutes',
    'Watch one tutorial video',
    'Learn 5 new vocabulary words',
    'Complete one coding challenge'
  ],
  health: [
    'Drink one extra glass of water',
    'Take a 10-minute walk',
    'Sleep 15 minutes earlier',
    'Eat one serving of vegetables',
    'Stretch for 5 minutes'
  ],
  productivity: [
    'Use Pomodoro for one task',
    'Clear inbox to zero',
    'Organize one file/folder',
    'Plan tomorrow\'s top 3',
    'Eliminate one distraction'
  ],
  relationship: [
    'Send a thoughtful message',
    'Active listen for 10 minutes',
    'Give one genuine compliment',
    'Plan one quality time activity',
    'Express gratitude for something'
  ],
  mindset: [
    'Journal 3 gratitude items',
    'Meditate for 5 minutes',
    'Reframe one negative thought',
    'Celebrate one small win',
    'Practice self-compassion once'
  ]
}

// Get logs for a specific date range
export async function getMarginalGainsInRange(startDate: string, endDate: string): Promise<MarginalGainLog[]> {
  const logs = await getMarginalGainLogs()
  return logs.filter(log => log.date >= startDate && log.date <= endDate)
}

// Get logs by category
export async function getMarginalGainsByCategory(category: MarginalGainLog['category']): Promise<MarginalGainLog[]> {
  const logs = await getMarginalGainLogs()
  return logs.filter(log => log.category === category)
}

// Calculate the famous "1% better" vs "1% worse" comparison
export function getOnePercentComparison(days: number): {
  better: { multiplier: number; percentIncrease: number }
  worse: { multiplier: number; percentDecrease: number }
  difference: number
} {
  const betterMultiplier = Math.pow(1.01, days)
  const worseMultiplier = Math.pow(0.99, days)

  return {
    better: {
      multiplier: betterMultiplier,
      percentIncrease: (betterMultiplier - 1) * 100
    },
    worse: {
      multiplier: worseMultiplier,
      percentDecrease: (1 - worseMultiplier) * 100
    },
    difference: betterMultiplier / worseMultiplier
  }
}
