import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  MapPin, Users, Bed, Bath, Wifi, Car, Shield, 
  Coffee, Home, ArrowLeft, Star, Share, AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { toast } from '@/hooks/use-toast'
import { bookingStorage, pricingStorage, formatDate, calculateNights, generateId, checkAvailability } from '@/utils/localStorage'
import { airbnbService } from '@/utils/airbnbService'
import ImageGallery from '@/components/ImageGallery'
import DatePicker from '@/components/DatePicker'

const PropertyPage = () => {
  const [checkIn, setCheckIn] = useState<Date>()
  const [checkOut, setCheckOut] = useState<Date>()
  const [guests, setGuests] = useState('2')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dynamicTotal, setDynamicTotal] = useState(0)
  const [priceLoading, setPriceLoading] = useState(false)
  const [availabilityStatus, setAvailabilityStatus] = useState<{
    available: boolean
    reason?: string
    source?: 'local' | 'airbnb'
  }>({ available: true })
  const [airbnbBookedDates, setAirbnbBookedDates] = useState<string[]>([])
  const [localBookedDates, setLocalBookedDates] = useState<string[]>([])
  const [bookingForm, setBookingForm] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const property = {
    id: 1,
    title: 'Großes modernes Ferienhaus nahe Rostock und Ostsee',
    location: 'Beselin, Dummerstorf',
    distance: '6 km bis Rostock, 21 km zum Strand von Warnemünde',
    price: 200,
    guests: 8,
    bedrooms: 3,
    bathrooms: 2,
    size: 140,
    images: [
      '/house-exterior.jpg',
      '/bedroom1.jpg',
      '/bedroom2.jpg',
      '/house-interior.jpg'
    ],
    features: [
      { icon: Users, text: 'Bis zu 8 Gäste' },
      { icon: Bed, text: '3 Schlafzimmer' },
      { icon: Bath, text: '1 Bad + Gäste-WC' },
      { icon: Home, text: '140 qm Wohnfläche' },
      { icon: Wifi, text: 'WLAN & Smart-TV' },
      { icon: Car, text: '3 Parkplätze' },
      { icon: Coffee, text: 'Voll ausgestattete Küche' },
      { icon: Shield, text: 'Rauchmelder & CO-Melder' }
    ],
    description: `Großes modernes Ferienhaus nahe Rostock und Ostsee mit 140 qm Wohnfläche in ruhiger Dorflage. Beselin ist ein Ortsteil von Dummerstorf, 6 km bis Rostock, 21 km zum Strand von Warnemünde. Das Haus verfügt über 3 Schlafzimmer, ein Bad und ein zusätzliches Gäste-WC.

Großer Wohnbereich, voll ausgestattete Küche. WLAN und Smart-TV vorhanden. Überdachte Terrasse mit Garten. Abschließbarer Fahrradschuppen und drei Parkplätze sind vorhanden.

Gut ausgebauter Fahrradweg und Bushaltestelle 400m entfernt.`,
    amenities: [
      'Überdachte Terrasse mit Garten',
      'Abschließbarer Fahrradschuppen',
      'Drei Parkplätze',
      'Fahrradweg in der Nähe',
      'Bushaltestelle 400m entfernt'
    ],
    houseRules: {
      checkIn: '15:00',
      checkOut: '11:00',
      maxGuests: 8,
      smokingAllowed: false,
      petsAllowed: false
    },
    safety: [
      'Kohlenmonoxidmelder',
      'Rauchmelder'
    ],
    cancellation: 'Wenn Sie 2 Tage vor Beginn der Einziehung stornieren, erhalten Sie eine anteilige Rückerstattung. Danach ist diese Buchung nicht mehr erstattungsfähig.'
  }

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0
    
    const nights = calculateNights(checkIn, checkOut)
    const guestCount = parseInt(guests)
    let basePrice = dynamicTotal > 0 ? dynamicTotal : (nights * property.price)
    
    // Add extra bed charges for guests 7 and 8
    if (guestCount > 6) {
      const extraGuests = guestCount - 6
      const extraBedCharge = extraGuests * 20 * nights
      basePrice += extraBedCharge
    }
    
    return basePrice
  }

  const totalPrice = checkIn && checkOut ? calculateTotalPrice() : 0

  const calculateDynamicPrice = async (startDate: Date, endDate: Date) => {
    const currentDate = new Date(startDate)
    let totalPrice = 0
    let isAvailable = true
    let unavailableSource = ''
    
    // 1. Überprüfe lokale Verfügbarkeit
    const localAvailability = checkAvailability(property.id.toString(), startDate, endDate)
    if (!localAvailability.available) {
      return { 
        totalPrice: 0, 
        isAvailable: false,
        reason: localAvailability.reason || 'Nicht verfügbar',
        source: 'local'
      }
    }
    
    // 2. Überprüfe Airbnb-Verfügbarkeit
    try {
      const airbnbData = await airbnbService.getComprehensiveAvailability(
        property.id.toString(),
        startDate,
        endDate
      )
      
      for (const dayData of airbnbData) {
        if (!dayData.available) {
          return {
            totalPrice: 0,
            isAvailable: false,
            reason: dayData.reason || 'Bereits über Airbnb gebucht',
            source: 'airbnb'
          }
        }
        totalPrice += dayData.price
      }
    } catch (error) {
      console.error('Airbnb availability check failed:', error)
      
      // Fallback: Lokale Preisberechnung
      while (currentDate < endDate) {
        const dateStr = formatDate(currentDate)
        const rule = pricingStorage.getByDate(property.id.toString(), dateStr)
        
        if (rule) {
          if (!rule.available) {
            isAvailable = false
            unavailableSource = 'local'
            break
          }
          totalPrice += rule.price
        } else {
          totalPrice += property.price
        }
        
        currentDate.setDate(currentDate.getDate() + 1)
      }
    }
    
    return { 
      totalPrice, 
      isAvailable,
      reason: isAvailable ? undefined : 'Nicht verfügbar',
      source: unavailableSource || 'local'
    }
  }

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!checkIn || !checkOut) {
      toast({ title: 'Fehler', description: 'Bitte wählen Sie Check-in und Check-out Daten', variant: 'destructive' })
      return
    }

    if (!availabilityStatus.available) {
      toast({ title: 'Fehler', description: 'Die gewählten Daten sind nicht verfügbar', variant: 'destructive' })
      return
    }

    setIsSubmitting(true)
    
    try {
      const bookingId = generateId('booking')
      
      bookingStorage.add({
        id: bookingId,
        property_id: property.id.toString(),
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        guests: parseInt(guests),
        name: bookingForm.name,
        email: bookingForm.email,
        phone: bookingForm.phone,
        message: bookingForm.message,
        total_price: totalPrice,
        status: 'pending',
        created_at: new Date().toISOString()
      })

      toast({ title: 'Erfolg', description: 'Buchungsanfrage erfolgreich gesendet!' })
      
      setBookingForm({ name: '', email: '', phone: '', message: '' })
      setCheckIn(undefined)
      setCheckOut(undefined)
      setGuests('2')
      setAvailabilityStatus({ available: true })
      
    } catch (error) {
      console.error('Booking error:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Senden der Buchungsanfrage', variant: 'destructive' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: property.title,
        text: `Schauen Sie sich dieses schöne Ferienhaus an: ${property.title}`,
        url: window.location.href
      })
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      toast({ title: 'Erfolg', description: 'Link in die Zwischenablage kopiert!' })
    }
  }

  const isDateDisabled = (date: Date) => {
    const dateStr = formatDate(date)
    return date < new Date() || 
           airbnbBookedDates.includes(dateStr) || 
           localBookedDates.includes(dateStr)
  }

  useEffect(() => {
    // Lade gebuchte Daten beim Mount
    const propertyId = property.id.toString()
    setLocalBookedDates(bookingStorage.getBookedDatesForProperty(propertyId))
    
    // Lade Airbnb-Daten für die nächsten 3 Monate
    const today = new Date()
    const futureDate = new Date(today)
    futureDate.setMonth(futureDate.getMonth() + 3)
    
    airbnbService.getComprehensiveAvailability(propertyId, today, futureDate)
      .then(data => {
        const bookedDates = data.filter(d => !d.available).map(d => d.date)
        setAirbnbBookedDates(bookedDates)
      })
      .catch(error => {
        console.error('Failed to load Airbnb availability:', error)
      })
  }, [])

  useEffect(() => {
    if (checkIn && checkOut) {
      setPriceLoading(true)
      setAvailabilityStatus({ available: true })
      
      calculateDynamicPrice(checkIn, checkOut)
        .then(result => {
          setDynamicTotal(result.totalPrice)
          setAvailabilityStatus({
            available: result.isAvailable,
            reason: result.reason,
            source: result.source
          })
          
          if (!result.isAvailable) {
            toast({ 
              title: 'Nicht verfügbar', 
              description: result.reason || 'Die gewählten Daten sind nicht verfügbar', 
              variant: 'destructive' 
            })
          }
        })
        .catch(error => {
          console.error('Price calculation failed:', error)
          toast({ title: 'Fehler', description: 'Fehler beim Laden der Preise', variant: 'destructive' })
        })
        .finally(() => {
          setPriceLoading(false)
        })
    }
  }, [checkIn, checkOut])

  return (
    <div className="min-h-screen bg-white">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </Link>
              <h1 className="text-2xl font-bold text-rose-600">FerienDirekt</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={handleShare}>
                <Share className="w-4 h-4 mr-2" />
                Teilen
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">Neu</Badge>
            <div className="flex items-center text-sm text-gray-600">
              <Star className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="font-medium">Neu</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{property.title}</h1>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-5 h-5 mr-2" />
            <span>{property.location} • {property.distance}</span>
          </div>
        </div>

        <ImageGallery images={property.images} title={property.title} />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Ausstattung</h3>
              <div className="grid grid-cols-2 gap-4">
                {property.features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <feature.icon className="w-5 h-5 text-rose-600 mr-3" />
                    <span className="text-gray-700">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Über diese Unterkunft</h3>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                {property.description}
              </p>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Weitere Ausstattung</h3>
              <ul className="space-y-2">
                {property.amenities.map((amenity, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-rose-600 rounded-full mr-3"></span>
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Hausregeln</h3>
              <div className="space-y-2 text-gray-700">
                <p>Check-in ab {property.houseRules.checkIn}</p>
                <p>Check-out vor {property.houseRules.checkOut}</p>
                <p>Höchstens {property.houseRules.maxGuests} Gäste</p>
                <p className="text-sm text-gray-600">Ab 7. Gast: 20€ Aufbettung pro Person/Nacht</p>
                <p>Rauchen nicht gestattet</p>
                <p>Haustiere nicht erlaubt</p>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Sicherheit und Unterkunft</h3>
              <div className="space-y-2">
                {property.safety.map((item, index) => (
                  <div key={index} className="flex items-center text-gray-700">
                    <Shield className="w-5 h-5 text-green-600 mr-3" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Stornierungsbedingungen</h3>
              <p className="text-gray-700">{property.cancellation}</p>
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-4 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div>
                    <span className="text-2xl font-bold">€{property.price}</span>
                    <span className="text-gray-600 text-base font-normal ml-2">pro Nacht</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="checkin" className="text-sm font-medium">Check-in</Label>
                      <DatePicker
                        placeholder="Datum wählen"
                        value={checkIn}
                        onChange={setCheckIn}
                        disabled={isDateDisabled}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="checkout" className="text-sm font-medium">Check-out</Label>
                      <DatePicker
                        placeholder="Datum wählen"
                        value={checkOut}
                        onChange={setCheckOut}
                        disabled={(date) => isDateDisabled(date) || (checkIn && date <= checkIn)}
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="guests" className="text-sm font-medium">Gäste</Label>
                    <Select value={guests} onValueChange={setGuests}>
                      <SelectTrigger>
                        <SelectValue placeholder="Gäste wählen" />
                      </SelectTrigger>
                      <SelectContent>
                        {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                          <SelectItem key={num} value={num.toString()}>
                            {num} {num === 1 ? 'Gast' : 'Gäste'}
                            {num > 6 && (
                              <span className="text-xs text-gray-500 ml-1">
                                (+{20 * (num - 6)}€/Nacht)
                              </span>
                            )}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {checkIn && checkOut && !availabilityStatus.available && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        <strong>Nicht verfügbar:</strong> {availabilityStatus.reason}
                        {availabilityStatus.source === 'airbnb' && (
                          <span className="block text-sm mt-1">
                            Diese Daten sind bereits über Airbnb gebucht.
                          </span>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold">Kontaktdaten</h4>
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input
                        id="name"
                        value={bookingForm.name}
                        onChange={(e) => setBookingForm({...bookingForm, name: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">E-Mail *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={bookingForm.email}
                        onChange={(e) => setBookingForm({...bookingForm, email: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={bookingForm.phone}
                        onChange={(e) => setBookingForm({...bookingForm, phone: e.target.value})}
                      />
                    </div>
                    <div>
                      <Label htmlFor="message">Nachricht</Label>
                      <Textarea
                        id="message"
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm({...bookingForm, message: e.target.value})}
                        placeholder="Besondere Wünsche oder Fragen..."
                        rows={3}
                      />
                    </div>
                  </div>

                  {checkIn && checkOut && availabilityStatus.available && (
                    <div className="space-y-2 pt-4 border-t">
                      <div className="flex justify-between text-sm">
                        <span>€{property.price} x {calculateNights(checkIn, checkOut) || 0} Nächte</span>
                        <span>€{dynamicTotal > 0 ? dynamicTotal : calculateNights(checkIn, checkOut) * property.price || 0}</span>
                      </div>
                      {parseInt(guests) > 6 && (
                        <div className="flex justify-between text-sm">
                          <span>Aufbettung ({parseInt(guests) - 6} Gäste x {calculateNights(checkIn, checkOut) || 0} Nächte)</span>
                          <span>€{(parseInt(guests) - 6) * 20 * (calculateNights(checkIn, checkOut) || 0)}</span>
                        </div>
                      )}
                      <div className="flex justify-between font-semibold text-lg">
                        <span>Gesamt</span>
                        <span>€{totalPrice}</span>
                      </div>
                      <p className="text-xs text-gray-500">
                        Keine Buchungsgebühren • Direkter Kontakt zum Gastgeber
                      </p>
                    </div>
                  )}

                  <Button 
                    type="submit" 
                    className="w-full bg-rose-600 hover:bg-rose-700"
                    disabled={isSubmitting || priceLoading || !availabilityStatus.available}
                  >
                    {isSubmitting ? 'Wird gesendet...' : 
                     priceLoading ? 'Preise werden geladen...' : 
                     !availabilityStatus.available ? 'Nicht verfügbar' :
                     'Buchungsanfrage senden'}
                  </Button>
                  
                  <p className="text-center text-sm text-gray-500">
                    Sie zahlen noch nichts
                  </p>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PropertyPage