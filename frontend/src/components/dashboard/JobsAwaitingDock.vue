<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IconPlus,
  IconClock,
  IconShip,
  IconTrash,
  IconLoader2
} from '@tabler/icons-vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import AppModal from '@/components/AppModal.vue'
import { fetchApi } from '@/lib/api'

interface JobAwaitingDock {
  id: string
  title: string
  description: string
  vesselName: string
  category: string
  estimatedDurationDays: number
  priority: 'High' | 'Medium' | 'Low'
  status: 'Approved' | 'Awaiting Slot' | 'Scheduled'
  approvedDate: string
}

const jobs = ref<JobAwaitingDock[]>([])
const loading = ref(false)

// Modal state
const isModalOpen = ref(false)
const newJob = ref({
  title: '',
  description: '',
  vesselName: 'MV Ocean Pioneer',
  category: 'Hull & Structure',
  estimatedDurationDays: 4,
  priority: 'High' as 'High' | 'Medium' | 'Low'
})

async function loadData() {
  loading.value = true
  try {
    jobs.value = await fetchApi<JobAwaitingDock[]>('/jobs-awaiting-dock')
  } catch (err) {
    console.error('Failed to load jobs awaiting dock', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newJob.value = {
    title: '',
    description: '',
    vesselName: 'MV Ocean Pioneer',
    category: 'Hull & Structure',
    estimatedDurationDays: 4,
    priority: 'Medium'
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newJob.value.title.trim() || !newJob.value.description.trim()) {
    alert('Please enter both Title and Description.')
    return
  }

  try {
    const created = await fetchApi<JobAwaitingDock>('/jobs-awaiting-dock', {
      method: 'POST',
      body: JSON.stringify(newJob.value)
    })
    jobs.value.unshift(created)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to create job', err)
    // Fallback local
    const localItem: JobAwaitingDock = {
      id: `job-loc-${Date.now()}`,
      title: newJob.value.title,
      description: newJob.value.description,
      vesselName: newJob.value.vesselName,
      category: newJob.value.category,
      estimatedDurationDays: newJob.value.estimatedDurationDays,
      priority: newJob.value.priority,
      status: 'Approved',
      approvedDate: new Date().toISOString().split('T')[0]
    }
    jobs.value.unshift(localItem)
    isModalOpen.value = false
  }
}

async function handleDelete(id: string) {
  try {
    await fetchApi(`/jobs-awaiting-dock/${id}`, { method: 'DELETE' })
  } catch {}
  jobs.value = jobs.value.filter(j => j.id !== id)
}

function getPriorityBadgeClass(priority: string) {
  switch (priority) {
    case 'High':
      return 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20'
    case 'Medium':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Low':
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
    default:
      return ''
  }
}

onMounted(() => {
  loadData()
})
</script>

<template>
  <Card class="shadow-xs">
    <CardHeader class="pb-3">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <CardTitle class="text-base font-semibold flex items-center gap-2">
            <span>Jobs Awaiting Dock</span>
            <Badge variant="outline" class="font-normal">{{ jobs.length }} jobs ready</Badge>
            <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
          </CardTitle>
          <CardDescription class="text-xs">
            Approved technical specifications ready to execute once docking slot commences.
          </CardDescription>
        </div>
        <!-- Fitur 2.3.a: Tombol aksi untuk mendaftarkan pekerjaan baru yang siap masuk dock -->
        <Button size="sm" class="gap-1.5" @click="openAddModal">
          <IconPlus class="size-4" />
          <span>Register Dock Job</span>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        <div
          v-if="jobs.length === 0"
          class="col-span-full py-8 text-center text-xs text-muted-foreground border border-dashed rounded-lg"
        >
          No pending jobs awaiting dock. Click "Register Dock Job" to add one.
        </div>

        <div
          v-for="job in jobs"
          :key="job.id"
          class="border rounded-xl p-3.5 bg-card hover:border-primary/50 transition-all flex flex-col justify-between group relative"
        >
          <div>
            <div class="flex items-center justify-between gap-2 mb-2">
              <span class="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                {{ job.category }}
              </span>
              <div class="flex items-center gap-1.5">
                <span
                  class="text-[10px] font-semibold px-1.5 py-0.5 rounded border"
                  :class="getPriorityBadgeClass(job.priority)"
                >
                  {{ job.priority }}
                </span>
                <button
                  class="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                  title="Remove Job"
                  @click="handleDelete(job.id)"
                >
                  <IconTrash class="size-3.5" />
                </button>
              </div>
            </div>

            <h4 class="text-sm font-semibold text-foreground leading-snug mb-1">
              {{ job.title }}
            </h4>
            <p class="text-xs text-muted-foreground line-clamp-2 mb-3">
              {{ job.description }}
            </p>
          </div>

          <div class="border-t pt-2.5 mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span class="flex items-center gap-1 font-medium text-foreground">
              <IconShip class="size-3.5 text-muted-foreground" />
              {{ job.vesselName }}
            </span>
            <span class="flex items-center gap-1">
              <IconClock class="size-3.5 text-muted-foreground" />
              Est. {{ job.estimatedDurationDays }} days
            </span>
          </div>
        </div>
      </div>
    </CardContent>

    <!-- Modal Form (Fitur 2.3.a: Title & Description Input) -->
    <AppModal
      v-model:open="isModalOpen"
      title="Register Job Awaiting Dock"
      description="Add an approved work package awaiting ship drydocking window."
    >
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="job-title">Job Title <span class="text-destructive">*</span></Label>
          <Input
            id="job-title"
            v-model="newJob.title"
            placeholder="e.g. Propeller Blade Polishing & Laser Pitch Alignment"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="job-desc">Job Description <span class="text-destructive">*</span></Label>
          <textarea
            id="job-desc"
            v-model="newJob.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Detailed scope of overhaul, surveyor requirements, safety constraints..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="job-vessel">Vessel Name</Label>
            <Input
              id="job-vessel"
              v-model="newJob.vesselName"
              placeholder="e.g. MV Ocean Pioneer"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="job-cat">Category</Label>
            <select
              id="job-cat"
              v-model="newJob.category"
              class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Hull & Structure">Hull & Structure</option>
              <option value="Propulsion & Shaft">Propulsion & Shaft</option>
              <option value="Piping & Valves">Piping & Valves</option>
              <option value="Electrical & Automation">Electrical & Automation</option>
              <option value="Safety & Navigation">Safety & Navigation</option>
            </select>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="job-days">Estimated Duration (Days)</Label>
            <Input
              id="job-days"
              v-model.number="newJob.estimatedDurationDays"
              type="number"
              min="1"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="job-priority">Priority</Label>
            <select
              id="job-priority"
              v-model="newJob.priority"
              class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreate">Register Job</Button>
      </template>
    </AppModal>
  </Card>
</template>
