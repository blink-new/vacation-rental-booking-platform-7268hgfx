import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

const PrivacyPage = () => {
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
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Datenschutzerklärung</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Datenschutz auf einen Blick</h2>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Allgemeine Hinweise</h3>
            <p className="text-gray-700 mb-4">
              Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen 
              Daten passiert, wenn Sie unsere Website besuchen. Personenbezogene Daten sind alle Daten, mit 
              denen Sie persönlich identifiziert werden können.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Datenerfassung auf unserer Website</h3>
            <p className="text-gray-700 mb-4">
              <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
              Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten 
              können Sie dem Impressum dieser Website entnehmen.
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Wie erfassen wir Ihre Daten?</strong><br />
              Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich 
              z.B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Allgemeine Hinweise und Pflichtinformationen</h2>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Datenschutz</h3>
            <p className="text-gray-700 mb-4">
              Die Betreiber dieser Seiten nehmen den Schutz Ihrer persönlichen Daten sehr ernst. Wir behandeln 
              Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften 
              sowie dieser Datenschutzerklärung.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Hinweis zur verantwortlichen Stelle</h3>
            <p className="text-gray-700 mb-4">
              Die verantwortliche Stelle für die Datenverarbeitung auf dieser Website ist:<br />
              <br />
              FerienDirekt<br />
              Musterstraße 123<br />
              12345 Rostock<br />
              Deutschland<br />
              <br />
              Telefon: +49 381 123456<br />
              E-Mail: info@feriendirekt.de
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Widerruf Ihrer Einwilligung zur Datenverarbeitung</h3>
            <p className="text-gray-700 mb-4">
              Viele Datenverarbeitungsvorgänge sind nur mit Ihrer ausdrücklichen Einwilligung möglich. Sie können 
              eine bereits erteilte Einwilligung jederzeit widerrufen. Dazu reicht eine formlose Mitteilung per 
              E-Mail an uns.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Ihre Rechte bezüglich Ihrer Daten</h3>
            <p className="text-gray-700 mb-4">
              Sie haben das Recht, jederzeit Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten 
              personenbezogenen Daten zu erhalten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder 
              Löschung dieser Daten zu verlangen.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Datenerfassung auf unserer Website</h2>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Cookies</h3>
            <p className="text-gray-700 mb-4">
              Die Internetseiten verwenden teilweise so genannte Cookies. Cookies richten auf Ihrem Rechner 
              keinen Schaden an und enthalten keine Viren. Cookies dienen dazu, unser Angebot nutzerfreundlicher, 
              effektiver und sicherer zu machen.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Kontaktformular</h3>
            <p className="text-gray-700 mb-4">
              Wenn Sie uns per Kontaktformular Anfragen zukommen lassen, werden Ihre Angaben aus dem Anfrageformular 
              inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage und für den Fall 
              von Anschlussfragen bei uns gespeichert.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Buchungsanfragen</h3>
            <p className="text-gray-700 mb-4">
              Wenn Sie eine Buchungsanfrage über unsere Website stellen, werden die von Ihnen angegebenen Daten 
              (Name, E-Mail-Adresse, Telefonnummer, Reisedaten) zur Bearbeitung Ihrer Anfrage verwendet. Diese 
              Daten werden nur für die Abwicklung der Buchung verwendet und nicht an Dritte weitergegeben.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Speicherdauer</h2>
            <p className="text-gray-700 mb-4">
              Ihre personenbezogenen Daten werden nur so lange gespeichert, wie es für die Erfüllung der 
              jeweiligen Zwecke erforderlich ist. Buchungsdaten werden für die Dauer der Buchung und anschließend 
              gemäß den gesetzlichen Aufbewahrungsfristen gespeichert.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Kontakt</h2>
            <p className="text-gray-700">
              Bei Fragen zur Erhebung, Verarbeitung oder Nutzung Ihrer personenbezogenen Daten, bei Auskünften, 
              Berichtigung, Sperrung oder Löschung von Daten wenden Sie sich bitte an:<br />
              <br />
              E-Mail: info@feriendirekt.de<br />
              Telefon: +49 381 123456
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage