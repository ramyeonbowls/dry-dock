<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IconPlus, IconLoader2, IconCheck, IconCalendarEvent } from '@tabler/icons-vue'
import AppModal from '@/components/AppModal.vue'
import { fetchApi } from '@/lib/api'

interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'Pre-Docking' | 'In-Dock' | 'Flooding & Undocking' | 'Sea Trial'
  totalChecks: number
  completedChecks: number
  status: 'Pending' | 'In Progress' | 'Completed'
  targetDate: string
}

const checklists = ref<ChecklistItem[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const newItem = ref({
  title: '',
  description: '',
  category: 'Pre-Docking' as 'Pre-Docking' | 'In-Dock' | 'Flooding & Undocking' | 'Sea Trial',
  totalChecks: 10
})

async function loadData() {
  loading.value = true
  try {
    checklists.value = await fetchApi<ChecklistItem[]>('/checklists')
  } catch (err) {
    console.error('Failed to load checklists', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newItem.value = {
    title: '',
    description: '',
    category: 'Pre-Docking',
    totalChecks: 10
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newItem.value.title.trim()) {
    alert('Please enter title')
    return
  }

  try {
    const created = await fetchApi<ChecklistItem>('/checklists', {
      method: 'POST',
      body: JSON.stringify(newItem.value)
    })
    checklists.value.unshift(created)
    isModalOpen.value = false
  } catch {
    checklists.value.unshift({
      id: `chk-${Date.now()}`,
      status: 'Pending',
      completedChecks: 0,
      targetDate: new Date().toISOString().split('T')[0],
      ...newItem.value
    })
    isModalOpen.value = false
  }
}

function toggleCheck(item: ChecklistItem) {
  if (item.completedChecks < item.totalChecks) {
    item.completedChecks++
    if (item.completedChecks === item.totalChecks) item.status = 'Completed'
    else item.status = 'In Progress'
  } else {
    item.completedChecks = 0
    item.status = 'Pending'
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
          <span>Dry Dock Checklists</span>
          <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
        </h1>
        <p class="text-sm text-muted-foreground">
          Critical inspection milestones: Pre-docking, in-dock hot work, de-docking & sea trial protocols.
        </p>
      </div>
      <Button class="gap-1.5" @click="openAddModal">
        <IconPlus class="size-4" />
        <span>New Checklist</span>
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        v-for="chk in checklists"
        :key="chk.id"
        class="hover:border-primary/50 transition-colors shadow-xs"
      >
        <CardHeader class="pb-3">
          <div class="flex items-center justify-between gap-2">
            <span class="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
              {{ chk.category }}
            </span>
            <Badge
              :variant="chk.status === 'Completed' ? 'default' : 'secondary'"
              class="text-xs"
            >
              {{ chk.status }}
            </Badge>
          </div>
          <CardTitle class="text-base font-semibold text-foreground mt-2">
            {{ chk.title }}
          </CardTitle>
          <CardDescription class="text-xs mt-1">
            {{ chk.description }}
          </CardDescription>
        </CardHeader>

        <CardContent class="pt-0 space-y-3">
          <!-- Progress bar -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between text-xs text-muted-foreground">
              <span>Progress</span>
              <span class="font-medium text-foreground">
                {{ chk.completedChecks }} / {{ chk.totalChecks }} ({{ Math.round((chk.completedChecks / chk.totalChecks) * 100) }}%)
              </span>
            </div>
            <div class="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                class="bg-emerald-500 h-full rounded-full transition-all"
                :style="{ width: `${(chk.completedChecks / chk.totalChecks) * 100}%` }"
              />
            </div>
          </div>

          <div class="border-t pt-3 flex items-center justify-between text-xs">
            <span class="flex items-center gap-1 text-muted-foreground">
              <IconCalendarEvent class="size-3.5" />
              Target: {{ chk.targetDate }}
            </span>
            <Button size="sm" variant="outline" class="h-7 text-xs gap-1" @click="toggleCheck(chk)">
              <IconCheck class="size-3.5" />
              <span>Tick Check ({{ chk.completedChecks }}/{{ chk.totalChecks }})</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Modal Form -->
    <AppModal
      v-model:open="isModalOpen"
      title="Create Drydock Checklist"
      description="Define key verification items for critical docking stages."
    >
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="chk-title">Checklist Title <span class="text-destructive">*</span></Label>
          <Input id="chk-title" v-model="newItem.title" placeholder="e.g. Daily Hot Work & Enclosed Space Entry Permits" />
        </div>

        <div class="space-y-1.5">
          <Label for="chk-desc">Description</Label>
          <textarea
            id="chk-desc"
            v-model="newItem.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="List items, safety guidelines, and inspection steps..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="chk-cat">Category Stage</Label>
            <select
              id="chk-cat"
              v-model="newItem.category"
              class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Pre-Docking">Pre-Docking</option>
              <option value="In-Dock">In-Dock</option>
              <option value="Flooding & Undocking">Flooding & Undocking</option>
              <option value="Sea Trial">Sea Trial</option>
            </select>
          </div>
          <div class="space-y-1.5">
            <Label for="chk-count">Total Checkpoints</Label>
            <Input id="chk-count" v-model.number="newItem.totalChecks" type="number" min="1" />
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreate">Create Checklist</Button>
      </template>
    </AppModal>
  </div>
</template>
