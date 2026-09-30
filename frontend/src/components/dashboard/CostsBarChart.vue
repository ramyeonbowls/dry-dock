<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { IconLoader2, IconTrendingDown } from '@tabler/icons-vue'
import { fetchApi } from '@/lib/api'

interface CostMetric {
  name: string
  budget: number
  estimates: number
  costs: number
}

interface CostSummaryResponse {
  totalBudget: number
  totalEstimates: number
  totalCosts: number
  currency: string
  metricsSummary: { name: string; amount: number; color: string }[]
  breakdown: CostMetric[]
}

const loading = ref(false)
const totalBudget = ref(1450000)
const totalEstimates = ref(1385000)
const totalCosts = ref(1120000)
const currency = ref('USD')
const breakdown = ref<CostMetric[]>([
  { name: 'Hull & Structure', budget: 420000, estimates: 410000, costs: 360000 },
  { name: 'Propulsion & Shafting', budget: 350000, estimates: 330000, costs: 285000 },
  { name: 'Machinery & Piping', budget: 280000, estimates: 275000, costs: 215000 },
  { name: 'Electrical & Automation', budget: 180000, estimates: 170000, costs: 135000 },
  { name: 'Dockage & Services', budget: 220000, estimates: 200000, costs: 125000 }
])

const maxAmount = computed(() => {
  const allValues = [
    totalBudget.value,
    ...breakdown.value.flatMap(b => [b.budget, b.estimates, b.costs])
  ]
  return Math.max(...allValues, 1)
})

async function loadData() {
  loading.value = true
  try {
    const res = await fetchApi<CostSummaryResponse>('/costs')
    totalBudget.value = res.totalBudget
    totalEstimates.value = res.totalEstimates
    totalCosts.value = res.totalCosts
    currency.value = res.currency || 'USD'
    if (res.breakdown && res.breakdown.length) breakdown.value = res.breakdown
  } catch (err) {
    console.error('Failed to load costs data', err)
  } finally {
    loading.value = false
  }
}

function formatCurrency(val: number) {
  return `$${(val / 1000).toFixed(0)}k`
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
            <span>Costs Analysis</span>
            <span v-if="loading" class="animate-spin text-muted-foreground"><IconLoader2 class="size-4" /></span>
          </CardTitle>
          <CardDescription class="text-xs">
            Comparison between Allocated Budget, Yard Estimates, and Actual Realized Costs.
          </CardDescription>
        </div>
      </div>
    </CardHeader>

    <CardContent class="pt-2">
      <!-- 3 Key Metric Cards (Kategori Metrik Biaya: Total Budget, Total Estimates, Total Costs) -->
      <div class="grid grid-cols-3 gap-2.5 mb-4">
        <!-- 1. Total Budget -->
        <div class="border rounded-lg p-2.5 bg-card/60 flex flex-col">
          <div class="flex items-center gap-1.5 text-muted-foreground mb-1">
            <span class="size-2 rounded-full bg-[#6366f1]" />
            <span class="text-[11px] font-medium uppercase">Total Budget</span>
          </div>
          <div class="text-base font-bold text-foreground">
            ${{ totalBudget.toLocaleString() }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">
            Allocated baseline
          </div>
        </div>

        <!-- 2. Total Estimates -->
        <div class="border rounded-lg p-2.5 bg-card/60 flex flex-col">
          <div class="flex items-center gap-1.5 text-muted-foreground mb-1">
            <span class="size-2 rounded-full bg-[#0ea5e9]" />
            <span class="text-[11px] font-medium uppercase">Total Estimates</span>
          </div>
          <div class="text-base font-bold text-sky-600 dark:text-sky-400">
            ${{ totalEstimates.toLocaleString() }}
          </div>
          <div class="text-[10px] text-muted-foreground mt-0.5">
            {{ ((totalEstimates / totalBudget) * 100).toFixed(1) }}% of budget
          </div>
        </div>

        <!-- 3. Total Costs -->
        <div class="border rounded-lg p-2.5 bg-card/60 flex flex-col">
          <div class="flex items-center gap-1.5 text-muted-foreground mb-1">
            <span class="size-2 rounded-full bg-[#f43f5e]" />
            <span class="text-[11px] font-medium uppercase">Total Costs</span>
          </div>
          <div class="text-base font-bold text-rose-600 dark:text-rose-400">
            ${{ totalCosts.toLocaleString() }}
          </div>
          <div class="text-[10px] text-emerald-600 dark:text-emerald-400 mt-0.5 font-medium flex items-center gap-0.5">
            <IconTrendingDown class="size-3" />
            Under budget by ${{ (totalBudget - totalCosts).toLocaleString() }}
          </div>
        </div>
      </div>

      <!-- Bar Chart Comparison by Category -->
      <div class="space-y-3 pt-1">
        <div class="flex items-center justify-between text-[11px] text-muted-foreground">
          <span class="font-medium uppercase tracking-wider">Category Cost Breakdown</span>
          <div class="flex items-center gap-3">
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-[#6366f1]" />
              <span>Budget</span>
            </span>
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-[#0ea5e9]" />
              <span>Estimates</span>
            </span>
            <span class="flex items-center gap-1">
              <span class="size-2 rounded-full bg-[#f43f5e]" />
              <span>Actual Costs</span>
            </span>
          </div>
        </div>

        <div class="space-y-3">
          <div
            v-for="item in breakdown"
            :key="item.name"
            class="space-y-1"
          >
            <div class="flex items-center justify-between text-xs">
              <span class="font-medium text-foreground">{{ item.name }}</span>
              <span class="text-muted-foreground text-[11px]">
                Costs: <strong class="text-foreground">${{ item.costs.toLocaleString() }}</strong> / ${{ item.budget.toLocaleString() }}
              </span>
            </div>

            <!-- Grouped relative progress bars -->
            <div class="space-y-1 bg-muted/40 p-1.5 rounded-lg border">
              <!-- Budget Bar -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-muted-foreground w-12 shrink-0">Budget</span>
                <div class="flex-1 bg-muted/80 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-[#6366f1] rounded-full transition-all duration-500"
                    :style="{ width: `${(item.budget / maxAmount) * 100}%` }"
                  />
                </div>
                <span class="text-[10px] text-muted-foreground w-10 text-right">{{ formatCurrency(item.budget) }}</span>
              </div>

              <!-- Estimates Bar -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-muted-foreground w-12 shrink-0">Estimate</span>
                <div class="flex-1 bg-muted/80 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-[#0ea5e9] rounded-full transition-all duration-500"
                    :style="{ width: `${(item.estimates / maxAmount) * 100}%` }"
                  />
                </div>
                <span class="text-[10px] text-muted-foreground w-10 text-right">{{ formatCurrency(item.estimates) }}</span>
              </div>

              <!-- Costs Bar -->
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-muted-foreground w-12 shrink-0">Cost</span>
                <div class="flex-1 bg-muted/80 rounded-full h-2 overflow-hidden">
                  <div
                    class="h-full bg-[#f43f5e] rounded-full transition-all duration-500"
                    :style="{ width: `${(item.costs / maxAmount) * 100}%` }"
                  />
                </div>
                <span class="text-[10px] text-muted-foreground w-10 text-right">{{ formatCurrency(item.costs) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</template>
