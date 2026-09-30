<script setup lang="ts">
import type { Component } from "vue"
import { useRoute, RouterLink } from 'vue-router'

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'

interface NavItem {
  title: string
  url: string
  icon?: Component
}

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()
</script>

<template>
  <SidebarGroup>
    <SidebarGroupLabel class="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/80 px-2 mb-1">
      Navigation
    </SidebarGroupLabel>
    <SidebarGroupContent>
      <SidebarMenu>
        <SidebarMenuItem v-for="item in items" :key="item.title">
          <SidebarMenuButton
            as-child
            :is-active="route.path === item.url"
            :tooltip="item.title"
            class="transition-colors font-medium"
          >
            <RouterLink :to="item.url" class="flex items-center gap-2.5">
              <component :is="item.icon" v-if="item.icon" class="size-4 shrink-0" />
              <span>{{ item.title }}</span>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroupContent>
  </SidebarGroup>
</template>
