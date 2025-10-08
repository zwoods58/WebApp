// Simple shared storage for consultations (in production, use a database)
let consultations = []

export function addConsultation(consultationData) {
  const consultation = {
    id: `CONS-${Date.now()}`,
    ...consultationData,
    createdAt: new Date().toISOString(),
    status: 'pending'
  }
  consultations.push(consultation)
  return consultation
}

export function getAllConsultations() {
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
  }
  return consultation
}

export function deleteConsultation(id) {
  const index = consultations.findIndex(c => c.id === id)
  if (index > -1) {
    return consultations.splice(index, 1)[0]
  }
  return null
}
