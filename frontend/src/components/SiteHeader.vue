<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { Separator } from '@/components/ui/separator'
import { SidebarTrigger } from '@/components/ui/sidebar'
import { Badge } from '@/components/ui/badge'
import { IconAnchor, IconBell } from '@tabler/icons-vue'
import { Button } from '@/components/ui/button'

const route = useRoute()
const pageTitle = computed(() => {
  return (route?.meta?.title as string) || 'Dashboard'
})
</script>

<template>
  <header class="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur-xs transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-30">
    <div class="flex w-full items-center gap-2 px-4 lg:px-6">
      <SidebarTrigger class="-ml-1" />
      <Separator
        orientation="vertical"
        class="mx-1 h-4"
      />
      <div class="flex items-center gap-2">
        <IconAnchor class="size-4 text-primary" />
        <h1 class="text-sm font-semibold tracking-tight text-foreground">
          {{ pageTitle }}
        </h1>
      </div>

      <div class="ml-auto flex items-center gap-3">
        <Button variant="ghost" size="icon" class="size-8 text-muted-foreground">
          <IconBell class="size-4" />
          <span class="sr-only">Notifications</span>
        </Button>
      </div>
    </div>
  </header>
</template>
