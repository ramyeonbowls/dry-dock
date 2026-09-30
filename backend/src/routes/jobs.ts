import { Router, Request, Response } from 'express'
import { jobsAwaitingDock } from '../mockData.js'
import { JobAwaitingDock } from '../types.js'

export const jobsRouter = Router()

// GET all jobs awaiting dock
jobsRouter.get('/', (req: Request, res: Response) => {
  res.json(jobsAwaitingDock)
})

// POST create job awaiting dock
jobsRouter.post('/', (req: Request, res: Response) => {
  const { title, description, vesselName, category, estimatedDurationDays, priority } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' })
  }

  const newJob: JobAwaitingDock = {
    id: `job-${Date.now()}`,
    title: String(title).trim(),
    description: String(description).trim(),
    vesselName: vesselName?.trim() || 'MV Ocean Pioneer',
    category: category || 'Hull & Structure',
    estimatedDurationDays: Number(estimatedDurationDays) || 3,
    priority: priority || 'Medium',
    status: 'Approved',
    approvedDate: new Date().toISOString().split('T')[0]
  }

  jobsAwaitingDock.unshift(newJob)
  res.status(201).json(newJob)
})

// DELETE job
jobsRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = jobsAwaitingDock.findIndex(j => j.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Job not found' })
  }

  const deleted = jobsAwaitingDock.splice(index, 1)[0]
  res.json(deleted)
})
