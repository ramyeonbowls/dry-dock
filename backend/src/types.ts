export interface KanbanQuote {
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

export interface KanbanColumn {
  id: string
  name: string
  vesselOrYard: string
}

export interface YardQuote {
  id: string
  title: string
  description: string
  yardName: string
  vesselName: string
  requestDate: string
  targetResponseDate: string
  status: 'Sent to Yard' | 'Awaiting Response' | 'Under Review'
  priority: 'High' | 'Medium' | 'Low'
}

export interface JobAwaitingDock {
  id: string
  title: string
  description: string
  vesselName: string
  category: 'Hull & Structure' | 'Propulsion & Shaft' | 'Piping & Valves' | 'Electrical & Automation' | 'Safety & Navigation'
  estimatedDurationDays: number
  priority: 'High' | 'Medium' | 'Low'
  status: 'Approved' | 'Awaiting Slot' | 'Scheduled'
  approvedDate: string
}

export type DryDockStatus = 'Open' | 'In Progress' | 'On Hold' | 'Complete'

export interface DryDockProject {
  id: string
  dockName: string
  vesselName: string
  yardLocation: string
  status: DryDockStatus
  startDate: string
  estimatedCompletionDate: string
  completionPercentage: number
  manager: string
}

export interface CostMetric {
  name: string
  budget: number
  estimates: number
  costs: number
}

export interface CostSummary {
  totalBudget: number
  totalEstimates: number
  totalCosts: number
  currency: string
  breakdown: CostMetric[]
}

export interface SpecificationGroup {
  id: string
  code: string
  name: string
  description: string
  itemCount: number
  category: string
  updatedAt: string
}

export interface WorkOrder {
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

export interface ChecklistItem {
  id: string
  title: string
  description: string
  category: 'Pre-Docking' | 'In-Dock' | 'Flooding & Undocking' | 'Sea Trial'
  totalChecks: number
  completedChecks: number
  status: 'Pending' | 'In Progress' | 'Completed'
  targetDate: string
}
