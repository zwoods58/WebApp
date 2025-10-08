// Shared consultation storage for both submission and retrieval endpoints
// In production, this would be replaced with a database

let consultations = []

export function addConsultation(consultationData) {
  const consultation = {
    id: `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...consultationData,
    status: 'pending',
    createdAt: new Date().toISOString()
  }
  consultations.push(consultation)
  return consultation
}

export function getConsultations() {
  return consultations.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

export function getConsultationById(id) {
  return consultations.find(c => c.id === id)
}

export function updateConsultationStatus(id, status) {
  const consultation = consultations.find(c => c.id === id)
  if (consultation) {
    consultation.status = status
    consultation.updatedAt = new Date().toISOString()
    return consultation
  }
  return null
}
