<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { IconPlus, IconAnchor, IconLoader2, IconCalendar, IconUser, IconBuildingWarehouse } from '@tabler/icons-vue'
import AppModal from '@/components/AppModal.vue'
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

const projects = ref<DryDockProject[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const newProject = ref({
  dockName: 'Dry Dock #1 (Graving)',
  vesselName: '',
  yardLocation: 'Keppel Shipyard, Singapore',
  status: 'Open' as 'Open' | 'In Progress' | 'On Hold' | 'Complete',
  startDate: new Date().toISOString().split('T')[0],
  estimatedCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
  manager: 'Superintendent'
})

async function loadData() {
  loading.value = true
  try {
    projects.value = await fetchApi<DryDockProject[]>('/dry-docks')
  } catch (err) {
    console.error('Failed to load dry docks', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newProject.value = {
    dockName: 'Dry Dock #1 (Graving)',
    vesselName: '',
    yardLocation: 'Keppel Shipyard, Singapore',
    status: 'Open',
    startDate: new Date().toISOString().split('T')[0],
    estimatedCompletionDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    manager: 'Superintendent'
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newProject.value.vesselName.trim() || !newProject.value.dockName.trim()) {
    alert('Please enter dock and vessel name')
    return
  }

  try {
    const created = await fetchApi<DryDockProject>('/dry-docks', {
      method: 'POST',
      body: JSON.stringify(newProject.value)
    })
    projects.value.unshift(created)
    isModalOpen.value = false
  } catch {
    projects.value.unshift({
      id: `dd-${Date.now()}`,
      completionPercentage: 15,
      ...newProject.value
    })
    isModalOpen.value = false
  }
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Open':
      return 'bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20'
    case 'In Progress':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'On Hold':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Complete':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <div class="flex-1 space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Dry Docks Management</span>
          <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
        </h1>
        <p class="text-sm text-muted-foreground">
          Track dock space occupancy, graving docks, floating docks, and active shipyard contracts.
        </p>
      </div>
      <Button class="gap-1.5" @click="openAddModal">
        <IconPlus class="size-4" />
        <span>Add Docking Project</span>
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="dock in projects"
        :key="dock.id"
        class="hover:border-primary/50 transition-colors shadow-xs flex flex-col justify-between"
      >
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-semibold px-2 py-0.5 rounded border" :class="getStatusBadge(dock.status)">
              {{ dock.status }}
            </span>
            <span class="text-xs font-semibold text-foreground">
              {{ dock.completionPercentage }}%
            </span>
          </div>

          <CardTitle class="text-base font-semibold text-foreground mt-2 flex items-center gap-1.5">
            <IconAnchor class="size-4 text-primary" />
            <span>{{ dock.vesselName }}</span>
          </CardTitle>
          <CardDescription class="text-xs mt-0.5">
            {{ dock.dockName }}
          </CardDescription>
        </CardHeader>

        <CardContent class="pt-0 space-y-3">
          <!-- Progress bar -->
          <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              class="h-full bg-primary rounded-full transition-all"
              :style="{ width: `${dock.completionPercentage}%` }"
            />
          </div>

          <div class="space-y-1.5 text-xs text-muted-foreground pt-1">
            <div class="flex items-center justify-between">
              <span class="flex items-center gap-1">
                <IconBuildingWarehouse class="size-3.5" />
                <span>{{ dock.yardLocation }}</span>
              </span>
            </div>
            <div class="flex items-center justify-between border-t pt-2">
              <span class="flex items-center gap-1">
                <IconCalendar class="size-3.5" />
                <span>{{ dock.startDate }} - {{ dock.estimatedCompletionDate }}</span>
              </span>
              <span class="flex items-center gap-1 font-medium text-foreground">
                <IconUser class="size-3.5 text-muted-foreground" />
                <span>{{ dock.manager.split(' ')[0] }}</span>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Modal Form -->
    <AppModal
      v-model:open="isModalOpen"
      title="Add Drydocking Project"
      description="Register a ship into a drydock facility."
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="dd-vessel">Vessel Name <span class="text-destructive">*</span></Label>
            <Input id="dd-vessel" v-model="newProject.vesselName" placeholder="e.g. MV Ocean Pioneer" />
          </div>
          <div class="space-y-1.5">
            <Label for="dd-dock">Dock Facility <span class="text-destructive">*</span></Label>
            <Input id="dd-dock" v-model="newProject.dockName" placeholder="e.g. Dry Dock #1 (Graving)" />
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="dd-yard">Yard Location</Label>
          <Input id="dd-yard" v-model="newProject.yardLocation" placeholder="e.g. Keppel Shipyard, Singapore" />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="dd-status">Status</Label>
            <select
              id="dd-status"
              v-model="newProject.status"
              class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="On Hold">On Hold</option>
              <option value="Complete">Complete</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <Label for="dd-manager">Superintendent</Label>
            <Input id="dd-manager" v-model="newProject.manager" placeholder="Capt. Hendra Wijaya" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="dd-start">Start Date</Label>
            <Input id="dd-start" v-model="newProject.startDate" type="date" />
          </div>
          <div class="space-y-1.5">
            <Label for="dd-end">Est. Completion</Label>
            <Input id="dd-end" v-model="newProject.estimatedCompletionDate" type="date" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreate">Register Dock</Button>
      </template>
    </AppModal>
  </div>
</template>
