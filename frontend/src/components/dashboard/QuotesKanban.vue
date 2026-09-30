<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  IconPlus,
  IconTrash,
  IconShip,
  IconLoader2
} from '@tabler/icons-vue'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import AppModal from '@/components/AppModal.vue'
import { fetchApi } from '@/lib/api'

interface KanbanColumn {
  id: string
  name: string
  vesselOrYard: string
}

interface KanbanQuote {
  id: string
  columnId: string
  title: string
  description: string
  vesselName: string
  vendorName: string
  estimatedCost: number
  currency: string
  priority: 'High' | 'Medium' | 'Low'
  submittedDate: string
}

const columns = ref<KanbanColumn[]>([
  { id: 'col-keppel', name: 'Keppel Shipyard', vesselOrYard: 'Yard / Jurong' },
  { id: 'col-sembcorp', name: 'Sembcorp Marine', vesselOrYard: 'Yard / Tuas' },
  { id: 'col-asl', name: 'ASL Shipyard Batam', vesselOrYard: 'Yard / Batam' },
  { id: 'col-paxocean', name: 'PaxOcean Graha', vesselOrYard: 'Yard / Karimun' }
])

const quotes = ref<KanbanQuote[]>([])
const loading = ref(false)

// Modal state
const isModalOpen = ref(false)
const selectedColumnId = ref('')
const newQuote = ref({
  title: '',
  description: '',
  vesselName: 'MV Ocean Pioneer',
  estimatedCost: 25000,
  priority: 'High' as 'High' | 'Medium' | 'Low'
})

async function loadData() {
  loading.value = true
  try {
    const data = await fetchApi<{ columns: KanbanColumn[]; quotes: KanbanQuote[] }>('/kanban-quotes')
    if (data.columns && data.columns.length) columns.value = data.columns
    quotes.value = data.quotes || []
  } catch (err) {
    console.error('Failed to load kanban quotes', err)
  } finally {
    loading.value = false
  }
}

function openAddModal(columnId: string) {
  selectedColumnId.value = columnId
  newQuote.value = {
    title: '',
    description: '',
    vesselName: 'MV Ocean Pioneer',
    estimatedCost: 35000,
    priority: 'Medium'
  }
  isModalOpen.value = true
}

async function handleCreateQuote() {
  if (!newQuote.value.title.trim() || !newQuote.value.description.trim()) {
    alert('Please enter both Title and Description.')
    return
  }

  try {
    const created = await fetchApi<KanbanQuote>('/kanban-quotes', {
      method: 'POST',
      body: JSON.stringify({
        title: newQuote.value.title,
        description: newQuote.value.description,
        columnId: selectedColumnId.value,
        vesselName: newQuote.value.vesselName,
        estimatedCost: newQuote.value.estimatedCost,
        priority: newQuote.value.priority
      })
    })

    quotes.value.push(created)
    isModalOpen.value = false
  } catch (err) {
    console.error('Failed to create quote', err)
    // Local fallback
    const localQuote: KanbanQuote = {
      id: `local-${Date.now()}`,
      columnId: selectedColumnId.value,
      title: newQuote.value.title,
      description: newQuote.value.description,
      vesselName: newQuote.value.vesselName,
      vendorName: columns.value.find(c => c.id === selectedColumnId.value)?.name || 'Yard Vendor',
      estimatedCost: newQuote.value.estimatedCost,
      currency: 'USD',
      priority: newQuote.value.priority,
      submittedDate: new Date().toISOString().split('T')[0]
    }
    quotes.value.push(localQuote)
    isModalOpen.value = false
  }
}

async function handleDeleteQuote(id: string) {
  try {
    await fetchApi(`/kanban-quotes/${id}`, { method: 'DELETE' })
    quotes.value = quotes.value.filter(q => q.id !== id)
  } catch {
    quotes.value = quotes.value.filter(q => q.id !== id)
  }
}

async function handleMoveColumn(quote: KanbanQuote, targetColId: string) {
  try {
    const updated = await fetchApi<KanbanQuote>(`/kanban-quotes/${quote.id}`, {
      method: 'PATCH',
      body: JSON.stringify({ columnId: targetColId })
    })
    const idx = quotes.value.findIndex(q => q.id === quote.id)
    if (idx !== -1) quotes.value[idx] = updated
  } catch {
    quote.columnId = targetColId
  }
}

