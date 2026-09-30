<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IconPlus,
  IconClock,
  IconShip,
  IconBuildingWarehouse,
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

interface YardQuote {
  id: string
  title: string
  description: string
  yardName: string
  vesselName: string
  requestDate: string
  targetResponseDate: string
  status: 'Sent to Yard' | 'Awaiting Response' | 'Under Review'
  priority: 'High' | 'Medium' | 'Low'
}

const yardQuotes = ref<YardQuote[]>([])
const loading = ref(false)

// Modal state
const isModalOpen = ref(false)
const newQuote = ref({
  title: '',
  description: '',
  yardName: 'Keppel Shipyard Singapore',
  vesselName: 'MV Ocean Pioneer',
  targetResponseDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
  priority: 'Medium' as 'High' | 'Medium' | 'Low'
})

async function loadData() {
  loading.value = true
  try {
    yardQuotes.value = await fetchApi<YardQuote[]>('/yard-quotes')
  } catch (err) {
    console.error('Failed to load yard quotes', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newQuote.value = {
    title: '',
    description: '',
    yardName: 'Keppel Shipyard Singapore',
    vesselName: 'MV Ocean Pioneer',
    targetResponseDate: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    priority: 'Medium'
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newQuote.value.title.trim() || !newQuote.value.description.trim()) {
    alert('Please provide both Title and Description.')
    return
  }

  try {
    const created = await fetchApi<YardQuote>('/yard-quotes', {
      method: 'POST',
      body: JSON.stringify(newQuote.value)
    })
    yardQuotes.value.unshift(created)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to create yard quote', err)
    // Fallback local
    const localItem: YardQuote = {
      id: `yq-loc-${Date.now()}`,
      title: newQuote.value.title,
      description: newQuote.value.description,
      yardName: newQuote.value.yardName,
      vesselName: newQuote.value.vesselName,
      requestDate: new Date().toISOString().split('T')[0],
      targetResponseDate: newQuote.value.targetResponseDate,
      status: 'Awaiting Response',
      priority: newQuote.value.priority
    }
    yardQuotes.value.unshift(localItem)
    isModalOpen.value = false
  }
}

async function handleDelete(id: string) {
  try {
    await fetchApi(`/yard-quotes/${id}`, { method: 'DELETE' })
  } catch {}
  yardQuotes.value = yardQuotes.value.filter(q => q.id !== id)
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'Awaiting Response':
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
    case 'Under Review':
      return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20'
    case 'Sent to Yard':
      return 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20'
    default:
      return 'bg-muted text-muted-foreground'
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
            <span>Pending Yard Quotes</span>
            <Badge variant="outline" class="font-normal">{{ yardQuotes.length }} items</Badge>
            <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
          </CardTitle>
          <CardDescription class="text-xs">
            Quotation inquiries dispatched and awaiting pricing breakdown from shipyards.
          </CardDescription>
        </div>
        <!-- Fitur 2.2.a: Tombol aksi untuk membuat pengajuan Yard Quote baru -->
        <Button size="sm" class="gap-1.5" @click="openAddModal">
          <IconPlus class="size-4" />
          <span>New Yard Quote</span>
        </Button>
      </div>
    </CardHeader>
    <CardContent>
      <div class="overflow-x-auto">
        <table class="w-full text-left text-sm border-collapse">
          <thead>
            <tr class="border-b text-xs text-muted-foreground bg-muted/30">
              <th class="py-2.5 px-3 font-medium">Work Scope / Title</th>
              <th class="py-2.5 px-3 font-medium">Shipyard (Yard)</th>
              <th class="py-2.5 px-3 font-medium">Vessel</th>
              <th class="py-2.5 px-3 font-medium">Target Date</th>
              <th class="py-2.5 px-3 font-medium">Status</th>
              <th class="py-2.5 px-3 font-medium text-right">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/60">
            <tr v-if="yardQuotes.length === 0" class="text-center text-xs text-muted-foreground py-8">
              <td colspan="6" class="py-6">No pending yard quotations found. Click "New Yard Quote" to create one.</td>
            </tr>
            <tr
              v-for="quote in yardQuotes"
              :key="quote.id"
              class="hover:bg-muted/40 transition-colors group"
            >
              <td class="py-3 px-3 max-w-[280px]">
                <div class="font-medium text-foreground text-xs leading-snug">{{ quote.title }}</div>
                <div class="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{{ quote.description }}</div>
              </td>
              <td class="py-3 px-3 text-xs whitespace-nowrap">
                <span class="flex items-center gap-1.5 font-medium text-foreground">
                  <IconBuildingWarehouse class="size-3.5 text-muted-foreground" />
                  {{ quote.yardName }}
                </span>
              </td>
              <td class="py-3 px-3 text-xs whitespace-nowrap">
                <span class="flex items-center gap-1 text-muted-foreground">
                  <IconShip class="size-3.5" />
                  {{ quote.vesselName }}
                </span>
              </td>
              <td class="py-3 px-3 text-xs whitespace-nowrap text-muted-foreground">
                <span class="flex items-center gap-1">
                  <IconClock class="size-3.5" />
                  {{ quote.targetResponseDate }}
                </span>
              </td>
              <td class="py-3 px-3 whitespace-nowrap">
                <span
                  class="text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block"
                  :class="getStatusBadge(quote.status)"
                >
                  {{ quote.status }}
                </span>
              </td>
              <td class="py-3 px-3 text-right whitespace-nowrap">
                <Button
                  size="icon"
                  variant="ghost"
                  class="size-7 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove inquiry"
                  @click="handleDelete(quote.id)"
                >
                  <IconTrash class="size-3.5" />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </CardContent>

    <!-- Modal Form (Fitur 2.2.a: Title & Description Input) -->
    <AppModal
      v-model:open="isModalOpen"
      title="Create Pending Yard Quote Request"
      description="Register a new RFQ (Request for Quotation) awaiting response from the dockyard."
    >
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="yq-title">Title (Job Scope) <span class="text-destructive">*</span></Label>
          <Input
            id="yq-title"
            v-model="newQuote.title"
            placeholder="e.g. Drydocking Package & Berthage Fee - Q4"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="yq-desc">Description <span class="text-destructive">*</span></Label>
          <textarea
            id="yq-desc"
            v-model="newQuote.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Detailed specifications, item requirements, drawings reference..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="yq-yard">Shipyard (Yard)</Label>
            <Input
              id="yq-yard"
              v-model="newQuote.yardName"
              placeholder="e.g. Keppel Shipyard Singapore"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="yq-vessel">Vessel Name</Label>
            <Input
              id="yq-vessel"
              v-model="newQuote.vesselName"
              placeholder="e.g. MV Ocean Pioneer"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="yq-date">Target Response Date</Label>
            <Input
              id="yq-date"
              v-model="newQuote.targetResponseDate"
              type="date"
            />
          </div>
          <div class="space-y-1.5">
            <Label for="yq-priority">Priority</Label>
            <select
              id="yq-priority"
              v-model="newQuote.priority"
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
        <Button @click="handleCreate">Submit RFQ Request</Button>
      </template>
    </AppModal>
  </Card>
</template>
