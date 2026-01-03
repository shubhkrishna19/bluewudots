/**
 * Date/Time Utilities
 * Advanced date/time operations including scheduling, timezone handling, and calendar utilities
 */

/**
 * Get current date in ISO format
 */
const now = () => new Date().toISOString()

/**
 * Get current Unix timestamp
 */
const timestamp = () => Date.now()

/**
 * Add days to a date
 * @param {Date|string} date - Start date
 * @param {number} days - Number of days to add
 */
const addDays = (date, days) => {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

/**
 * Add hours to a date
 * @param {Date|string} date - Start date
 * @param {number} hours - Number of hours to add
 */
const addHours = (date, hours) => {
  const d = new Date(date)
  d.setHours(d.getHours() + hours)
  return d
}

/**
 * Add minutes to a date
 * @param {Date|string} date - Start date
 * @param {number} minutes - Number of minutes to add
 */
const addMinutes = (date, minutes) => {
  const d = new Date(date)
  d.setMinutes(d.getMinutes() + minutes)
  return d
}

/**
 * Get difference between two dates in days
 */
const daysBetween = (date1, date2) => {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24))
}

/**
 * Get difference between two dates in hours
 */
const hoursBetween = (date1, date2) => {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.floor((d2 - d1) / (1000 * 60 * 60))
}

/**
 * Get difference between two dates in minutes
 */
const minutesBetween = (date1, date2) => {
  const d1 = new Date(date1).getTime()
  const d2 = new Date(date2).getTime()
  return Math.floor((d2 - d1) / (1000 * 60))
}

/**
 * Check if date is in the past
 */
const isPast = (date) => new Date(date) < new Date()

/**
 * Check if date is in the future
 */
const isFuture = (date) => new Date(date) > new Date()

/**
 * Check if date is today
 */
const isToday = (date) => {
  const today = new Date()
  const d = new Date(date)
  return (
    d.getDate() === today.getDate() &&
    d.getMonth() === today.getMonth() &&
    d.getFullYear() === today.getFullYear()
  )
}

/**
 * Check if date is tomorrow
 */
const isTomorrow = (date) => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return isToday(date, tomorrow)
}

/**
 * Get start of day
 */
const startOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  return d
}

/**
 * Get end of day
 */
const endOfDay = (date = new Date()) => {
  const d = new Date(date)
  d.setHours(23, 59, 59, 999)
  return d
}

/**
 * Get start of week
 */
const startOfWeek = (date = new Date()) => {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

/**
 * Get start of month
 */
const startOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/**
 * Get end of month
 */
const endOfMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0)
}

/**
 * Get all days in a month
 */
const getDaysInMonth = (date = new Date()) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
}

/**
 * Check if year is leap year
 */
const isLeapYear = (year) => {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0
}

/**
 * Get week number of year
 */
const getWeekNumber = (date = new Date()) => {
  const firstDay = new Date(date.getFullYear(), 0, 1)
  const pastDaysOfYear = (date - firstDay) / 86400000
  return Math.ceil((pastDaysOfYear + firstDay.getDay() + 1) / 7)
}

/**
 * Get day name
 */
const getDayName = (date = new Date(), locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, { weekday: 'long' })
}

/**
 * Get month name
 */
const getMonthName = (date = new Date(), locale = 'en-US') => {
  return new Date(date).toLocaleDateString(locale, { month: 'long' })
}

/**
 * Format as relative time (e.g., "2 hours ago", "in 3 days")
 */
const getRelativeTime = (date) => {
  const d = new Date(date)
  const now = new Date()
  const seconds = Math.floor((now - d) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`
  return d.toLocaleDateString()
}

/**
 * Get business days between two dates (excluding weekends)
 */
const getBusinessDaysBetween = (date1, date2) => {
  let count = 0
  const current = new Date(date1)
  const end = new Date(date2)

  while (current <= end) {
    const dayOfWeek = current.getDay()
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++
    current.setDate(current.getDate() + 1)
  }
  return count
}

/**
 * Schedule a callback at a specific time
 */
const scheduleAt = (targetTime, callback) => {
  const now = new Date()
  const target = new Date(targetTime)
  const delay = target - now

  if (delay < 0) {
    callback()
    return null
  }

  return setTimeout(callback, delay)
}

/**
 * Schedule a recurring callback
 */
const scheduleRecurring = (interval, callback, options = {}) => {
  const { startTime = Date.now(), stopTime = null, maxRuns = null } = options
  let runs = 0

  const scheduleNext = () => {
    if (stopTime && Date.now() >= stopTime) return
    if (maxRuns && runs >= maxRuns) return

    setTimeout(() => {
      callback()
      runs++
      scheduleNext()
    }, interval)
  }

  scheduleNext()
  return {
    stop: () => {
      stopTime = -1
    },
  }
}

/**
 * Get next occurrence of a time
 */
const getNextOccurrence = (hour, minute = 0) => {
  const next = new Date()
  next.setHours(hour, minute, 0, 0)

  if (next <= new Date()) {
    next.setDate(next.getDate() + 1)
  }

  return next
}

/**
 * Convert between timezones (basic implementation)
 */
const convertTimezone = (date, fromOffset, toOffset) => {
  const d = new Date(date)
  const msPerHour = 3600000
  const diff = (toOffset - fromOffset) * msPerHour
  return new Date(d.getTime() + diff)
}

export default {
  now,
  timestamp,
  addDays,
  addHours,
  addMinutes,
  daysBetween,
  hoursBetween,
  minutesBetween,
  isPast,
  isFuture,
  isToday,
  isTomorrow,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  isLeapYear,
  getWeekNumber,
  getDayName,
  getMonthName,
  getRelativeTime,
  getBusinessDaysBetween,
  scheduleAt,
  scheduleRecurring,
  getNextOccurrence,
  convertTimezone,
}

export {
  now,
  timestamp,
  addDays,
  addHours,
  addMinutes,
  daysBetween,
  hoursBetween,
  minutesBetween,
  isPast,
  isFuture,
  isToday,
  isTomorrow,
  startOfDay,
  endOfDay,
  startOfWeek,
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  isLeapYear,
  getWeekNumber,
  getDayName,
  getMonthName,
  getRelativeTime,
  getBusinessDaysBetween,
  scheduleAt,
  scheduleRecurring,
  getNextOccurrence,
  convertTimezone,
}