function getColumnQuotes(columnId: string) {
  return quotes.value.filter(q => q.columnId === columnId)
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
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <span>Kanban Quotes Pending Approval</span>
          <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
        </h2>
        <p class="text-sm text-muted-foreground">
          Review and approve shipyard quotation proposals categorized by shipyard vendor.
        </p>
      </div>
    </div>

    <!-- Kanban Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
      <div
        v-for="col in columns"
        :key="col.id"
        class="bg-muted/40 border rounded-xl p-3 flex flex-col min-h-[350px]"
      >
        <!-- Column Header -->
        <div class="flex items-center justify-between pb-3 border-b mb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-sm text-foreground">{{ col.name }}</h3>
              <Badge variant="secondary" class="text-xs px-1.5 py-0">
                {{ getColumnQuotes(col.id).length }}
              </Badge>
            </div>
            <p class="text-[11px] text-muted-foreground">{{ col.vesselOrYard }}</p>
          </div>
          <!-- Fitur 2.1.a: Tombol tambah (+) pada setiap kolom -->
          <Button
            size="icon"
            variant="ghost"
            class="size-7 rounded-md hover:bg-background hover:text-primary transition-colors"
            title="Add Quote to this column"
            @click="openAddModal(col.id)"
          >
            <IconPlus class="size-4" />
          </Button>
        </div>

        <!-- Quotes Cards -->
        <div class="flex-1 space-y-3">
          <div
            v-if="getColumnQuotes(col.id).length === 0"
            class="h-32 flex flex-col items-center justify-center border border-dashed rounded-lg text-xs text-muted-foreground"
          >
            <span>No pending quotes</span>
            <Button
              variant="link"
              size="sm"
              class="text-xs text-primary"
              @click="openAddModal(col.id)"
            >
              + Add quote item
            </Button>
          </div>

          <Card
            v-for="quote in getColumnQuotes(col.id)"
            :key="quote.id"
            class="p-3 shadow-xs hover:shadow-md transition-shadow group relative bg-card border-border/80"
          >
            <div class="flex items-start justify-between gap-2 mb-1.5">
              <span
                class="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded border"
                :class="getPriorityBadgeClass(quote.priority)"
              >
                {{ quote.priority }} Priority
              </span>
              <button
                class="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity p-0.5"
                title="Delete Quote"
                @click="handleDeleteQuote(quote.id)"
              >
                <IconTrash class="size-3.5" />
              </button>
            </div>

            <h4 class="font-semibold text-sm leading-snug text-foreground mb-1">
              {{ quote.title }}
            </h4>
            <p class="text-xs text-muted-foreground line-clamp-3 mb-2.5">
              {{ quote.description }}
            </p>

            <div class="text-[11px] flex flex-col gap-1 text-muted-foreground border-t pt-2 mt-2">
              <div class="flex items-center justify-between">
                <span class="flex items-center gap-1">
                  <IconShip class="size-3 text-muted-foreground" />
                  <span class="font-medium text-foreground">{{ quote.vesselName }}</span>
                </span>
                <span class="font-semibold text-emerald-600 dark:text-emerald-400">
                  ${{ quote.estimatedCost.toLocaleString() }}
                </span>
              </div>
              <div class="flex items-center justify-between text-[10px] text-muted-foreground">
                <span>Submitted: {{ quote.submittedDate }}</span>
                <!-- Quick Move dropdown/selector -->
                <div class="flex items-center gap-1">
                  <span class="text-[9px]">Move:</span>
                  <select
                    class="bg-transparent text-[10px] border rounded px-1 py-0.5 text-foreground cursor-pointer focus:outline-hidden"
                    :value="quote.columnId"
                    @change="(e) => handleMoveColumn(quote, (e.target as HTMLSelectElement).value)"
                  >
                    <option v-for="c in columns" :key="c.id" :value="c.id">
                      {{ c.name.split(' ')[0] }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>

    <!-- Modal Form (Fitur 2.1.a: Title & Description Input) -->
    <AppModal
      v-model:open="isModalOpen"
      title="Add New Quote Proposal"
      description="Enter title, description and specifications for this pending yard approval item."
    >
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="quote-title">Title <span class="text-destructive">*</span></Label>
          <Input
            id="quote-title"
            v-model="newQuote.title"
            placeholder="e.g. Main Engine Cylinder Liner Reboring"
          />
        </div>

        <div class="space-y-1.5">
          <Label for="quote-desc">Description <span class="text-destructive">*</span></Label>
          <textarea
            id="quote-desc"
            v-model="newQuote.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Provide technical scope, parts to replace, standard requirements..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="quote-vessel">Vessel Name</Label>
            <Input
              id="quote-vessel"
              v-model="newQuote.vesselName"
              placeholder="e.g. MV Ocean Pioneer"
            />
          </div>

          <div class="space-y-1.5">
            <Label for="quote-cost">Estimated Cost (USD)</Label>
            <Input
              id="quote-cost"
              v-model.number="newQuote.estimatedCost"
              type="number"
              min="0"
            />
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="quote-priority">Priority</Label>
          <select
            id="quote-priority"
            v-model="newQuote.priority"
            class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreateQuote">Save Quote</Button>
      </template>
    </AppModal>
  </div>
</template>
