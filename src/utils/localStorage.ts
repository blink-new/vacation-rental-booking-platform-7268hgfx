// Local storage utilities for managing data without external APIs

export interface BookingRequest {
  id: string
  property_id: string
  check_in: string
  check_out: string
  guests: number
  name: string
  email: string
  phone: string
  message: string
  total_price: number
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface PricingRule {
  id: string
  property_id: string
  date: string
  price: number
  available: boolean
  minimum_stay: number
  created_at: string
}

// Booking Requests Management
export const bookingStorage = {
  getAll: (): BookingRequest[] => {
    const data = localStorage.getItem('bookingRequests')
    return data ? JSON.parse(data) : []
  },

  add: (booking: BookingRequest): void => {
    const bookings = bookingStorage.getAll()
    bookings.push(booking)
    localStorage.setItem('bookingRequests', JSON.stringify(bookings))
  },

  update: (id: string, updates: Partial<BookingRequest>): void => {
    const bookings = bookingStorage.getAll()
    const index = bookings.findIndex(b => b.id === id)
    if (index !== -1) {
      bookings[index] = { ...bookings[index], ...updates }
      localStorage.setItem('bookingRequests', JSON.stringify(bookings))
    }
  },

  delete: (id: string): void => {
    const bookings = bookingStorage.getAll()
    const filtered = bookings.filter(b => b.id !== id)
    localStorage.setItem('bookingRequests', JSON.stringify(filtered))
  }
}

// Pricing Rules Management
export const pricingStorage = {
  getAll: (): PricingRule[] => {
    const data = localStorage.getItem('pricingRules')
    return data ? JSON.parse(data) : []
  },

  getByProperty: (propertyId: string): PricingRule[] => {
    return pricingStorage.getAll().filter(rule => rule.property_id === propertyId)
  },

  getByDate: (propertyId: string, date: string): PricingRule | undefined => {
    return pricingStorage.getAll().find(rule => 
      rule.property_id === propertyId && rule.date === date
    )
  },

  add: (rule: PricingRule): void => {
    const rules = pricingStorage.getAll()
    rules.push(rule)
    localStorage.setItem('pricingRules', JSON.stringify(rules))
  },

  update: (id: string, updates: Partial<PricingRule>): void => {
    const rules = pricingStorage.getAll()
    const index = rules.findIndex(r => r.id === id)
    if (index !== -1) {
      rules[index] = { ...rules[index], ...updates }
      localStorage.setItem('pricingRules', JSON.stringify(rules))
    }
  },

  delete: (id: string): void => {
    const rules = pricingStorage.getAll()
    const filtered = rules.filter(r => r.id !== id)
    localStorage.setItem('pricingRules', JSON.stringify(filtered))
  }
}

// Utility functions
export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const calculateNights = (checkIn: Date, checkOut: Date): number => {
  if (!checkIn || !checkOut) return 0
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export const generateId = (prefix: string = 'id'): string => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}