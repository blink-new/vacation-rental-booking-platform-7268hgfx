// Test data for demonstrating the booking and availability system
import { bookingStorage, pricingStorage, generateId } from './localStorage'

export const initializeTestData = () => {
  // Check if test data already exists
  const existingBookings = bookingStorage.getAll()
  const existingPricing = pricingStorage.getAll()
  
  if (existingBookings.length > 0 || existingPricing.length > 0) {
    return // Data already exists, don't reinitialize
  }

  // Add some test bookings to demonstrate the system
  const testBookings = [
    {
      id: generateId('booking'),
      property_id: '1',
      check_in: '2024-12-28T00:00:00.000Z',
      check_out: '2024-12-30T00:00:00.000Z',
      guests: 4,
      name: 'Maria Schmidt',
      email: 'maria.schmidt@example.com',
      phone: '+49 171 1234567',
      message: 'Freuen uns auf ein schönes Wochenende!',
      total_price: 460,
      status: 'approved' as const,
      created_at: new Date(Date.now() - 86400000).toISOString() // 1 day ago
    },
    {
      id: generateId('booking'),
      property_id: '1',
      check_in: '2025-01-10T00:00:00.000Z',
      check_out: '2025-01-12T00:00:00.000Z',
      guests: 6,
      name: 'Thomas Müller',
      email: 'thomas.mueller@example.com',
      phone: '+49 170 9876543',
      message: 'Kurzer Familienurlaub mit Kindern',
      total_price: 440,
      status: 'approved' as const,
      created_at: new Date(Date.now() - 3600000).toISOString() // 1 hour ago
    }
  ]

  // Add some pricing rules for special dates
  const testPricing = [
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2024-12-24',
      price: 300,
      available: true,
      minimum_stay: 2,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2024-12-25',
      price: 300,
      available: true,
      minimum_stay: 2,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2024-12-26',
      price: 300,
      available: true,
      minimum_stay: 2,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2024-12-30',
      price: 350,
      available: true,
      minimum_stay: 2,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2024-12-31',
      price: 350,
      available: true,
      minimum_stay: 2,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2025-01-08',
      price: 120,
      available: false, // Manually blocked
      minimum_stay: 1,
      created_at: new Date().toISOString()
    },
    {
      id: generateId('pricing'),
      property_id: '1',
      date: '2025-01-09',
      price: 120,
      available: false, // Manually blocked
      minimum_stay: 1,
      created_at: new Date().toISOString()
    }
  ]

  // Add test data to localStorage
  testBookings.forEach(booking => bookingStorage.add(booking))
  testPricing.forEach(pricing => pricingStorage.add(pricing))

  console.log('Test data initialized:', {
    bookings: testBookings.length,
    pricing: testPricing.length
  })
}

export const clearTestData = () => {
  localStorage.removeItem('bookingRequests')
  localStorage.removeItem('pricingRules')
  console.log('Test data cleared')
}