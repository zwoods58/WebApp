// Persistent file-based storage for consultations
const fs = require('fs')
const path = require('path')

const DATA_FILE = path.join(process.cwd(), 'data', 'consultations.json')

// Ensure data directory exists
const dataDir = path.dirname(DATA_FILE)
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true })
}

// Load consultations from file
function loadConsultations() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8')
      return JSON.parse(data)
    }
  } catch (error) {
    console.error('Error loading consultations:', error)
  }
  return []
}

// Save consultations to file
function saveConsultations(consultations) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(consultations, null, 2))
  } catch (error) {
    console.error('Error saving consultations:', error)
  }
}

function addConsultation(consultationData) {
  const consultations = loadConsultations()
  const consultation = {
    id: `CONS-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    ...consultationData,
    status: 'pending',
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  }
  consultations.push(consultation)
  saveConsultations(consultations)
  return consultation
}

function getConsultations() {
  return loadConsultations().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
}

function getConsultationById(id) {
  const consultations = loadConsultations()
  return consultations.find(c => c.id === id)
}

function updateConsultation(id, updates) {
  const consultations = loadConsultations()
  const index = consultations.findIndex(c => c.id === id)
  if (index !== -1) {
    consultations[index] = { ...consultations[index], ...updates, updatedAt: new Date().toISOString() }
    saveConsultations(consultations)
    return consultations[index]
  }
  return null
}

function deleteConsultation(id) {
  const consultations = loadConsultations()
  const initialLength = consultations.length
  const filtered = consultations.filter(c => c.id !== id)
  if (filtered.length < initialLength) {
    saveConsultations(filtered)
    return true
  }
  return false
}

function acceptConsultation(id, additionalUpdates = {}) {
  return updateConsultation(id, { status: 'accepted', ...additionalUpdates })
}

function rejectConsultation(id) {
  return updateConsultation(id, { status: 'rejected' })
}

module.exports = {
  addConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  deleteConsultation,
  acceptConsultation,
  rejectConsultation
}