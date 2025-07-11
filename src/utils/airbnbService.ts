// Airbnb API integration service
// Note: This is a mock implementation as Airbnb doesn't provide a public API
// In a real implementation, you would need to use web scraping or partner integrations

export interface AirbnbAvailability {
  date: string
  available: boolean
  price?: number
  source: 'airbnb' | 'local'
}

export interface AirbnbListingData {
  id: string
  title: string
  availability: AirbnbAvailability[]
  basePrice: number
  currency: 'EUR'
  lastUpdated: string
}

// Mock Airbnb data - in production, this would come from web scraping or API
const mockAirbnbData: AirbnbListingData = {
  id: 'airbnb-mock-listing-1',
  title: 'Großes modernes Ferienhaus nahe Rostock',
  basePrice: 200,
  currency: 'EUR',
  lastUpdated: new Date().toISOString(),
  availability: [
    // Beispiel: Einige Daten als "bereits bei Airbnb gebucht" markieren
    { date: '2024-12-25', available: false, source: 'airbnb' },
    { date: '2024-12-26', available: false, source: 'airbnb' },
    { date: '2024-12-27', available: false, source: 'airbnb' },
    { date: '2024-12-31', available: false, source: 'airbnb' },
    { date: '2025-01-01', available: false, source: 'airbnb' },
    { date: '2025-01-02', available: false, source: 'airbnb' },
    { date: '2025-01-03', available: false, source: 'airbnb' },
    { date: '2025-01-04', available: false, source: 'airbnb' },
    { date: '2025-01-05', available: false, source: 'airbnb' },
    { date: '2025-02-14', available: false, source: 'airbnb' },
    { date: '2025-02-15', available: false, source: 'airbnb' },
    { date: '2025-02-16', available: false, source: 'airbnb' },
  ]
}

export const airbnbService = {
  // Simuliert eine Abfrage der Airbnb-Verfügbarkeit
  async checkAvailability(propertyId: string, dates: string[]): Promise<AirbnbAvailability[]> {
    // Simuliere API-Aufruf Verzögerung
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return dates.map(date => {
      const airbnbData = mockAirbnbData.availability.find(a => a.date === date)
      return airbnbData || { date, available: true, source: 'airbnb' as const }
    })
  },

  // Simuliert eine Abfrage der Airbnb-Preise
  async getPricing(propertyId: string, dates: string[]): Promise<{ date: string; price: number }[]> {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return dates.map(date => {
      // Simuliere variable Preise basierend auf Saison/Datum
      const basePrice = mockAirbnbData.basePrice
      const dateObj = new Date(date)
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6
      const isHoliday = this.isHoliday(date)
      
      let price = basePrice
      if (isWeekend) price += 30
      if (isHoliday) price += 50
      
      return { date, price }
    })
  },

  // Überprüft ob ein Datum ein Feiertag ist
  isHoliday(date: string): boolean {
    const holidays = [
      '2024-12-24', '2024-12-25', '2024-12-26', '2024-12-31',
      '2025-01-01', '2025-01-06', '2025-04-18', '2025-04-21',
      '2025-05-01', '2025-05-29', '2025-06-09', '2025-10-03',
      '2025-12-24', '2025-12-25', '2025-12-26', '2025-12-31'
    ]
    return holidays.includes(date)
  },

  // Kombiniert lokale und Airbnb-Daten
  async getComprehensiveAvailability(propertyId: string, startDate: Date, endDate: Date): Promise<{
    date: string
    available: boolean
    price: number
    source: 'local' | 'airbnb'
    reason?: string
  }[]> {
    const dates = []
    const currentDate = new Date(startDate)
    
    while (currentDate <= endDate) {
      dates.push(currentDate.toISOString().split('T')[0])
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    // Parallel Abfrage von Airbnb-Verfügbarkeit und -Preisen
    const [availability, pricing] = await Promise.all([
      this.checkAvailability(propertyId, dates),
      this.getPricing(propertyId, dates)
    ])
    
    return dates.map(date => {
      const airbnbAvailability = availability.find(a => a.date === date)
      const airbnbPrice = pricing.find(p => p.date === date)
      
      if (!airbnbAvailability?.available) {
        return {
          date,
          available: false,
          price: airbnbPrice?.price || mockAirbnbData.basePrice,
          source: 'airbnb' as const,
          reason: 'Bereits über Airbnb gebucht'
        }
      }
      
      return {
        date,
        available: true,
        price: airbnbPrice?.price || mockAirbnbData.basePrice,
        source: 'airbnb' as const
      }
    })
  }
}