import * as XLSX from 'xlsx'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const data = [
  ['Thema', 'CDU/CSU', 'SPD', 'Grüne', 'FDP'],
  [
    'Klimaschutz',
    'Wir setzen auf technologischen Fortschritt und marktwirtschaftliche Lösungen, um Klimaziele zu erreichen – ohne Verbote und Bevormundung.',
    'Klimaschutz und soziale Gerechtigkeit gehören zusammen. Wir investieren in erneuerbare Energien und schützen dabei die kleinen Einkommen.',
    'Die Klimakrise ist die größte Bedrohung unserer Zeit. Wir brauchen sofortige, konsequente Maßnahmen – auch wenn das unbequem ist.',
    'Klimaschutz ja, aber durch Innovation und Wettbewerb, nicht durch staatliche Verbote. Der CO₂-Preis ist das effektivste Instrument.',
  ],
  [
    'Bildung',
    'Bildung ist Ländersache – das hat sich bewährt. Wir wollen mehr Qualität statt zentraler Bürokratie.',
    'Gleiche Bildungschancen für alle Kinder, unabhängig vom Geldbeutel der Eltern. Wir investieren massiv in Schulen und Lehrkräfte.',
    'Kostenfreie Bildung von der Kita bis zur Uni – Bildung darf keine Frage des Geldes sein.',
    'Bildung braucht Wettbewerb und Vielfalt. Wir wollen mehr Freiheit für Schulen und Eltern bei der Schulwahl.',
  ],
  [
    'Wohnen',
    'Wohneigentum für die Mitte der Gesellschaft – wir senken die Grunderwerbsteuer und entbürokratisieren den Wohnungsbau.',
    'Wir bauen mehr bezahlbare Wohnungen und stärken den Mieterschutz. Niemand soll aus seiner Nachbarschaft verdrängt werden.',
    'Spekulation mit Wohnraum beenden. Wir brauchen mehr Gemeinschaftseigentum und einen starken sozialen Wohnungsbau.',
    'Mehr bauen statt mehr regulieren. Bürokratieabbau ist das beste Mittel gegen steigende Mieten.',
  ],
  [
    'Migration',
    'Wir wollen geordnete Zuwanderung: klare Regeln, konsequente Abschiebung bei Regelverstößen und Schutz der Außengrenzen.',
    'Humanität und Ordnung müssen kein Widerspruch sein. Wir wollen sichere Fluchtwege und gleichzeitig faire Verfahren.',
    'Flucht ist kein Verbrechen. Wir setzen uns für legale Einwanderungswege und ein solidarisches Europa ein.',
    'Deutschland braucht qualifizierte Fachkräfte aus aller Welt – mit einem modernen Einwanderungsgesetz, das Wirtschaft und Humanität verbindet.',
  ],
  [
    'Rente',
    'Die gesetzliche Rente bleibt die Grundlage. Wir wollen sie durch Kapitaldeckung langfristig sichern.',
    'Wer ein Leben lang gearbeitet hat, muss im Alter sicher leben können. Wir stärken die gesetzliche Rente und führen die Grundrente aus.',
    'Rente muss armutsfest sein. Wir wollen eine solidarische Bürgerrente, in die alle einzahlen – auch Beamte und Selbstständige.',
    'Mehr Eigenverantwortung in der Altersvorsorge. Wir wollen eine starke kapitalgedeckte Säule und Wahlfreiheit für die Bürger.',
  ],
  [
    'Wirtschaft',
    'Leistung muss sich lohnen. Wir senken Unternehmenssteuern, bauen Bürokratie ab und stärken den Mittelstand.',
    'Eine starke Wirtschaft braucht starke Arbeitnehmerrechte. Gute Löhne und Mitbestimmung sichern unseren Wohlstand.',
    'Wir brauchen eine sozial-ökologische Transformation. Die Wirtschaft der Zukunft ist klimaneutral, digital und fair.',
    'Weniger Staat, mehr Markt. Wir wollen Steuern senken, Subventionen abbauen und Unternehmertum fördern.',
  ],
  [
    'Digitalisierung',
    'Deutschland soll digitale Vorreiter-Nation werden. Wir investieren in Glasfaser, 5G und digitale Verwaltung.',
    'Digitalisierung muss allen nutzen – auch älteren Menschen und ländlichen Regionen. Niemand darf abgehängt werden.',
    'Digitale Infrastruktur ist öffentliche Aufgabe. Wir wollen einen offenen, diskriminierungsfreien Zugang für alle.',
    'Deutschland braucht einen digitalen Aufbruch. Wir wollen weniger Regulierung für Start-ups und schnellere Genehmigungen.',
  ],
  [
    'Gesundheit',
    'Ein starkes Gesundheitssystem braucht leistungsfähige Krankenhäuser und niedergelassene Ärzte in der Fläche.',
    'Wir wollen eine Bürgerversicherung: Alle zahlen ein, alle sind gut versorgt – egal ob arm oder reich.',
    'Prävention vor Behandlung. Wir investieren in Gesundheitsförderung und wollen die Zweiklassenmedizin überwinden.',
    'Mehr Wettbewerb im Gesundheitswesen führt zu besserer Versorgung. Wir stärken die Wahlfreiheit der Patienten.',
  ],
  [
    'Sicherheit',
    'Innere Sicherheit ist Staatspflicht. Wir stärken Polizei und Justiz und dulden keine rechtsfreien Räume.',
    'Sicherheit braucht Vertrauen. Gute Polizeiarbeit und soziale Prävention gehören zusammen.',
    'Sicherheit entsteht durch soziale Gerechtigkeit. Wir wollen mehr in Präventionsprogramme und soziale Arbeit investieren.',
    'Bürgerrechte und Sicherheit sind kein Gegensatz. Wir lehnen anlasslose Massenüberwachung ab.',
  ],
]

const ws = XLSX.utils.aoa_to_sheet(data)

// Spaltenbreiten setzen
ws['!cols'] = [
  { wch: 18 },
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
  { wch: 50 },
]

const wb = XLSX.utils.book_new()
XLSX.utils.book_append_sheet(wb, ws, 'Sichtwechsel')

const outPath = join(__dirname, '..', 'public', 'beispiel-tabelle.xlsx')
XLSX.writeFile(wb, outPath)

console.log('✓ Erstellt:', outPath)
