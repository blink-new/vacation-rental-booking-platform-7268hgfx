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
  },

  // Überprüft ob ein Datumsbereich bereits gebucht ist
  isDateRangeBooked: (propertyId: string, checkIn: Date, checkOut: Date): boolean => {
    const bookings = bookingStorage.getAll()
    const approvedBookings = bookings.filter(b => 
      b.property_id === propertyId && b.status === 'approved'
    )
    
    for (const booking of approvedBookings) {
      const bookingCheckIn = new Date(booking.check_in)
      const bookingCheckOut = new Date(booking.check_out)
      
      // Überprüfe auf Überschneidungen
      if (checkIn < bookingCheckOut && checkOut > bookingCheckIn) {
        return true
      }
    }
    
    return false
  },

  // Gibt alle gebuchten Daten für eine Eigenschaft zurück
  getBookedDatesForProperty: (propertyId: string): string[] => {
    const bookings = bookingStorage.getAll()
    const approvedBookings = bookings.filter(b => 
      b.property_id === propertyId && b.status === 'approved'
    )
    
    const bookedDates: string[] = []
    
    for (const booking of approvedBookings) {
      const checkIn = new Date(booking.check_in)
      const checkOut = new Date(booking.check_out)
      const currentDate = new Date(checkIn)
      
      while (currentDate < checkOut) {
        bookedDates.push(currentDate.toISOString().split('T')[0])
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
    
    return bookedDates
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

// Überprüft die Verfügbarkeit für einen Datumsbereich
export const checkAvailability = (propertyId: string, checkIn: Date, checkOut: Date): {
  available: boolean
  reason?: string
  conflictingDates?: string[]
} => {
  // Überprüfe lokale Buchungen
  if (bookingStorage.isDateRangeBooked(propertyId, checkIn, checkOut)) {
    return {
      available: false,
      reason: 'Bereits über diese Plattform gebucht',
      conflictingDates: bookingStorage.getBookedDatesForProperty(propertyId)
    }
  }

  // Überprüfe Preisregeln für Verfügbarkeit
  const currentDate = new Date(checkIn)
  const unavailableDates: string[] = []
  
  while (currentDate < checkOut) {
    const dateStr = formatDate(currentDate)
    const rule = pricingStorage.getByDate(propertyId, dateStr)
    
    if (rule && !rule.available) {
      unavailableDates.push(dateStr)
    }
    
    currentDate.setDate(currentDate.getDate() + 1)
  }
  
  if (unavailableDates.length > 0) {
    return {
      available: false,
      reason: 'Manuell als nicht verfügbar markiert',
      conflictingDates: unavailableDates
    }
  }
  
  return { available: true }
}