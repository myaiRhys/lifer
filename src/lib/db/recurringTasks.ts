import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { RecurringTaskTemplate, Task } from '../types'
import { getTasks } from './tasks'

function generateUUID(): string {
  return crypto.randomUUID()
}

export async function getRecurringTaskTemplates(): Promise<RecurringTaskTemplate[]> {
  const templates = await get(KEYS.RECURRING_TASKS)
  return templates || []
}

export async function createRecurringTaskTemplate(
  data: Omit<RecurringTaskTemplate, 'id' | 'createdAt' | 'active'>
): Promise<RecurringTaskTemplate> {
  const templates = await getRecurringTaskTemplates()

  const newTemplate: RecurringTaskTemplate = {
    ...data,
    id: generateUUID(),
    active: true,
    createdAt: new Date().toISOString()
  }

  templates.push(newTemplate)
  await set(KEYS.RECURRING_TASKS, templates)

  return newTemplate
}

export async function updateRecurringTaskTemplate(
  id: string,
  updates: Partial<RecurringTaskTemplate>
): Promise<RecurringTaskTemplate | null> {
  const templates = await getRecurringTaskTemplates()
  const index = templates.findIndex(t => t.id === id)

  if (index === -1) return null

  templates[index] = { ...templates[index], ...updates }
  await set(KEYS.RECURRING_TASKS, templates)

  return templates[index]
}

export async function deleteRecurringTaskTemplate(id: string): Promise<boolean> {
  const templates = await getRecurringTaskTemplates()
  const filtered = templates.filter(t => t.id !== id)

  if (filtered.length === templates.length) return false

  await set(KEYS.RECURRING_TASKS, filtered)
  return true
}

export async function getActiveRecurringTaskTemplates(): Promise<RecurringTaskTemplate[]> {
  const templates = await getRecurringTaskTemplates()
  return templates.filter(t => t.active)
}

// Check if a recurring task has been spawned today
export async function hasSpawnedToday(templateId: string): Promise<boolean> {
  const tasks = await getTasks()
  const today = new Date().toDateString()

  return tasks.some(task =>
    task.recurringTemplateId === templateId &&
    new Date(task.createdAt).toDateString() === today
  )
}

// Spawn today's recurring tasks
export async function spawnTodaysRecurringTasks(): Promise<Task[]> {
  const templates = await getActiveRecurringTaskTemplates()
  const existingTasks = await getTasks()
  const today = new Date().toDateString()

  const newTasks: Task[] = []

  for (const template of templates) {
    // Check if already spawned today
    const alreadySpawned = existingTasks.some(task =>
      task.recurringTemplateId === template.id &&
      new Date(task.createdAt).toDateString() === today
    )

    if (!alreadySpawned) {
      const newTask: Task = {
        id: generateUUID(),
        title: template.title,
        description: template.description,
        leverageScore: template.leverageScore,
        outcomeId: template.outcomeId,
        isMorningTask: template.isMorningTask,
        completed: false,
        createdAt: new Date().toISOString(),
        isRecurring: true,
        recurringTemplateId: template.id
      }

      newTasks.push(newTask)
    }
  }

  if (newTasks.length > 0) {
    const allTasks = [...existingTasks, ...newTasks]
    await set(KEYS.TASKS, allTasks)
  }

  return newTasks
}

// Clean up old recurring tasks (optional - keeps only last 7 days)
export async function cleanupOldRecurringTasks(daysToKeep: number = 7): Promise<void> {
  const tasks = await getTasks()
  const cutoffDate = new Date()
  cutoffDate.setDate(cutoffDate.getDate() - daysToKeep)

  const filtered = tasks.filter(task => {
    if (!task.isRecurring || !task.completed) return true
    return new Date(task.completedAt!) > cutoffDate
  })

  await set(KEYS.TASKS, filtered)
}
