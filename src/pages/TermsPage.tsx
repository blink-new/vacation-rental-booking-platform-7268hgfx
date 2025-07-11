import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const TermsPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Allgemeine Geschäftsbedingungen</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Geltungsbereich</h2>
            <p className="text-gray-700 mb-4">
              Diese Allgemeinen Geschäftsbedingungen gelten für alle Buchungen und Nutzungen der über die 
              Website www.feriendirekt.de angebotenen Ferienunterkünfte. Abweichende Bedingungen des Gastes 
              werden nicht anerkannt, es sei denn, wir haben ihnen ausdrücklich schriftlich zugestimmt.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Vertragspartner</h2>
            <p className="text-gray-700 mb-4">
              Der Vertrag über die Vermietung der Ferienunterkunft kommt zwischen dem Gast und dem jeweiligen 
              Vermieter zustande. FerienDirekt vermittelt lediglich den Kontakt zwischen Gast und Vermieter.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Buchungsvorgang</h2>
            <p className="text-gray-700 mb-4">
              <strong>3.1 Buchungsanfrage</strong><br />
              Durch das Ausfüllen und Absenden des Buchungsformulars stellen Sie eine unverbindliche 
              Buchungsanfrage. Diese Anfrage wird an den Vermieter weitergeleitet.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>3.2 Buchungsbestätigung</strong><br />
              Ein Mietvertrag kommt erst durch die Bestätigung des Vermieters zustande. Die Bestätigung 
              erfolgt per E-Mail.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Preise und Zahlungsbedingungen</h2>
            <p className="text-gray-700 mb-4">
              <strong>4.1 Preise</strong><br />
              Die auf der Website angegebenen Preise sind Endpreise in Euro und verstehen sich pro Nacht. 
              Zusätzliche Kosten (z.B. Kurtaxe, Endreinigung) werden gesondert ausgewiesen.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>4.2 Zahlung</strong><br />
              Die Zahlung erfolgt direkt an den Vermieter nach dessen Zahlungsbedingungen. Übliche 
              Zahlungsweisen sind Überweisung oder Barzahlung vor Ort.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Stornierungsbedingungen</h2>
            <p className="text-gray-700 mb-4">
              <strong>5.1 Stornierung durch den Gast</strong><br />
              Stornierungen sind schriftlich per E-Mail an den Vermieter zu richten. Die Stornierungsbedingungen 
              des jeweiligen Vermieters gelten.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>5.2 Stornierung durch den Vermieter</strong><br />
              Der Vermieter kann die Buchung nur aus wichtigem Grund stornieren. In diesem Fall werden bereits 
              geleistete Zahlungen vollständig erstattet.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">6. An- und Abreise</h2>
            <p className="text-gray-700 mb-4">
              <strong>6.1 Check-in</strong><br />
              Der Check-in ist ab 15:00 Uhr möglich, sofern nicht anders vereinbart. Die Schlüsselübergabe 
              erfolgt nach Absprache mit dem Vermieter.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>6.2 Check-out</strong><br />
              Der Check-out ist bis 11:00 Uhr, sofern nicht anders vereinbart. Die Unterkunft ist 
              besenrein zu übergeben.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">7. Nutzung der Unterkunft</h2>
            <p className="text-gray-700 mb-4">
              <strong>7.1 Hausordnung</strong><br />
              Der Gast verpflichtet sich, die Hausordnung des Vermieters zu beachten und die Unterkunft 
              pfleglich zu behandeln.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>7.2 Personenanzahl</strong><br />
              Die Unterkunft darf nur von der angemeldeten Personenanzahl genutzt werden. Übernachtungen 
              weiterer Personen bedürfen der vorherigen Zustimmung des Vermieters.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">8. Haftung</h2>
            <p className="text-gray-700 mb-4">
              <strong>8.1 Haftung des Vermieters</strong><br />
              Der Vermieter haftet für Schäden nur bei Vorsatz und grober Fahrlässigkeit. Die Haftung für 
              leichte Fahrlässigkeit ist ausgeschlossen.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>8.2 Haftung des Gastes</strong><br />
              Der Gast haftet für alle Schäden, die er oder seine Begleiter an der Unterkunft oder deren 
              Einrichtung verursachen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">9. Datenschutz</h2>
            <p className="text-gray-700 mb-4">
              Die Verarbeitung personenbezogener Daten erfolgt gemäß unserer Datenschutzerklärung. Die 
              für die Buchung notwendigen Daten werden an den Vermieter weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">10. Schlussbestimmungen</h2>
            <p className="text-gray-700 mb-4">
              <strong>10.1 Änderungen</strong><br />
              Änderungen dieser AGB bedürfen der Schriftform. Mündliche Nebenabreden bestehen nicht.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>10.2 Gerichtsstand</strong><br />
              Gerichtsstand ist Rostock. Es gilt deutsches Recht.
            </p>
          </div>

          <div>
            <p className="text-gray-700 text-sm mt-8">
              Stand: Januar 2025<br />
              FerienDirekt<br />
              Rostock, Deutschland
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage