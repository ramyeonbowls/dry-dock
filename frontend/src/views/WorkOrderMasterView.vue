<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IconPlus, IconLoader2, IconCalendar, IconShip, IconUser } from '@tabler/icons-vue'
import AppModal from '@/components/AppModal.vue'
import { fetchApi } from '@/lib/api'

interface WorkOrder {
  id: string
  orderNumber: string
  title: string
  description: string
  vesselName: string
  assignedTo: string
  priority: 'Urgent' | 'High' | 'Medium' | 'Low'
  status: 'Draft' | 'Pending' | 'In Progress' | 'Closed'
  dueDate: string
}

const orders = ref<WorkOrder[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const newOrder = ref({
  title: '',
  description: '',
  vesselName: 'MV Ocean Pioneer',
  assignedTo: 'Mechanical Dock Team',
  priority: 'High' as 'Urgent' | 'High' | 'Medium' | 'Low',
  dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
})

async function loadData() {
  loading.value = true
  try {
    orders.value = await fetchApi<WorkOrder[]>('/work-orders')
  } catch (err) {
    console.error('Failed to load work orders', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newOrder.value = {
    title: '',
    description: '',
    vesselName: 'MV Ocean Pioneer',
    assignedTo: 'Yard Electrical Crew',
    priority: 'High',
    dueDate: new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newOrder.value.title.trim()) {
    alert('Please enter order title')
    return
  }

  try {
    const created = await fetchApi<WorkOrder>('/work-orders', {
      method: 'POST',
      body: JSON.stringify(newOrder.value)
    })
    orders.value.unshift(created)
    isModalOpen.value = false
  } catch {
    orders.value.unshift({
      id: `wo-${Date.now()}`,
      orderNumber: `WO-2026-${Math.floor(100 + Math.random() * 900)}`,
      status: 'Pending',
      ...newOrder.value
    })
    isModalOpen.value = false
  }
}

function getPriorityClass(p: string) {
  if (p === 'Urgent') return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20'
  if (p === 'High') return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20'
  return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20'
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
          <span>Work Order Master</span>
          <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
        </h1>
        <p class="text-sm text-muted-foreground">
          Master registry of shipyard repair orders, job tickets, and team assignments.
        </p>
      </div>
      <Button class="gap-1.5" @click="openAddModal">
        <IconPlus class="size-4" />
        <span>Create Work Order</span>
      </Button>
    </div>

    <Card>
      <CardContent class="p-0">
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm border-collapse">
            <thead>
              <tr class="border-b text-xs text-muted-foreground bg-muted/40">
                <th class="py-3 px-4 font-medium">WO Number</th>
                <th class="py-3 px-4 font-medium">Title & Scope</th>
                <th class="py-3 px-4 font-medium">Vessel</th>
                <th class="py-3 px-4 font-medium">Assignee</th>
                <th class="py-3 px-4 font-medium">Priority</th>
                <th class="py-3 px-4 font-medium">Status</th>
                <th class="py-3 px-4 font-medium">Due Date</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-border/60">
              <tr v-for="order in orders" :key="order.id" class="hover:bg-muted/40 transition-colors">
                <td class="py-3 px-4 font-mono text-xs font-semibold text-primary">
                  {{ order.orderNumber }}
                </td>
                <td class="py-3 px-4 max-w-[320px]">
                  <div class="font-medium text-foreground text-xs">{{ order.title }}</div>
                  <div class="text-[11px] text-muted-foreground line-clamp-1 mt-0.5">{{ order.description }}</div>
                </td>
                <td class="py-3 px-4 text-xs">
                  <span class="flex items-center gap-1.5 font-medium text-foreground">
                    <IconShip class="size-3.5 text-muted-foreground" />
                    {{ order.vesselName }}
                  </span>
                </td>
                <td class="py-3 px-4 text-xs">
                  <span class="flex items-center gap-1.5 text-muted-foreground">
                    <IconUser class="size-3.5" />
                    {{ order.assignedTo }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <span class="text-[10px] font-semibold px-2 py-0.5 rounded border inline-block" :class="getPriorityClass(order.priority)">
                    {{ order.priority }}
                  </span>
                </td>
                <td class="py-3 px-4">
                  <Badge variant="outline" class="text-xs">
                    {{ order.status }}
                  </Badge>
                </td>
                <td class="py-3 px-4 text-xs text-muted-foreground">
                  <span class="flex items-center gap-1">
                    <IconCalendar class="size-3.5" />
                    {{ order.dueDate }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>

    <!-- Modal Form -->
    <AppModal
      v-model:open="isModalOpen"
      title="Create New Work Order"
      description="Issue an operational drydock work order to shipyard technicians."
    >
      <div class="space-y-4">
        <div class="space-y-1.5">
          <Label for="wo-title">Work Order Title <span class="text-destructive">*</span></Label>
          <Input id="wo-title" v-model="newOrder.title" placeholder="e.g. Sea Chest Grating Removal & Strainer Clean" />
        </div>

        <div class="space-y-1.5">
          <Label for="wo-desc">Description</Label>
          <textarea
            id="wo-desc"
            v-model="newOrder.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Detailed procedure and testing criteria..."
          />
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="wo-vessel">Vessel</Label>
            <Input id="wo-vessel" v-model="newOrder.vesselName" />
          </div>
          <div class="space-y-1.5">
            <Label for="wo-assign">Assignee</Label>
            <Input id="wo-assign" v-model="newOrder.assignedTo" />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="wo-date">Due Date</Label>
            <Input id="wo-date" v-model="newOrder.dueDate" type="date" />
          </div>
          <div class="space-y-1.5">
            <Label for="wo-pri">Priority</Label>
            <select
              id="wo-pri"
              v-model="newOrder.priority"
              class="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="Urgent">Urgent</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreate">Issue Order</Button>
      </template>
    </AppModal>
  </div>
</template>
