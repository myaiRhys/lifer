import { get, set } from 'idb-keyval'
import { KEYS } from './keys'
import type { PowerUp, PurchasedPowerUp, PowerUpType } from '../types'

function generateUUID(): string {
  return crypto.randomUUID()
}

export const AVAILABLE_POWERUPS: Omit<PowerUp, 'id'>[] = [
  {
    name: "Double XP",
    description: "2x XP for all tasks for 1 hour",
    icon: "⚡",
    type: "double_xp",
    cost: 500,
    duration: 60, // minutes
    multiplier: 2
  },
  {
    name: "Streak Shield",
    description: "Protect your streak for 1 day - won't break even if you miss tasks",
    icon: "🛡️",
    type: "streak_shield",
    cost: 1000,
    duration: 1440 // minutes (24 hours)
  },
  {
    name: "Focus Boost",
    description: "30% more XP for high-leverage tasks (7+) for 2 hours",
    icon: "🎯",
    type: "focus_boost",
    cost: 300,
    duration: 120,
    multiplier: 1.3
  },
  {
    name: "XP Boost",
    description: "50% more XP for all tasks for 30 minutes",
    icon: "💫",
    type: "xp_boost",
    cost: 250,
    duration: 30,
    multiplier: 1.5
  },
  {
    name: "Time Freeze",
    description: "Freeze morning window for 2 extra hours",
    icon: "⏰",
    type: "time_freeze",
    cost: 400,
    duration: 120
  }
]

export async function getPurchasedPowerUps(): Promise<PurchasedPowerUp[]> {
  const powerUps = await get(KEYS.POWER_UPS)
  return powerUps || []
}

export async function purchasePowerUp(type: PowerUpType, cost: number, currentXP: number): Promise<{ success: boolean; powerUp?: PurchasedPowerUp; newXP?: number }> {
  if (currentXP < cost) {
    return { success: false }
  }

  const powerUps = await getPurchasedPowerUps()
  const newPowerUp: PurchasedPowerUp = {
    id: generateUUID(),
    powerUpType: type,
    purchasedAt: new Date().toISOString(),
    isActive: false
  }

  powerUps.push(newPowerUp)
  await set(KEYS.POWER_UPS, powerUps)

  return {
    success: true,
    powerUp: newPowerUp,
    newXP: currentXP - cost
  }
}

export async function activatePowerUp(powerUpId: string): Promise<PurchasedPowerUp | null> {
  const powerUps = await getPurchasedPowerUps()
  const powerUp = powerUps.find(p => p.id === powerUpId)

  if (!powerUp || powerUp.usedAt) return null

  const now = new Date()
  const definition = AVAILABLE_POWERUPS.find(p => p.type === powerUp.powerUpType)

  if (!definition) return null

  const expiresAt = new Date(now.getTime() + (definition.duration || 60) * 60 * 1000)

  powerUp.usedAt = now.toISOString()
  powerUp.expiresAt = expiresAt.toISOString()
  powerUp.isActive = true

  await set(KEYS.POWER_UPS, powerUps)
  return powerUp
}

export async function getActivePowerUps(): Promise<PurchasedPowerUp[]> {
  const powerUps = await getPurchasedPowerUps()
  const now = new Date()

  // Update expired power-ups
  let updated = false
  for (const powerUp of powerUps) {
    if (powerUp.isActive && powerUp.expiresAt) {
      if (new Date(powerUp.expiresAt) < now) {
        powerUp.isActive = false
        updated = true
      }
    }
  }

  if (updated) {
    await set(KEYS.POWER_UPS, powerUps)
  }

  return powerUps.filter(p => p.isActive)
}

export async function hasActivePowerUp(type: PowerUpType): Promise<boolean> {
  const active = await getActivePowerUps()
  return active.some(p => p.powerUpType === type)
}

export async function getXPMultiplier(): Promise<number> {
  const active = await getActivePowerUps()
  let multiplier = 1

  for (const powerUp of active) {
    const definition = AVAILABLE_POWERUPS.find(p => p.type === powerUp.powerUpType)
    if (definition?.multiplier) {
      multiplier *= definition.multiplier
    }
  }

  return multiplier
}

export async function getUnusedPowerUps(): Promise<PurchasedPowerUp[]> {
  const powerUps = await getPurchasedPowerUps()
  return powerUps.filter(p => !p.usedAt)
}
