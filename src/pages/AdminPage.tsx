import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowLeft, Calendar, Users, 
  Check, X, Eye, 
  Euro, Clock 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { toast } from '@/hooks/use-toast'
import { bookingStorage, type BookingRequest } from '@/utils/localStorage'
import CalendarPricing from '@/components/CalendarPricing'

const AdminPage = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<BookingRequest | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    try {
      const requests = bookingStorage.getAll()
      // Sort by created_at descending
      const sortedRequests = requests.sort((a, b) => 
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      setBookingRequests(sortedRequests)
    } catch (error) {
      console.error('Error loading data:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Laden der Daten', variant: 'destructive' })
    } finally {
      setLoading(false)
    }
  }

  const handleBookingResponse = (bookingId: string, status: 'approved' | 'rejected') => {
    try {
      bookingStorage.update(bookingId, { status })
      
      setBookingRequests(prev => 
        prev.map(booking => 
          booking.id === bookingId ? { ...booking, status } : booking
        )
      )
      
      toast({ title: 'Erfolg', description: status === 'approved' ? 'Buchung bestätigt' : 'Buchung abgelehnt' })
    } catch (error) {
      console.error('Error updating booking:', error)
      toast({ title: 'Fehler', description: 'Fehler beim Aktualisieren der Buchung', variant: 'destructive' })
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">Ausstehend</Badge>
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Bestätigt</Badge>
      case 'rejected':
        return <Badge variant="destructive">Abgelehnt</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const calculateNights = (checkIn: string, checkOut: string) => {
    const diffTime = Math.abs(new Date(checkOut).getTime() - new Date(checkIn).getTime())
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center text-gray-600 hover:text-gray-900 mr-4">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Zurück
              </Link>
              <h1 className="text-2xl font-bold text-rose-600">Admin Panel</h1>
            </div>
            <div className="text-sm text-gray-600">
              FerienDirekt Verwaltung
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Calendar className="w-8 h-8 text-rose-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Buchungsanfragen</p>
                  <p className="text-2xl font-bold text-gray-900">{bookingRequests.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Clock className="w-8 h-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ausstehend</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingRequests.filter(b => b.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Check className="w-8 h-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Bestätigt</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookingRequests.filter(b => b.status === 'approved').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <Euro className="w-8 h-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Umsatz</p>
                  <p className="text-2xl font-bold text-gray-900">
                    €{bookingRequests.filter(b => b.status === 'approved').reduce((sum, b) => sum + b.total_price, 0)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="bookings">Buchungsanfragen</TabsTrigger>
            <TabsTrigger value="calendar">Kalender & Preise</TabsTrigger>
          </TabsList>
          
          <TabsContent value="bookings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Buchungsanfragen
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Gast</TableHead>
                        <TableHead>Zeitraum</TableHead>
                        <TableHead>Gäste</TableHead>
                        <TableHead>Preis</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Aktionen</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingRequests.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{booking.name}</div>
                              <div className="text-sm text-gray-600">{booking.email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div>{formatDate(booking.check_in)} - {formatDate(booking.check_out)}</div>
                              <div className="text-gray-600">{calculateNights(booking.check_in, booking.check_out)} Nächte</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-1" />
                              {booking.guests}
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">
                            €{booking.total_price}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(booking.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => setSelectedBooking(booking)}
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-2xl">
                                  <DialogHeader>
                                    <DialogTitle>Buchungsdetails</DialogTitle>
                                  </DialogHeader>
                                  {selectedBooking && (
                                    <div className="space-y-4">
                                      <div className="grid grid-cols-2 gap-4">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Name</Label>
                                          <p className="text-sm">{selectedBooking.name}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">E-Mail</Label>
                                          <p className="text-sm">{selectedBooking.email}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Telefon</Label>
                                          <p className="text-sm">{selectedBooking.phone || 'Nicht angegeben'}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Gäste</Label>
                                          <p className="text-sm">{selectedBooking.guests}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Check-in</Label>
                                          <p className="text-sm">{formatDate(selectedBooking.check_in)}</p>
                                        </div>
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Check-out</Label>
                                          <p className="text-sm">{formatDate(selectedBooking.check_out)}</p>
                                        </div>
                                      </div>
                                      {selectedBooking.message && (
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Nachricht</Label>
                                          <p className="text-sm mt-1 p-3 bg-gray-50 rounded">{selectedBooking.message}</p>
                                        </div>
                                      )}
                                      <div className="flex justify-between items-center pt-4 border-t">
                                        <div>
                                          <Label className="text-sm font-medium text-gray-600">Gesamtpreis</Label>
                                          <p className="text-lg font-bold">€{selectedBooking.total_price}</p>
                                        </div>
                                        <div className="flex gap-2">
                                          {selectedBooking.status === 'pending' && (
                                            <>
                                              <Button 
                                                onClick={() => handleBookingResponse(selectedBooking.id, 'approved')}
                                                className="bg-green-600 hover:bg-green-700"
                                              >
                                                <Check className="w-4 h-4 mr-2" />
                                                Bestätigen
                                              </Button>
                                              <Button 
                                                onClick={() => handleBookingResponse(selectedBooking.id, 'rejected')}
                                                variant="destructive"
                                              >
                                                <X className="w-4 h-4 mr-2" />
                                                Ablehnen
                                              </Button>
                                            </>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  )}
                                </DialogContent>
                              </Dialog>
                              {booking.status === 'pending' && (
                                <>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleBookingResponse(booking.id, 'approved')}
                                    className="text-green-600 hover:text-green-700"
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => handleBookingResponse(booking.id, 'rejected')}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {bookingRequests.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">Noch keine Buchungsanfragen</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2" />
                    Kalender & Preise
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CalendarPricing 
                  propertyId="property-1" 
                  basePrice={200}
                  onPriceUpdate={loadData}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminPage