import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { HistoryRecord } from '../types'

function generateUUID(): string {
  return crypto.randomUUID()
}

export async function getHistory(): Promise<HistoryRecord[]> {
  const history = await get(KEYS.HISTORY)
  return history || []
}

export async function addHistoryRecord(record: Omit<HistoryRecord, 'id'>): Promise<void> {
  const history = await getHistory()

  const newRecord: HistoryRecord = {
    ...record,
    id: generateUUID()
  }

  history.push(newRecord)
  await set(KEYS.HISTORY, history)
}

export async function getHistoryByDate(date: string): Promise<HistoryRecord[]> {
  const history = await getHistory()
  return history.filter(h => h.completedAt.startsWith(date))
}

export async function getHistoryByType(type: 'task' | 'practice' | 'outcome'): Promise<HistoryRecord[]> {
  const history = await getHistory()
  return history.filter(h => h.type === type)
}

export async function getHistoryByDateRange(startDate: string, endDate: string): Promise<HistoryRecord[]> {
  const history = await getHistory()
  return history.filter(h => {
    const date = h.completedAt
    return date >= startDate && date <= endDate
  })
}
