import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import SpecificationGroupsView from '@/views/SpecificationGroupsView.vue'
import WorkOrderMasterView from '@/views/WorkOrderMasterView.vue'
import ChecklistsView from '@/views/ChecklistsView.vue'
import DryDocksView from '@/views/DryDocksView.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: DashboardView,
    meta: { title: 'Dashboard' }
  },
  {
    path: '/specification-groups',
    name: 'SpecificationGroups',
    component: SpecificationGroupsView,
    meta: { title: 'Specification Groups' }
  },
  {
    path: '/work-order-master',
    name: 'WorkOrderMaster',
    component: WorkOrderMasterView,
    meta: { title: 'Work Order Master' }
  },
  {
    path: '/checklists',
    name: 'Checklists',
    component: ChecklistsView,
    meta: { title: 'Checklists' }
  },
  {
    path: '/dry-docks',
    name: 'DryDocks',
    component: DryDocksView,
    meta: { title: 'Dry Docks' }
  },
  {
    // Catch-all redirect to Dashboard
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
