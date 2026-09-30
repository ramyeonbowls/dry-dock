<script setup lang="ts">
import QuotesKanban from '@/components/dashboard/QuotesKanban.vue'
import PendingYardQuotes from '@/components/dashboard/PendingYardQuotes.vue'
import JobsAwaitingDock from '@/components/dashboard/JobsAwaitingDock.vue'
import ActiveDryDocksChart from '@/components/dashboard/ActiveDryDocksChart.vue'
import CostsBarChart from '@/components/dashboard/CostsBarChart.vue'
</script>

<template>
  <div class="flex-1 space-y-6 p-4 md:p-6 max-w-[1600px] mx-auto w-full">
    <!-- Header Banner -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b pb-4">
      <div>
        <h1 class="text-2xl font-bold tracking-tight text-foreground">Dry Dock Dashboard</h1>
        <p class="text-sm text-muted-foreground">
          Operational, financial, and docking workflow summary for fleet maintenance.
        </p>
      </div>
      <div class="flex items-center gap-2 text-xs text-muted-foreground">
        <span class="inline-block size-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Live Operational Sync</span>
      </div>
    </div>

    <!-- Section 2.4 & 2.5: Charts Overview (Active Dry Docks Donut Chart & Costs Bar Chart) -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      <div class="lg:col-span-5">
        <ActiveDryDocksChart />
      </div>
      <div class="lg:col-span-7">
        <CostsBarChart />
      </div>
    </div>

    <!-- Section 2.1: Kanban Quotes Pending Approval -->
    <div class="border rounded-2xl p-5 bg-card/40 shadow-xs">
      <QuotesKanban />
    </div>

    <!-- Section 2.2 & 2.3: Pending Yard Quotes & Jobs Awaiting Dock -->
    <div class="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
      <PendingYardQuotes />
      <JobsAwaitingDock />
    </div>
  </div>
</template>
