<script setup>
import { computed } from 'vue'
import HazardMapPicker from './HazardMapPicker.vue'

const props = defineProps({
  form: {
    type: Object,
    required: true
  },
  editingId: {
    type: [Number, String, null],
    default: null
  },
  errors: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['submit', 'cancel'])

const categories = [
  'pothole',
  'damaged road',
  'flooding',
  'fallen tree',
  'road obstruction',
  'other'
]

const severityOptions = ['low', 'medium', 'high', 'critical']
const statusOptions = ['pending', 'in progress', 'resolved']
const isEditing = computed(() => props.editingId !== null)

const submitForm = () => {
  emit('submit', {
    id: props.form.id ?? null,
    title: String(props.form.title ?? '').trim(),
    category: String(props.form.category ?? '').trim(),
    location: String(props.form.location ?? '').trim(),
    description: String(props.form.description ?? '').trim(),
    severity: String(props.form.severity ?? '').trim(),
    status: String(props.form.status ?? '').trim(),
    dateReported: String(props.form.dateReported ?? '').trim(),
    image: String(props.form.image ?? '').trim(),
    latitude: props.form.latitude ?? null,
    longitude: props.form.longitude ?? null
  })
}

const updateMapPosition = ({ latitude, longitude }) => {
  props.form.latitude = latitude
  props.form.longitude = longitude
}

const handleImageUpload = (event) => {
  const file = event.target.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    event.target.value = ''
    return
  }

  const reader = new FileReader()
  reader.onload = () => {
    props.form.image = String(reader.result || '')
  }
  reader.readAsDataURL(file)
}

const clearImage = () => {
  props.form.image = ''
  const input = document.getElementById('hazard-image')
  if (input) {
    input.value = ''
  }
}

const fieldError = (field) => props.errors?.[field] || ''
const inputClass = (field) => ({ invalid: Boolean(fieldError(field)) })
</script>

<template>
  <section class="form-section">
    <form @submit.prevent="submitForm" novalidate>
      <div class="form-grid">
        <div class="field-block">
          <label for="hazard-title">Hazard title</label>
          <input id="hazard-title" v-model="form.title" type="text" :class="inputClass('title')" placeholder="Example: Large pothole on Main Street" />
          <small v-if="fieldError('title')" class="field-error">{{ fieldError('title') }}</small>
        </div>

        <div class="field-block">
          <label for="hazard-category">Category</label>
          <select id="hazard-category" v-model="form.category" :class="inputClass('category')">
            <option value="">Select a category</option>
            <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
          </select>
          <small v-if="fieldError('category')" class="field-error">{{ fieldError('category') }}</small>
        </div>

        <div class="field-block">
          <label for="hazard-location">Location</label>
          <input id="hazard-location" v-model="form.location" type="text" :class="inputClass('location')" placeholder="Example: Rizal Street, Poblacion" />
          <small v-if="fieldError('location')" class="field-error">{{ fieldError('location') }}</small>
        </div>

        <div class="field-block full-width">
          <HazardMapPicker
            :model-value="{ latitude: form.latitude, longitude: form.longitude }"
            @update:model-value="updateMapPosition"
          />
        </div>

        <div class="field-block">
          <label for="hazard-date">Date reported</label>
          <input id="hazard-date" v-model="form.dateReported" type="date" :class="inputClass('dateReported')" />
          <small v-if="fieldError('dateReported')" class="field-error">{{ fieldError('dateReported') }}</small>
        </div>

        <div class="field-block">
          <label for="hazard-severity">Severity</label>
          <select id="hazard-severity" v-model="form.severity" :class="inputClass('severity')">
            <option value="">Select severity</option>
            <option v-for="severity in severityOptions" :key="severity" :value="severity">{{ severity }}</option>
          </select>
          <small v-if="fieldError('severity')" class="field-error">{{ fieldError('severity') }}</small>
        </div>

        <div class="field-block">
          <label for="hazard-status">Status</label>
          <select id="hazard-status" v-model="form.status" :class="inputClass('status')">
            <option value="">Select status</option>
            <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
          </select>
          <small v-if="fieldError('status')" class="field-error">{{ fieldError('status') }}</small>
        </div>

        <div class="field-block full-width">
          <label for="hazard-description">Description</label>
          <textarea id="hazard-description" v-model="form.description" :class="inputClass('description')" rows="4" placeholder="Describe the hazard, risks, and any visible conditions."></textarea>
          <small v-if="fieldError('description')" class="field-error">{{ fieldError('description') }}</small>
        </div>

        <div class="field-block full-width">
          <label for="hazard-image">Hazard photo</label>
          <div class="image-upload-box">
            <input id="hazard-image" type="file" accept="image/*" @change="handleImageUpload" />
            <p class="upload-hint">Upload a photo that shows the road condition.</p>
          </div>

          <div v-if="form.image" class="image-preview-wrap">
            <img :src="form.image" alt="Hazard preview" class="image-preview" />
            <button type="button" class="button button-muted remove-image-btn" @click="clearImage">Remove photo</button>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="button button-dark form-submit">
          {{ isEditing ? 'Update report' : 'Add report' }}
        </button>
        <button v-if="isEditing" type="button" class="button button-muted" @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </form>
  </section>
</template>
