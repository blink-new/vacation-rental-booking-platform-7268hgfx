import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const ImpressumPage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Impressum</h1>
        
        <div className="prose prose-lg max-w-none">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Angaben gemäß § 5 TMG</h2>
          
          <div className="space-y-6">
            <div>
              <p className="font-medium text-gray-900">FerienDirekt</p>
              <p className="text-gray-700">
                Musterstraße 123<br />
                12345 Rostock<br />
                Deutschland
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Kontakt</h3>
              <p className="text-gray-700">
                Telefon: +49 381 123456<br />
                E-Mail: info@feriendirekt.de
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Umsatzsteuer-ID</h3>
              <p className="text-gray-700">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
                DE123456789
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">EU-Streitschlichtung</h3>
              <p className="text-gray-700">
                Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit: 
                <a href="https://ec.europa.eu/consumers/odr/" className="text-rose-600 hover:text-rose-700 ml-1">
                  https://ec.europa.eu/consumers/odr/
                </a>
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Verbraucherstreitbeilegung/Universalschlichtungsstelle</h3>
              <p className="text-gray-700">
                Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer 
                Verbraucherschlichtungsstelle teilzunehmen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Haftung für Inhalte</h3>
              <p className="text-gray-700">
                Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten 
                nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als 
                Diensteanbieter jedoch nicht unter der Verpflichtung, übermittelte oder gespeicherte 
                fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine 
                rechtswidrige Tätigkeit hinweisen.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Haftung für Links</h3>
              <p className="text-gray-700">
                Unser Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte wir keinen 
                Einfluss haben. Deshalb können wir für diese fremden Inhalte auch keine Gewähr übernehmen. 
                Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der 
                Seiten verantwortlich.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Urheberrecht</h3>
              <p className="text-gray-700">
                Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen 
                dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art 
                der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen 
                Zustimmung des jeweiligen Autors bzw. Erstellers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImpressumPage