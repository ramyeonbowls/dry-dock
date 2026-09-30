<script setup lang="ts">
import {
  IconAnchor,
  IconChecklist,
  IconClipboardList,
  IconDashboard,
  IconFileSpreadsheet,
  IconSettings,
  IconShip,
  IconLifebuoy,
} from "@tabler/icons-vue"

import NavMain from '@/components/NavMain.vue'
import NavSecondary from '@/components/NavSecondary.vue'
import NavUser from '@/components/NavUser.vue'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { RouterLink } from 'vue-router'

const data = {
  user: {
    name: "Capt. Hendra Wijaya",
    email: "hendra@drydock-portal.com",
    avatar: "/avatars/shadcn.jpg",
  },
  // 5 Menu Utama Navigasi Sidebar sesuai Dokumen Spesifikasi:
  // 1. Dashboard (Halaman Utama)
  // 2. Specification Groups
  // 3. Work Order Master
  // 4. Checklists
  // 5. Dry Docks
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      icon: IconDashboard,
    },
    {
      title: "Specification Groups",
      url: "/specification-groups",
      icon: IconFileSpreadsheet,
    },
    {
      title: "Work Order Master",
      url: "/work-order-master",
      icon: IconClipboardList,
    },
    {
      title: "Checklists",
      url: "/checklists",
      icon: IconChecklist,
    },
    {
      title: "Dry Docks",
      url: "/dry-docks",
      icon: IconAnchor,
    },
  ],
  navSecondary: [
    {
      title: "Dockyard Settings",
      url: "#",
      icon: IconSettings,
    },
    {
      title: "Emergency & Support",
      url: "#",
      icon: IconLifebuoy,
    },
  ],
}
</script>

<template>
  <Sidebar collapsible="offcanvas">
    <SidebarHeader>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            as-child
            size="lg"
            class="data-[slot=sidebar-menu-button]:!p-2"
          >
            <RouterLink to="/" class="flex items-center gap-3">
              <div class="flex aspect-square size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <IconShip class="size-5" />
              </div>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-bold tracking-tight text-foreground">DryDock OS</span>
                <span class="truncate text-[11px] text-muted-foreground">Fleet Maintenance</span>
              </div>
            </RouterLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>

    <SidebarContent>
      <NavMain :items="data.navMain" />
      <NavSecondary :items="data.navSecondary" class="mt-auto" />
    </SidebarContent>

    <SidebarFooter>
      <NavUser :user="data.user" />
    </SidebarFooter>
  </Sidebar>
</template>
