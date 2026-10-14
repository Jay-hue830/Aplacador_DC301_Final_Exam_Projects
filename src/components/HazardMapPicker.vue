<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({ latitude: null, longitude: null })
  }
})

const emit = defineEmits(['update:modelValue'])
const mapElement = ref(null)
const defaultCenter = [14.5995, 120.9842]
let map
let marker

const createMarkerIcon = () => L.divIcon({
  className: 'hazard-map-marker',
  html: '<span></span>',
  iconSize: [24, 24],
  iconAnchor: [12, 12]
})

const moveMarker = (latitude, longitude) => {
  if (marker) {
    marker.setLatLng([latitude, longitude])
  } else {
    marker = L.marker([latitude, longitude], { icon: createMarkerIcon() }).addTo(map)
  }
}

const setPosition = (latitude, longitude, pan = true) => {
  moveMarker(latitude, longitude)
  if (pan) {
    map.setView([latitude, longitude], Math.max(map.getZoom(), 15))
  }
  emit('update:modelValue', { latitude, longitude })
}

const onMapClick = (event) => {
  setPosition(event.latlng.lat, event.latlng.lng, false)
}

const useCurrentLocation = () => {
  if (!navigator.geolocation) {
    window.alert('Location services are not supported by this browser.')
    return
  }

  navigator.geolocation.getCurrentPosition(
    ({ coords }) => setPosition(coords.latitude, coords.longitude),
    (error) => {
      console.error('Could not get the current location.', error)
      window.alert('Could not access your location. Check your browser location permission and try again.')
    },
    { enableHighAccuracy: true, timeout: 10000 }
  )
}

onMounted(() => {
  map = L.map(mapElement.value, { scrollWheelZoom: false }).setView(defaultCenter, 12)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map)

  map.on('click', onMapClick)

  const { latitude, longitude } = props.modelValue || {}
  if (Number.isFinite(latitude) && Number.isFinite(longitude)) {
    moveMarker(latitude, longitude)
    map.setView([latitude, longitude], 15)
  }
})

watch(
  () => [props.modelValue?.latitude, props.modelValue?.longitude],
  ([latitude, longitude]) => {
    if (map && Number.isFinite(latitude) && Number.isFinite(longitude)) {
      moveMarker(latitude, longitude)
    }
  }
)

onBeforeUnmount(() => {
  if (map) {
    map.off('click', onMapClick)
    map.remove()
  }
})
</script>

<template>
  <div class="hazard-map-picker">
    <div class="map-picker-header">
      <div>
        <strong>Mark the hazard on the map</strong>
        <p>Click the road location to place or move the marker.</p>
      </div>
      <button type="button" class="button button-muted map-location-button" @click="useCurrentLocation">
        Use my location
      </button>
    </div>
    <div ref="mapElement" class="hazard-map" role="application" aria-label="Map for selecting the road hazard location"></div>
    <p v-if="Number.isFinite(modelValue?.latitude) && Number.isFinite(modelValue?.longitude)" class="map-coordinates">
      Pinned: {{ modelValue.latitude.toFixed(5) }}, {{ modelValue.longitude.toFixed(5) }}
    </p>
    <p v-else class="map-coordinates">No map marker selected. You can still submit the typed location.</p>
  </div>
</template>
