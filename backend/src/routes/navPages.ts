import { Router, Request, Response } from 'express'
import { specificationGroups, workOrders, checklists } from '../mockData.js'
import { SpecificationGroup, WorkOrder, ChecklistItem } from '../types.js'

export const navPagesRouter = Router()

// Specification Groups
navPagesRouter.get('/specification-groups', (req: Request, res: Response) => {
  res.json(specificationGroups)
})

navPagesRouter.post('/specification-groups', (req: Request, res: Response) => {
  const { name, description, category, itemCount, code } = req.body
  if (!name) return res.status(400).json({ error: 'Name is required' })

  const newGroup: SpecificationGroup = {
    id: `sg-${Date.now()}`,
    code: code || `SPEC-${Date.now().toString().slice(-4)}`,
    name: String(name).trim(),
    description: String(description || '').trim(),
    category: category || 'General',
    itemCount: Number(itemCount) || 1,
    updatedAt: new Date().toISOString().split('T')[0]
  }
  specificationGroups.push(newGroup)
  res.status(201).json(newGroup)
})

// Work Order Master
navPagesRouter.get('/work-orders', (req: Request, res: Response) => {
  res.json(workOrders)
})

navPagesRouter.post('/work-orders', (req: Request, res: Response) => {
  const { title, description, vesselName, assignedTo, priority, dueDate } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const newOrder: WorkOrder = {
    id: `wo-${Date.now()}`,
    orderNumber: `WO-${new Date().getFullYear()}-${Math.floor(100 + Math.random() * 900)}`,
    title: String(title).trim(),
    description: String(description || '').trim(),
    vesselName: vesselName?.trim() || 'MV General Fleet',
    assignedTo: assignedTo?.trim() || 'Drydock Team',
    priority: priority || 'Medium',
    status: 'Pending',
    dueDate: dueDate || new Date(Date.now() + 5 * 86400000).toISOString().split('T')[0]
  }
  workOrders.unshift(newOrder)
  res.status(201).json(newOrder)
})

// Checklists
navPagesRouter.get('/checklists', (req: Request, res: Response) => {
  res.json(checklists)
})

navPagesRouter.post('/checklists', (req: Request, res: Response) => {
  const { title, description, category, totalChecks } = req.body
  if (!title) return res.status(400).json({ error: 'Title is required' })

  const newChecklist: ChecklistItem = {
    id: `chk-${Date.now()}`,
    title: String(title).trim(),
    description: String(description || '').trim(),
    category: category || 'Pre-Docking',
    totalChecks: Number(totalChecks) || 10,
    completedChecks: 0,
    status: 'Pending',
    targetDate: new Date(Date.now() + 3 * 86400000).toISOString().split('T')[0]
  }
  checklists.unshift(newChecklist)
  res.status(201).json(newChecklist)
})
