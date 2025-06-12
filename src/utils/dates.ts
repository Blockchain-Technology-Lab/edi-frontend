// src/utils/dates.ts
import moment from "moment"

// Utility function to parse different date formats into a Date object
export function parseDateString(dateString: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    // Format: YYYY-MM-DD
    return new Date(dateString)
  } else if (/^[A-Za-z]{3}-\d{4}$/.test(dateString)) {
    // Format: MMM-YYYY
    const [monthName, year] = dateString.split("-")
    // Convert month name to a number (e.g., 'Jan' to 0, 'Feb' to 1, etc.)
    const monthNumber = parseInt(moment().month(monthName).format("M"), 10) - 1
    return new Date(Number(year), monthNumber) // Create Date object with year and month
  }
  throw new Error(`Unsupported date format: ${dateString}`)
}
