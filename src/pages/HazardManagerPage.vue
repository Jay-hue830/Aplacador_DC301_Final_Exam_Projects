<script setup>
import { computed, onMounted, ref } from 'vue'
import HazardForm from '../components/HazardForm.vue'
import HazardList from '../components/HazardList.vue'

const STORAGE_KEY = 'roadwise-hazards-v1'
const categories = ['pothole', 'damaged road', 'flooding', 'fallen tree', 'road obstruction', 'other']
const severityOrder = { low: 1, medium: 2, high: 3, critical: 4 }
const statusOrder = { pending: 1, 'in progress': 2, resolved: 3 }

const makeDate = () => new Date().toISOString().slice(0, 10)

const createUniqueId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `hazard-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const normalizeStatus = (value) => {
  const status = String(value ?? '').trim().toLowerCase()

  if (status === 'reported') return 'pending'
  if (status === 'in progress' || status === 'in_progress' || status === 'inprogress') return 'in progress'
  if (status === 'resolved') return 'resolved'
  if (status === 'pending' || status === 'in progress' || status === 'resolved') return status

  return 'pending'
}

const normalizeSeverity = (value) => {
  const severity = String(value ?? '').trim().toLowerCase()

  if (['low', 'medium', 'high', 'critical'].includes(severity)) {
    return severity
  }

  return 'medium'
}

const normalizeCategory = (value) => {
  const category = String(value ?? '').trim().toLowerCase()
  return categories.includes(category) ? category : ''
}

const normalizeCoordinate = (value, minimum, maximum) => {
  if (value === null || value === undefined || value === '') return null

  const coordinate = Number(value)
  return Number.isFinite(coordinate) && coordinate >= minimum && coordinate <= maximum
    ? coordinate
    : null
}

const normalizeHazard = (record = {}) => ({
  id: record.id ?? createUniqueId(),
  title: String(record.title ?? '').trim(),
  category: normalizeCategory(record.category),
  location: String(record.location ?? '').trim(),
  description: String(record.description ?? '').trim(),
  severity: normalizeSeverity(record.severity),
  status: normalizeStatus(record.status),
  dateReported: String(record.dateReported ?? '').trim() || makeDate(),
  image: String(record.image ?? '').trim(),
  latitude: normalizeCoordinate(record.latitude, -90, 90),
  longitude: normalizeCoordinate(record.longitude, -180, 180)
})

const buildEmptyForm = () => ({
  id: null,
  title: '',
  category: '',
  location: '',
  description: '',
  severity: 'medium',
  status: 'pending',
  dateReported: makeDate(),
  image: '',
  latitude: null,
  longitude: null
})

const defaultHazards = [
  {
    id: 'hazard-1',
    title: 'Large pothole near the market',
    category: 'pothole',
    location: 'Rizal Street, Poblacion',
    description: 'A deep pothole has formed after the recent rain and is damaging local traffic.',
    severity: 'high',
    status: 'in progress',
    dateReported: '2026-10-01'
  },
  {
    id: 'hazard-2',
    title: 'Fallen tree blocking the lane',
    category: 'fallen tree',
    location: 'National Road, Zone 2',
    description: 'A large tree branch is leaning across the lane and needs immediate clearance.',
    severity: 'critical',
    status: 'pending',
    dateReported: '2026-10-04'
  },
  {
    id: 'hazard-3',
    title: 'Flooded road at the intersection',
    category: 'flooding',
    location: 'Mabini Avenue',
    description: 'Floodwater is covering the lower section of the road and forcing drivers to slow down.',
    severity: 'medium',
    status: 'in progress',
    dateReported: '2026-10-08'
  },
  {
    id: 'hazard-4',
    title: 'Roadside barrier removed',
    category: 'road obstruction',
    location: 'School Road',
    description: 'A temporary barrier was removed after maintenance and needs to be replaced for safety.',
    severity: 'low',
    status: 'resolved',
    dateReported: '2026-10-10'
  }
]

const hazards = ref([])
const form = ref(buildEmptyForm())
const formErrors = ref({})
const editingId = ref(null)
const searchTerm = ref('')
const categoryFilter = ref('all')
const severityFilter = ref('all')
const statusFilter = ref('all')
const sortBy = ref('newest')
const notification = ref('')

const validateHazard = (hazard) => {
  const errors = {}

  if (!hazard.title) {
    errors.title = 'Hazard title is required.'
  }

  if (!hazard.category) {
    errors.category = 'Select a hazard category.'
  }

  if (!hazard.location) {
    errors.location = 'Location is required.'
  }

  if (!hazard.description.trim()) {
    errors.description = 'Provide a short description of the hazard.'
  }

  if (!hazard.severity) {
    errors.severity = 'Choose a severity level.'
  }

  if (!hazard.status) {
    errors.status = 'Choose a status.'
  }

  if (!hazard.dateReported || !/^\d{4}-\d{2}-\d{2}$/.test(hazard.dateReported)) {
    errors.dateReported = 'Use a valid date.'
  }

  return errors
}

const stats = computed(() => {
  const total = hazards.value.length
  const pending = hazards.value.filter((hazard) => hazard.status === 'pending').length
  const resolved = hazards.value.filter((hazard) => hazard.status === 'resolved').length
  const highPriority = hazards.value.filter((hazard) => ['high', 'critical'].includes(hazard.severity)).length

  return [
    { label: 'Total hazards', value: total, tone: 'navy' },
    { label: 'Pending reports', value: pending, tone: 'orange' },
    { label: 'Resolved hazards', value: resolved, tone: 'green' },
    { label: 'High-priority', value: highPriority, tone: 'blue' }
  ]
})

const filteredHazards = computed(() => {
  const query = searchTerm.value.trim().toLowerCase()

  const matches = [...hazards.value].filter((hazard) => {
    const matchesQuery = !query || `${hazard.title} ${hazard.location}`.toLowerCase().includes(query)
    const matchesCategory = categoryFilter.value === 'all' || hazard.category === categoryFilter.value
    const matchesSeverity = severityFilter.value === 'all' || hazard.severity === severityFilter.value
    const matchesStatus = statusFilter.value === 'all' || hazard.status === statusFilter.value

    return matchesQuery && matchesCategory && matchesSeverity && matchesStatus
  })

  matches.sort((left, right) => {
    if (sortBy.value === 'oldest') {
      return new Date(left.dateReported) - new Date(right.dateReported)
    }

    if (sortBy.value === 'severity-asc') {
      return severityOrder[left.severity] - severityOrder[right.severity]
    }

    if (sortBy.value === 'severity-desc') {
      return severityOrder[right.severity] - severityOrder[left.severity]
    }

    if (sortBy.value === 'title') {
      return left.title.localeCompare(right.title)
    }

    return new Date(right.dateReported) - new Date(left.dateReported)
  })

  return matches
})

const persistHazards = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(hazards.value))
  } catch (error) {
    console.error('Could not save hazards.', error)
    notification.value = 'Browser storage is full or unavailable. Your current session may not be saved.'
  }
}

const resetForm = () => {
  editingId.value = null
  form.value = buildEmptyForm()
  formErrors.value = {}
}

const handleSubmit = (payload) => {
  const cleaned = normalizeHazard(payload)
  const errors = validateHazard(cleaned)

  formErrors.value = errors

  if (Object.keys(errors).length) {
    return
  }

  const isEditing = editingId.value !== null

  if (isEditing) {
    hazards.value = hazards.value.map((hazard) => hazard.id === editingId.value ? { ...hazard, ...cleaned, id: hazard.id } : hazard)
    notification.value = 'Hazard updated successfully.'
  } else {
    hazards.value = [{ ...cleaned, id: createUniqueId() }, ...hazards.value]
    notification.value = 'New hazard added successfully.'
  }

  persistHazards()
  resetForm()
}

const editHazard = (hazard) => {
  editingId.value = hazard.id
  form.value = { ...normalizeHazard(hazard) }
  formErrors.value = {}
}

const deleteHazard = (id) => {
  const selected = hazards.value.find((hazard) => hazard.id === id)

  if (!selected) {
    return
  }

  const confirmed = window.confirm(`Delete "${selected.title}"? This action cannot be undone.`)
  if (!confirmed) {
    return
  }

  hazards.value = hazards.value.filter((hazard) => hazard.id !== id)
  persistHazards()
  notification.value = `Deleted the report for ${selected.title}.`

  if (editingId.value === id) {
    resetForm()
  }
}

onMounted(() => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)

    if (!saved) {
      hazards.value = defaultHazards.map((hazard) => normalizeHazard(hazard))
      persistHazards()
      return
    }

    const parsed = JSON.parse(saved)
    if (!Array.isArray(parsed)) {
      throw new Error('Saved data is not an array.')
    }

    hazards.value = parsed.map((hazard) => normalizeHazard(hazard)).filter((hazard) => hazard.title)
  } catch (error) {
    console.error('Unable to load saved reports.', error)
    hazards.value = defaultHazards.map((hazard) => normalizeHazard(hazard))
    notification.value = 'Saved reports could not be loaded, so the sample records are shown instead.'
    persistHazards()
  }
})
</script>

<template>
  <section class="page-wrap content-page dashboard-page">
    <div class="page-heading manager-heading">
      <div>
        <p class="eyebrow eyebrow-soft">Operations dashboard</p>
        <h1>Community <em>roadwatch.</em></h1>
        <p>Add a report, keep status current, and make the right follow-up decisions easier for the whole community.</p>
      </div>
    </div>

    <div class="stats-grid">
      <article v-for="stat in stats" :key="stat.label" class="stat-tile">
        <span>{{ stat.label }}</span>
        <strong :class="`stat-${stat.tone}`">{{ String(stat.value).padStart(2, '0') }}</strong>
        <span class="stat-foot"><i></i> Live count</span>
      </article>
    </div>

    <div v-if="notification" class="storage-message" role="status">{{ notification }}</div>

    <div class="manager-layout">
      <div class="manager-form-wrap">
        <div class="manager-section-heading">
          <div>
            <span class="concept-tag">{{ editingId !== null ? 'Edit report' : 'New report' }}</span>
            <h2>{{ editingId !== null ? 'Update a hazard' : 'Report a hazard' }}</h2>
          </div>
        </div>

        <HazardForm :form="form" :editing-id="editingId" :errors="formErrors" @submit="handleSubmit" @cancel="resetForm" />
      </div>

      <div class="manager-list-wrap">
        <div class="manager-section-heading list-heading">
          <div>
            <span class="concept-tag">Community feed</span>
            <h2>Recent reports <span class="list-count">{{ filteredHazards.length }}</span></h2>
          </div>
        </div>

        <div class="list-tools">
          <label class="search-field">
            <span>⌕</span>
            <input v-model="searchTerm" type="search" placeholder="Search by title or location" />
          </label>
          <select v-model="categoryFilter" aria-label="Filter by category">
            <option value="all">All categories</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <select v-model="severityFilter" aria-label="Filter by severity">
            <option value="all">All severities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
          <select v-model="statusFilter" aria-label="Filter by status">
            <option value="all">All statuses</option>
            <option value="pending">Pending</option>
            <option value="in progress">In progress</option>
            <option value="resolved">Resolved</option>
          </select>
          <select v-model="sortBy" aria-label="Sort hazards">
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="severity-desc">Severity: high to low</option>
            <option value="severity-asc">Severity: low to high</option>
            <option value="title">Title A–Z</option>
          </select>
        </div>

        <HazardList :hazards="filteredHazards" @edit="editHazard" @delete="deleteHazard" />
      </div>
    </div>
  </section>
</template>
