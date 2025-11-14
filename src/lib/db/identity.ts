import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { Identity, IdentityVote, IdentityEvidence, IdentityAlignment } from '../types'

// ============================================================================
// IDENTITY
// ============================================================================

export async function getIdentity(): Promise<Identity | null> {
  return await get(KEYS.IDENTITY) || null
}

export async function setIdentity(statement: string): Promise<Identity> {
  const existing = await getIdentity()

  const identity: Identity = {
    id: existing?.id || crypto.randomUUID(),
    statement,
    createdAt: existing?.createdAt || new Date().toISOString(),
    lastUpdated: new Date().toISOString()
  }

  await set(KEYS.IDENTITY, identity)
  return identity
}

export async function deleteIdentity(): Promise<void> {
  await set(KEYS.IDENTITY, null)
  // Also clear all related data
  await set(KEYS.IDENTITY_VOTES, [])
  await set(KEYS.IDENTITY_EVIDENCE, [])
  await set(KEYS.IDENTITY_ALIGNMENT, [])
}

// ============================================================================
// IDENTITY VOTES
// ============================================================================

export async function getIdentityVotes(): Promise<IdentityVote[]> {
  return await get(KEYS.IDENTITY_VOTES) || []
}

export async function addIdentityVote(
  action: string,
  actionType: IdentityVote['actionType'],
  direction: 'for' | 'against',
  entityId?: string,
  context?: string
): Promise<IdentityVote> {
  const identity = await getIdentity()
  if (!identity) {
    throw new Error('No identity set. Please create identity first.')
  }

  const votes = await getIdentityVotes()

  const vote: IdentityVote = {
    id: crypto.randomUUID(),
    identityId: identity.id,
    action,
    actionType,
    entityId,
    direction,
    timestamp: new Date().toISOString(),
    context
  }

  votes.push(vote)
  await set(KEYS.IDENTITY_VOTES, votes)

  // Update daily alignment
  await updateDailyAlignment()

  return vote
}

export async function getTodayVotes(): Promise<IdentityVote[]> {
  const votes = await getIdentityVotes()
  const today = new Date().toISOString().split('T')[0]

  return votes.filter(vote => vote.timestamp.startsWith(today))
}

export async function getVotesForDateRange(startDate: string, endDate: string): Promise<IdentityVote[]> {
  const votes = await getIdentityVotes()
  return votes.filter(vote => {
    const voteDate = vote.timestamp.split('T')[0]
    return voteDate >= startDate && voteDate <= endDate
  })
}

// ============================================================================
// IDENTITY EVIDENCE
// ============================================================================

export async function getIdentityEvidence(): Promise<IdentityEvidence[]> {
  return await get(KEYS.IDENTITY_EVIDENCE) || []
}

export async function addIdentityEvidence(
  description: string,
  category: IdentityEvidence['category'],
  linkedEntityId?: string
): Promise<IdentityEvidence> {
  const identity = await getIdentity()
  if (!identity) {
    throw new Error('No identity set. Please create identity first.')
  }

  const evidence = await getIdentityEvidence()

  const newEvidence: IdentityEvidence = {
    id: crypto.randomUUID(),
    identityId: identity.id,
    description,
    category,
    linkedEntityId,
    addedAt: new Date().toISOString()
  }

  evidence.push(newEvidence)
  await set(KEYS.IDENTITY_EVIDENCE, evidence)

  return newEvidence
}

export async function deleteIdentityEvidence(evidenceId: string): Promise<void> {
  const evidence = await getIdentityEvidence()
  const filtered = evidence.filter(e => e.id !== evidenceId)
  await set(KEYS.IDENTITY_EVIDENCE, filtered)
}

// ============================================================================
// IDENTITY ALIGNMENT (DAILY TRACKING)
// ============================================================================

export async function getIdentityAlignment(): Promise<IdentityAlignment[]> {
  return await get(KEYS.IDENTITY_ALIGNMENT) || []
}

export async function getTodayAlignment(): Promise<IdentityAlignment | null> {
  const alignments = await getIdentityAlignment()
  const today = new Date().toISOString().split('T')[0]

  return alignments.find(a => a.date === today) || null
}

