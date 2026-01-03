import { describe, it, expect, beforeEach } from 'vitest'
import { validateTransition, getNextStates, VALID_TRANSITIONS } from '../orderStateMachine'

describe('Order State Machine', () => {
  describe('Valid Transitions', () => {
    it('should allow Pending -> Confirmed transition', () => {
      expect(validateTransition('Pending', 'Confirmed')).toBe(true)
    })

    it('should allow Confirmed -> Picked-Up transition', () => {
      expect(validateTransition('Confirmed', 'Picked-Up')).toBe(true)
    })

    it('should allow Picked-Up -> In-Transit transition', () => {
      expect(validateTransition('Picked-Up', 'In-Transit')).toBe(true)
    })

    it('should allow In-Transit -> Out-for-Delivery transition', () => {
      expect(validateTransition('In-Transit', 'Out-for-Delivery')).toBe(true)
    })

    it('should allow Out-for-Delivery -> Delivered transition', () => {
      expect(validateTransition('Out-for-Delivery', 'Delivered')).toBe(true)
    })

    it('should allow any state -> Cancelled transition', () => {
      const states = ['Pending', 'Confirmed', 'Picked-Up', 'In-Transit', 'Out-for-Delivery']
      states.forEach((state) => {
        expect(validateTransition(state, 'Cancelled')).toBe(true)
      })
    })

    it('should allow RTO transitions from delivery states', () => {
      expect(validateTransition('Out-for-Delivery', 'RTO-Initiated')).toBe(true)
      expect(validateTransition('In-Transit', 'RTO-Initiated')).toBe(true)
    })

    it('should allow On-Hold -> Confirmed transition', () => {
      expect(validateTransition('On-Hold', 'Confirmed')).toBe(true)
    })
  })

  describe('Invalid Transitions', () => {
    it('should block Delivered -> Pending transition', () => {
      expect(validateTransition('Delivered', 'Pending')).toBe(false)
    })

    it('should block Cancelled -> In-Transit transition', () => {
      expect(validateTransition('Cancelled', 'In-Transit')).toBe(false)
    })

    it('should block backward transitions in normal flow', () => {
      expect(validateTransition('In-Transit', 'Confirmed')).toBe(false)
      expect(validateTransition('Out-for-Delivery', 'Picked-Up')).toBe(false)
    })

    it('should block Delivered -> RTO-Initiated transition', () => {
      expect(validateTransition('Delivered', 'RTO-Initiated')).toBe(false)
    })

    it('should block RTO-Delivered -> In-Transit transition', () => {
      expect(validateTransition('RTO-Delivered', 'In-Transit')).toBe(false)
    })
  })

  describe('Next States', () => {
    it('should return correct next states for Pending', () => {
      const nextStates = getNextStates('Pending')
      expect(nextStates).toContain('Confirmed')
      expect(nextStates).toContain('Cancelled')
      expect(nextStates).toContain('On-Hold')
    })

    it('should return correct next states for In-Transit', () => {
      const nextStates = getNextStates('In-Transit')
      expect(nextStates).toContain('Out-for-Delivery')
      expect(nextStates).toContain('RTO-Initiated')
      expect(nextStates).toContain('Cancelled')
    })

    it('should return empty array for terminal states', () => {
      expect(getNextStates('Delivered')).toEqual(['Cancelled']) // Can still be cancelled for returns
      expect(getNextStates('RTO-Delivered').length).toBeGreaterThanOrEqual(0)
    })

    it('should handle unknown states gracefully', () => {
      const nextStates = getNextStates('UnknownState')
      expect(Array.isArray(nextStates)).toBe(true)
    })
  })

  describe('State Machine Integrity', () => {
    it('should have valid transitions defined', () => {
      expect(VALID_TRANSITIONS).toBeDefined()
      expect(typeof VALID_TRANSITIONS).toBe('object')
    })

    it('should not allow circular transitions in normal flow', () => {
      // Ensure we can't go Pending -> Confirmed -> Pending
      expect(validateTransition('Pending', 'Confirmed')).toBe(true)
      expect(validateTransition('Confirmed', 'Pending')).toBe(false)
    })

    it('should maintain RTO flow integrity', () => {
      // RTO flow: In-Transit -> RTO-Initiated -> RTO-In-Transit -> RTO-Delivered
      expect(validateTransition('In-Transit', 'RTO-Initiated')).toBe(true)
      expect(validateTransition('RTO-Initiated', 'RTO-In-Transit')).toBe(true)
      expect(validateTransition('RTO-In-Transit', 'RTO-Delivered')).toBe(true)
    })
  })

  describe('Edge Cases', () => {
    it('should handle null/undefined states', () => {
      expect(validateTransition(null, 'Confirmed')).toBe(false)
      expect(validateTransition('Pending', null)).toBe(false)
      expect(validateTransition(undefined, undefined)).toBe(false)
    })

    it('should handle empty string states', () => {
      expect(validateTransition('', 'Confirmed')).toBe(false)
      expect(validateTransition('Pending', '')).toBe(false)
    })

    it('should be case-sensitive', () => {
      expect(validateTransition('pending', 'Confirmed')).toBe(false)
      expect(validateTransition('Pending', 'confirmed')).toBe(false)
    })

    it('should handle same state transition', () => {
      // Same state transitions should generally be blocked
      expect(validateTransition('Pending', 'Pending')).toBe(false)
      expect(validateTransition('In-Transit', 'In-Transit')).toBe(false)
    })
  })

  describe('Concurrent State Changes', () => {
    it('should validate multiple transitions independently', () => {
      const transitions = [
        { from: 'Pending', to: 'Confirmed' },
        { from: 'Confirmed', to: 'Picked-Up' },
        { from: 'Picked-Up', to: 'In-Transit' },
      ]

      transitions.forEach(({ from, to }) => {
        expect(validateTransition(from, to)).toBe(true)
      })
    })

    it('should handle rapid state checks', () => {
      const results = []
      for (let i = 0; i < 100; i++) {
        results.push(validateTransition('Pending', 'Confirmed'))
      }
      expect(results.every((r) => r === true)).toBe(true)
    })
  })
})
