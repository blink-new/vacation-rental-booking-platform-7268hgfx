import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Users, Wifi, Car, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

const HomePage = () => {
  const [selectedProperty] = useState({
    id: 1,
    title: 'Großes modernes Ferienhaus nahe Rostock und Ostsee',
    location: 'Beselin, Dummerstorf',
    price: 200,
    guests: 8,
    bedrooms: 3,
    bathrooms: 2,
    image: '/house-exterior.jpg',
    features: [
      { icon: Users, text: 'Bis zu 8 Gäste' },
      { icon: MapPin, text: '21 km zum Strand' },
      { icon: Wifi, text: 'WLAN & Smart-TV' },
      { icon: Car, text: '3 Parkplätze' },
      { icon: Shield, text: 'Rauchmelder' }
    ],
    description: '140 qm Wohnfläche in ruhiger Dorflage mit großem Wohnbereich, voll ausgestatteter Küche und überdachter Terrasse mit Garten.',
    isNew: true
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-rose-600">FerienDirekt</h1>
            </div>
            <nav className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-rose-600 font-medium">
                Startseite
              </Link>
              <Link to="/admin" className="text-gray-700 hover:text-rose-600 font-medium">
                Admin
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-50 to-pink-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Direkt buchen. Ohne Gebühren.
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Entdecken Sie einzigartige Ferienunterkünfte in der Region Rostock und Ostsee. 
            Buchen Sie direkt beim Gastgeber und sparen Sie die hohen Plattformgebühren.
          </p>
          <div className="flex justify-center">
            <Button 
              size="lg" 
              className="bg-rose-600 hover:bg-rose-700 text-lg px-8 py-3"
              asChild
            >
              <Link to={`/property/${selectedProperty.id}`}>
                Jetzt entdecken
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Property */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Unsere Ferienunterkunft
            </h3>
            <p className="text-lg text-gray-600">
              Perfekt für Ihren Urlaub an der Ostsee
            </p>
          </div>

          <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={selectedProperty.image} 
                  alt={selectedProperty.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8">
                <div className="flex items-center gap-2 mb-4">
                  {selectedProperty.isNew && (
                    <span className="bg-rose-100 text-rose-800 px-2 py-1 rounded-full text-sm font-medium">
                      Neu
                    </span>
                  )}
                  <h4 className="text-2xl font-bold text-gray-900">
                    {selectedProperty.title}
                  </h4>
                </div>
                
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{selectedProperty.location}</span>
                </div>

                <p className="text-gray-600 mb-6">
                  {selectedProperty.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {selectedProperty.features.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <feature.icon className="w-5 h-5 text-rose-600 mr-2" />
                      <span className="text-sm text-gray-700">{feature.text}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-3xl font-bold text-gray-900">
                      €{selectedProperty.price}
                    </span>
                    <span className="text-gray-600 ml-2">pro Nacht</span>
                  </div>
                  <Button 
                    size="lg"
                    className="bg-rose-600 hover:bg-rose-700"
                    asChild
                  >
                    <Link to={`/property/${selectedProperty.id}`}>
                      Anfrage senden
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Warum FerienDirekt?
            </h3>
            <p className="text-lg text-gray-600">
              Direkt buchen hat viele Vorteile für Gäste und Gastgeber
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Keine Buchungsgebühren
                </h4>
                <p className="text-gray-600">
                  Sparen Sie bis zu 15% Plattformgebühren bei jeder Buchung
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Direkter Kontakt
                </h4>
                <p className="text-gray-600">
                  Sprechen Sie direkt mit dem Gastgeber für individuelle Wünsche
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-6 h-6 text-rose-600" />
                </div>
                <h4 className="text-xl font-bold text-gray-900 mb-2">
                  Sicher & Zuverlässig
                </h4>
                <p className="text-gray-600">
                  Alle Unterkünfte sind geprüft und verfügen über Sicherheitsausstattung
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h5 className="text-xl font-bold mb-4">FerienDirekt</h5>
              <p className="text-gray-400">
                Direkte Buchungen ohne Plattformgebühren für Ferienhäuser in der Region Rostock und Ostsee.
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Kontakt</h6>
              <p className="text-gray-400">
                Email: info@feriendirekt.de<br />
                Telefon: +49 381 123456
              </p>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Rechtliches</h6>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/impressum" className="hover:text-white transition-colors">Impressum</Link></li>
                <li><Link to="/privacy" className="hover:text-white transition-colors">Datenschutz</Link></li>
                <li><Link to="/terms" className="hover:text-white transition-colors">AGB</Link></li>
              </ul>
            </div>
            <div>
              <h6 className="font-semibold mb-4">Folgen Sie uns</h6>
              <p className="text-gray-400">
                Bleiben Sie auf dem Laufenden über neue Angebote und Unterkünfte.
              </p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 FerienDirekt. Alle Rechte vorbehalten.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage