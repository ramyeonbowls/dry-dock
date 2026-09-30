<script setup lang="ts">
import QuotesKanban from '@/components/dashboard/QuotesKanban.vue'
import PendingYardQuotes from '@/components/dashboard/PendingYardQuotes.vue'
import JobsAwaitingDock from '@/components/dashboard/JobsAwaitingDock.vue'
import ActiveDryDocksChart from '@/components/dashboard/ActiveDryDocksChart.vue'
import CostsBarChart from '@/components/dashboard/CostsBarChart.vue'
</script>

<template>
  <div class="flex-1 space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Dry Dock Dashboard</h1>
        <p class="text-sm text-muted-foreground">
          Operational, financial, and docking workflow summary for fleet maintenance.
        </p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div class="lg:col-span-12">
        <ActiveDryDocksChart />
      </div>
      <div class="lg:col-span-12">
        <CostsBarChart />
      </div>
    </div>

    <div class="border rounded-2xl p-5 bg-card/40 shadow-xs">
      <QuotesKanban />
    </div>

    <div class="grid grid-cols-1 xl:grid-cols-1 gap-6 items-start">
      <PendingYardQuotes />
      <JobsAwaitingDock />
    </div>
  </div>
</template>