export async function updateDailyAlignment(): Promise<IdentityAlignment> {
  const today = new Date().toISOString().split('T')[0]
  const todayVotes = await getTodayVotes()

  const votesFor = todayVotes.filter(v => v.direction === 'for').length
  const votesAgainst = todayVotes.filter(v => v.direction === 'against').length
  const totalVotes = votesFor + votesAgainst
  const percentage = totalVotes > 0 ? Math.round((votesFor / totalVotes) * 100) : 0

  const alignment: IdentityAlignment = {
    date: today,
    votesFor,
    votesAgainst,
    percentage,
    totalVotes
  }

  const alignments = await getIdentityAlignment()
  const existingIndex = alignments.findIndex(a => a.date === today)

  if (existingIndex >= 0) {
    alignments[existingIndex] = alignment
  } else {
    alignments.push(alignment)
  }

  await set(KEYS.IDENTITY_ALIGNMENT, alignments)

  return alignment
}

export async function getWeeklyAlignment(): Promise<{
  average: number
  alignments: IdentityAlignment[]
}> {
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
  const startDate = sevenDaysAgo.toISOString().split('T')[0]
  const endDate = now.toISOString().split('T')[0]

  const alignments = await getIdentityAlignment()
  const weekAlignments = alignments.filter(a => a.date >= startDate && a.date <= endDate)

  const average = weekAlignments.length > 0
    ? Math.round(weekAlignments.reduce((sum, a) => sum + a.percentage, 0) / weekAlignments.length)
    : 0

  return { average, alignments: weekAlignments }
}

// ============================================================================
// AUTO-EVIDENCE GENERATION (from achievements, streaks, etc.)
// ============================================================================

export async function autoAddStreakEvidence(practiceId: string, practiceName: string, streak: number): Promise<void> {
  // Only add evidence for significant streaks (7, 30, 50, 100 days)
  const milestones = [7, 30, 50, 100, 365]
  if (!milestones.includes(streak)) return

  const identity = await getIdentity()
  if (!identity) return

  const description = `${streak}-day streak: ${practiceName}`
  await addIdentityEvidence(description, 'streak', practiceId)
}

export async function autoAddAchievementEvidence(achievementName: string, achievementId: string): Promise<void> {
  const identity = await getIdentity()
  if (!identity) return

  const description = `Unlocked: ${achievementName}`
  await addIdentityEvidence(description, 'achievement', achievementId)
}

export async function autoAddCompletionEvidence(milestone: string, entityId?: string): Promise<void> {
  const identity = await getIdentity()
  if (!identity) return

  await addIdentityEvidence(milestone, 'completion', entityId)
}

// ============================================================================
// HELPER: CHECK IF ACTION ALIGNS WITH IDENTITY
// ============================================================================

export function checkIdentityAlignment(action: string, identityStatement: string): 'for' | 'against' | 'neutral' {
  // Simple keyword matching - can be enhanced with NLP later
  // For now, assume user explicitly marks actions as aligned or not
  // This function is a placeholder for future smart detection

  // Default to neutral - user will explicitly vote
  return 'neutral'
}

// ============================================================================
// STATISTICS
// ============================================================================

export async function getIdentityStats(): Promise<{
  totalVotes: number
  totalFor: number
  totalAgainst: number
  lifetimePercentage: number
  currentStreak: number
  longestStreak: number
  totalEvidence: number
}> {
  const votes = await getIdentityVotes()
  const evidence = await getIdentityEvidence()
  const alignments = await getIdentityAlignment()

  const totalFor = votes.filter(v => v.direction === 'for').length
  const totalAgainst = votes.filter(v => v.direction === 'against').length
  const totalVotes = votes.length
  const lifetimePercentage = totalVotes > 0 ? Math.round((totalFor / totalVotes) * 100) : 0

  // Calculate current streak of days with 80%+ alignment
  let currentStreak = 0
  let longestStreak = 0
  let tempStreak = 0

  // Sort alignments by date descending
  const sortedAlignments = [...alignments].sort((a, b) => b.date.localeCompare(a.date))

  for (const alignment of sortedAlignments) {
    if (alignment.percentage >= 80) {
      tempStreak++
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak
      }
    } else {
      if (currentStreak === 0) {
        // First non-80% day sets current streak
        currentStreak = tempStreak
      }
      tempStreak = 0
    }
  }

  // If all days have 80%+, current streak = temp streak
  if (currentStreak === 0 && tempStreak > 0) {
    currentStreak = tempStreak
  }

  return {
    totalVotes,
    totalFor,
    totalAgainst,
    lifetimePercentage,
    currentStreak,
    longestStreak,
    totalEvidence: evidence.length
  }
}
