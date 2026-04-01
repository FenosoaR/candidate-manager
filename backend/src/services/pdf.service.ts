import PDFDocument from 'pdfkit'
import { ICandidate } from '../models/Candidate'

export const generateCandidatePDF = (candidate: ICandidate): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument()
    const chunks: Buffer[] = []

    doc.on('data', chunk => chunks.push(chunk))
    doc.on('end', () => resolve(Buffer.concat(chunks)))
    doc.on('error', reject)

    doc.fontSize(24).text('Fiche Candidat', { align: 'center' })
    doc.moveDown()
    doc.fontSize(14).text(`Nom : ${candidate.firstName} ${candidate.lastName}`)
    doc.text(`Email : ${candidate.email}`)
    doc.text(`Poste : ${candidate.position}`)
    if (candidate.phone) doc.text(`Téléphone : ${candidate.phone}`)
    doc.text(`Statut : ${candidate.status}`)
    doc.text(`Date : ${new Date(candidate.createdAt).toLocaleDateString('fr-FR')}`)
    doc.end()
  })
}