<script setup>
const props = defineProps({
  hazard: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])

const statusClass = {
  pending: 'status-pending',
  'in progress': 'status-progress',
  resolved: 'status-resolved'
}

const severityClass = {
  low: 'severity-low',
  medium: 'severity-medium',
  high: 'severity-high',
  critical: 'severity-critical'
}

const formatDate = (value) => {
  if (!value) return 'No date'
  const safeValue = new Date(value)

  if (Number.isNaN(safeValue.getTime())) {
    return value
  }

  return safeValue.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>

<template>
  <article class="hazard-card">
    <div class="hazard-card-header">
      <div>
        <p class="hazard-type-label">{{ props.hazard.category }}</p>
        <h3>{{ props.hazard.title }}</h3>
      </div>
      <span :class="['status-badge', statusClass[props.hazard.status] || 'status-pending']">
        {{ props.hazard.status }}
      </span>
    </div>

    <div class="hazard-meta-grid">
      <div>
        <span class="meta-label">Location</span>
        <strong>{{ props.hazard.location }}</strong>
        <a
          v-if="Number.isFinite(props.hazard.latitude) && Number.isFinite(props.hazard.longitude)"
          class="hazard-map-link"
          :href="`https://www.openstreetmap.org/?mlat=${props.hazard.latitude}&mlon=${props.hazard.longitude}#map=17/${props.hazard.latitude}/${props.hazard.longitude}`"
          target="_blank"
          rel="noopener noreferrer"
        >View pinned map</a>
      </div>
      <div>
        <span class="meta-label">Severity</span>
        <strong :class="['severity-badge', severityClass[props.hazard.severity] || 'severity-medium']">{{ props.hazard.severity }}</strong>
      </div>
      <div>
        <span class="meta-label">Reported</span>
        <strong>{{ formatDate(props.hazard.dateReported) }}</strong>
      </div>
    </div>

    <div v-if="props.hazard.image" class="hazard-photo-wrap">
      <img :src="props.hazard.image" :alt="`${props.hazard.title} hazard photo`" class="hazard-photo" />
    </div>

    <p v-if="props.hazard.description" class="hazard-description">{{ props.hazard.description }}</p>
    <p v-else class="hazard-description muted">No description provided.</p>

    <div class="hazard-card-actions">
      <button type="button" class="button button-secondary" @click="emit('edit', props.hazard)">Edit</button>
      <button type="button" class="button button-danger" @click="emit('delete', props.hazard.id)">Delete</button>
    </div>
  </article>
</template>
