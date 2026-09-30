import { Router, Request, Response } from 'express'
import { dryDockProjects } from '../mockData.js'
import { DryDockProject, DryDockStatus } from '../types.js'

export const dryDocksRouter = Router()

// GET all dry dock projects
dryDocksRouter.get('/', (req: Request, res: Response) => {
  res.json(dryDockProjects)
})

// GET status statistics for Donut Chart
dryDocksRouter.get('/stats', (req: Request, res: Response) => {
  const stats = {
    Open: 0,
    'In Progress': 0,
    'On Hold': 0,
    Complete: 0
  }

  dryDockProjects.forEach(item => {
    if (stats[item.status] !== undefined) {
      stats[item.status]++
    }
  })

  const total = dryDockProjects.length

  const chartData = [
    { status: 'Open', count: stats['Open'], color: '#38bdf8' },
    { status: 'In Progress', count: stats['In Progress'], color: '#3b82f6' },
    { status: 'On Hold', count: stats['On Hold'], color: '#f59e0b' },
    { status: 'Complete', count: stats['Complete'], color: '#10b981' }
  ]

  res.json({
    total,
    counts: stats,
    chartData,
    projects: dryDockProjects
  })
})

// POST create new dry dock project
dryDocksRouter.post('/', (req: Request, res: Response) => {
  const { dockName, vesselName, yardLocation, status, startDate, estimatedCompletionDate, manager } = req.body

  if (!dockName || !vesselName) {
    return res.status(400).json({ error: 'Dock Name and Vessel Name are required' })
  }

  const validStatus: DryDockStatus = ['Open', 'In Progress', 'On Hold', 'Complete'].includes(status)
    ? status
    : 'Open'

  const newProject: DryDockProject = {
    id: `dd-${Date.now()}`,
    dockName: String(dockName).trim(),
    vesselName: String(vesselName).trim(),
    yardLocation: yardLocation?.trim() || 'Singapore Yard',
    status: validStatus,
    startDate: startDate || new Date().toISOString().split('T')[0],
    estimatedCompletionDate: estimatedCompletionDate || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    completionPercentage: validStatus === 'Complete' ? 100 : validStatus === 'Open' ? 0 : 30,
    manager: manager?.trim() || 'Superintendent'
  }

  dryDockProjects.unshift(newProject)
  res.status(201).json(newProject)
})
