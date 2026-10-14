<script setup>
import { computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentPath = computed(() => route.path)
const pageMap = {
  '/': 'Home',
  '/requirements': 'Requirements',
  '/hazards': 'Hazard manager'
}

const currentPage = computed(() => pageMap[currentPath.value] || 'Home')

watch(currentPage, (title) => {
  document.title = `${title} | Local Road Hazard Monitoring System`
}, { immediate: true })
</script>

<template>
  <div class="app-shell">
    <header class="topbar">
      <RouterLink class="brand" to="/" aria-label="Local Road Hazard Monitoring System home">
        <span class="brand-mark">L<span>↗</span></span>
        <span class="brand-name">Local Road Hazard Monitoring System</span>
      </RouterLink>
      <nav class="main-nav" aria-label="Main navigation">
        <RouterLink to="/" :class="{ active: currentPath === '/' }">Overview</RouterLink>
        <RouterLink to="/requirements" :class="{ active: currentPath === '/requirements' }">Requirements</RouterLink>
        <RouterLink to="/hazards" :class="{ active: currentPath === '/hazards' }">Hazard manager</RouterLink>
      </nav>
      <RouterLink class="top-cta" to="/hazards" aria-label="Open project" aria-hidden="true"></RouterLink>
    </header>

    <main>
      <RouterView />
    </main>

    <footer class="site-footer"><div class="page-wrap footer-inner"><RouterLink class="brand footer-brand" to="/" aria-label="Local Road Hazard Monitoring System home"><span class="brand-mark">L<span>↗</span></span><span class="brand-name">Local Road Hazard Monitoring System</span></RouterLink><span>Built for safer streets.</span></div></footer>
  </div>
</template>
