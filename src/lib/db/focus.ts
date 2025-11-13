import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { FocusSession } from '../types'

function generateUUID(): string {
  return crypto.randomUUID()
}

export async function getFocusSessions(): Promise<FocusSession[]> {
  const sessions = await get(KEYS.FOCUS_SESSIONS)
  return sessions || []
}

export async function createFocusSession(
  type: 'pomodoro' | 'deep_work',
  duration: number,
  taskId?: string
): Promise<FocusSession> {
  const sessions = await getFocusSessions()

  const newSession: FocusSession = {
    id: generateUUID(),
    type,
    duration,
    taskId,
    startedAt: new Date().toISOString(),
    xpEarned: 0,
    interrupted: false
  }

  sessions.push(newSession)
  await set(KEYS.FOCUS_SESSIONS, sessions)

  return newSession
}

export async function completeFocusSession(
  id: string,
  xpEarned: number,
  interrupted: boolean = false
): Promise<FocusSession | null> {
  const sessions = await getFocusSessions()
  const session = sessions.find(s => s.id === id)

  if (!session) return null

  session.completedAt = new Date().toISOString()
  session.xpEarned = xpEarned
  session.interrupted = interrupted

  await set(KEYS.FOCUS_SESSIONS, sessions)

  return session
}

export async function getTodaysFocusSessions(): Promise<FocusSession[]> {
  const sessions = await getFocusSessions()
  const today = new Date().toDateString()

  return sessions.filter(s => {
    const sessionDate = new Date(s.startedAt).toDateString()
    return sessionDate === today
  })
}

export async function getTotalFocusTime(): Promise<number> {
  const sessions = await getFocusSessions()
  return sessions
    .filter(s => s.completedAt && !s.interrupted)
    .reduce((total, s) => total + s.duration, 0)
}
