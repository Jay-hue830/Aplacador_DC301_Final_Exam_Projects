<script setup>
import HazardItem from './HazardItem.vue'

const props = defineProps({
  hazards: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['edit', 'delete'])
</script>

<template>
  <section class="reports-section" aria-live="polite">
    <div v-if="props.hazards.length === 0" class="empty-state">
      <p>No hazard reports match your current filters.</p>
    </div>

    <div v-else class="hazard-list">
      <HazardItem
        v-for="hazard in props.hazards"
        :key="hazard.id"
        :hazard="hazard"
        @edit="emit('edit', $event)"
        @delete="emit('delete', $event)"
      />
    </div>
  </section>
</template>
