<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { IconPlus, IconLoader2, IconFolderCheck } from '@tabler/icons-vue'
import AppModal from '@/components/AppModal.vue'
import { fetchApi } from '@/lib/api'

interface SpecGroup {
  id: string
  code: string
  name: string
  description: string
  itemCount: number
  category: string
  updatedAt: string
}

const groups = ref<SpecGroup[]>([])
const loading = ref(false)
const isModalOpen = ref(false)
const newGroup = ref({
  code: '',
  name: '',
  description: '',
  category: 'Hull & Coating',
  itemCount: 5
})

async function loadData() {
  loading.value = true
  try {
    groups.value = await fetchApi<SpecGroup[]>('/specification-groups')
  } catch (err) {
    console.error('Failed to load specification groups', err)
  } finally {
    loading.value = false
  }
}

function openAddModal() {
  newGroup.value = {
    code: `SPEC-${Math.floor(100 + Math.random() * 900)}`,
    name: '',
    description: '',
    category: 'Hull & Coating',
    itemCount: 5
  }
  isModalOpen.value = true
}

async function handleCreate() {
  if (!newGroup.value.name.trim()) {
    alert('Please enter group name')
    return
  }
  try {
    const created = await fetchApi<SpecGroup>('/specification-groups', {
      method: 'POST',
      body: JSON.stringify(newGroup.value)
    })
    groups.value.push(created)
    isModalOpen.value = false
  } catch (err) {
    console.error(err)
    groups.value.push({
      id: `sg-${Date.now()}`,
      ...newGroup.value,
      updatedAt: new Date().toISOString().split('T')[0]
    })
    isModalOpen.value = false
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
          <span>Specification Groups</span>
          <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
        </h1>
        <p class="text-sm text-muted-foreground">
          Standardized work specification libraries for dry docking, repairs, and class surveys.
        </p>
      </div>
      <Button class="gap-1.5" @click="openAddModal">
        <IconPlus class="size-4" />
        <span>Add Specification Group</span>
      </Button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card
        v-for="group in groups"
        :key="group.id"
        class="hover:border-primary/50 transition-colors shadow-xs flex flex-col justify-between"
      >
        <CardHeader class="pb-2">
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-mono font-medium px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {{ group.code }}
            </span>
            <Badge variant="outline" class="text-xs">
              {{ group.category }}
            </Badge>
          </div>
          <CardTitle class="text-base font-semibold text-foreground mt-2">
            {{ group.name }}
          </CardTitle>
          <CardDescription class="text-xs line-clamp-2 mt-1">
            {{ group.description }}
          </CardDescription>
        </CardHeader>

        <CardContent class="pt-0">
          <div class="border-t pt-3 flex items-center justify-between text-xs text-muted-foreground">
            <span class="flex items-center gap-1 font-medium text-foreground">
              <IconFolderCheck class="size-3.5 text-primary" />
              {{ group.itemCount }} Items
            </span>
            <span>Updated: {{ group.updatedAt }}</span>
          </div>
        </CardContent>
      </Card>
    </div>

    <!-- Modal Form -->
    <AppModal
      v-model:open="isModalOpen"
      title="Create Specification Group"
      description="Define a new category of standardized dock repair requirements."
    >
      <div class="space-y-4">
        <div class="grid grid-cols-2 gap-3">
          <div class="space-y-1.5">
            <Label for="sg-code">Spec Code</Label>
            <Input id="sg-code" v-model="newGroup.code" />
          </div>
          <div class="space-y-1.5">
            <Label for="sg-cat">Category</Label>
            <Input id="sg-cat" v-model="newGroup.category" />
          </div>
        </div>

        <div class="space-y-1.5">
          <Label for="sg-name">Group Name <span class="text-destructive">*</span></Label>
          <Input id="sg-name" v-model="newGroup.name" placeholder="e.g. Sea Water Cooling & Bilge Lines Overhaul" />
        </div>

        <div class="space-y-1.5">
          <Label for="sg-desc">Description</Label>
          <textarea
            id="sg-desc"
            v-model="newGroup.description"
            rows="3"
            class="w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            placeholder="Standard technical requirements and test criteria..."
          />
        </div>
      </div>

      <template #footer>
        <Button variant="outline" @click="isModalOpen = false">Cancel</Button>
        <Button @click="handleCreate">Create Group</Button>
      </template>
    </AppModal>
  </div>
</template>
