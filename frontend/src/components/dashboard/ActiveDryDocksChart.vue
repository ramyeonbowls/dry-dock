<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { IconLoader2, IconAnchor } from '@tabler/icons-vue'
import { fetchApi } from '@/lib/api'

interface DryDockProject {
  id: string
  dockName: string
  vesselName: string
  yardLocation: string
  status: 'Open' | 'In Progress' | 'On Hold' | 'Complete'
  startDate: string
  estimatedCompletionDate: string
  completionPercentage: number
  manager: string
}

interface StatsResponse {
  total: number
  counts: Record<string, number>
  chartData: { status: string; count: number; color: string }[]
  projects: DryDockProject[]
}

const loading = ref(false)
const projects = ref<DryDockProject[]>([])

const categoryColors: Record<string, { fill: string; bg: string; text: string; border: string }> = {
  'Open': { fill: '#38bdf8', bg: 'bg-sky-500/10', text: 'text-sky-600 dark:text-sky-400', border: 'border-sky-500/30' },
  'In Progress': { fill: '#3b82f6', bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-500/30' },
  'On Hold': { fill: '#f59e0b', bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', border: 'border-amber-500/30' },
  'Complete': { fill: '#10b981', bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', border: 'border-emerald-500/30' }
}

const statusCounts = ref<Record<string, number>>({
  'Open': 1,
  'In Progress': 2,
  'On Hold': 1,
  'Complete': 2
})

const totalDocks = computed(() => {
  return Object.values(statusCounts.value).reduce((a, b) => a + b, 0)
})

const donutSegments = computed(() => {
  const total = totalDocks.value || 1
  const radius = 64
  const circumference = 2 * Math.PI * radius
  let accumulatedPercent = 0

  const categories = ['Open', 'In Progress', 'On Hold', 'Complete']

  return categories.map(cat => {
    const count = statusCounts.value[cat] || 0
    const percent = count / total
    const strokeDasharray = `${percent * circumference} ${circumference}`
    const strokeDashoffset = -accumulatedPercent * circumference
    accumulatedPercent += percent

    return {
      status: cat,
      count,
      percent: Math.round(percent * 100),
      color: categoryColors[cat]?.fill || '#94a3b8',
      strokeDasharray,
      strokeDashoffset
    }
  })
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchApi<StatsResponse>('/dry-docks/stats')
    if (res.counts) statusCounts.value = res.counts
    if (res.projects) projects.value = res.projects
  } catch (err) {
    console.error('Failed to load dry docks stats', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <Card class="shadow-xs h-full flex flex-col justify-between">
    <CardHeader class="pb-2">
      <div class="flex items-center justify-between">
        <div>
          <CardTitle class="text-base font-semibold flex items-center gap-2">
            <span>Active Dry Docks</span>
            <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
          </CardTitle>
          <CardDescription class="text-xs">
            Operational status breakdown of all ongoing and scheduled docking projects.
          </CardDescription>
        </div>
        <Badge variant="outline" class="text-xs">
          {{ totalDocks }} Total Docks
        </Badge>
      </div>
    </CardHeader>

    <CardContent class="pt-2">
      <div class="flex flex-col sm:flex-row items-center justify-around gap-6 py-2">
        <!-- SVG Donut Chart -->
        <div class="relative size-44 flex items-center justify-center shrink-0">
          <svg class="size-full -rotate-90" viewBox="0 0 160 160">
            <!-- Background Ring -->
            <circle
              cx="80"
              cy="80"
              r="64"
              class="stroke-muted/30 fill-none"
              stroke-width="18"
            />
            <!-- Donut Segments -->
            <circle
              v-for="seg in donutSegments"
              :key="seg.status"
              cx="80"
              cy="80"
              r="64"
              class="fill-none transition-all duration-500 ease-out"
              :stroke="seg.color"
              stroke-width="18"
              :stroke-dasharray="seg.strokeDasharray"
              :stroke-dashoffset="seg.strokeDashoffset"
              stroke-linecap="round"
            />
          </svg>

          <!-- Donut Center Label -->
          <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
            <span class="text-2xl font-bold tracking-tight text-foreground leading-none">
              {{ totalDocks }}
            </span>
            <span class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-0.5">
              Docks
            </span>
          </div>
        </div>

        <!-- Legend & Category Breakdown (Kategori Status Chart: Open, In Progress, On Hold, Complete) -->
        <div class="grid grid-cols-2 gap-2.5 w-full sm:w-auto min-w-[210px]">
          <div
            v-for="seg in donutSegments"
            :key="seg.status"
            class="flex items-center justify-between p-2 rounded-lg border bg-card/60"
            :class="categoryColors[seg.status]?.border"
          >
            <div class="flex items-center gap-2">
              <span
                class="size-2.5 rounded-full shrink-0"
                :style="{ backgroundColor: seg.color }"
              />
              <span class="text-xs font-medium text-foreground">
                {{ seg.status }}
              </span>
            </div>
            <div class="flex items-center gap-1.5 ml-2">
              <span class="text-xs font-bold text-foreground">{{ seg.count }}</span>
              <span class="text-[10px] text-muted-foreground">({{ seg.percent }}%)</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Quick preview of active projects -->
      <div v-if="projects.length > 0" class="mt-4 border-t pt-3 space-y-2">
        <div class="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          Recent Docking Projects
        </div>
        <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
          <div
            v-for="proj in projects.slice(0, 3)"
            :key="proj.id"
            class="flex items-center justify-between text-xs p-1.5 rounded-md hover:bg-muted/50 transition-colors"
          >
            <div class="flex items-center gap-2 min-w-0">
              <IconAnchor class="size-3.5 text-muted-foreground shrink-0" />
              <div class="truncate">
                <span class="font-medium text-foreground">{{ proj.vesselName }}</span>
                <span class="text-muted-foreground ml-1 text-[11px]">({{ proj.dockName }})</span>
              </div>
            </div>
            <span
              class="text-[10px] font-semibold px-1.5 py-0.5 rounded border shrink-0"
              :class="[categoryColors[proj.status]?.bg, categoryColors[proj.status]?.text, categoryColors[proj.status]?.border]"
            >
              {{ proj.status }}
            </span>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
