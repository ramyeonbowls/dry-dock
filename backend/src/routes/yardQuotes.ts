import { Router, Request, Response } from 'express'
import { yardQuotes } from '../mockData.js'
import { YardQuote } from '../types.js'

export const yardQuotesRouter = Router()

// GET all pending yard quotes
yardQuotesRouter.get('/', (req: Request, res: Response) => {
  res.json(yardQuotes)
})

// POST create yard quote
yardQuotesRouter.post('/', (req: Request, res: Response) => {
  const { title, description, yardName, vesselName, targetResponseDate, priority } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' })
  }

  const newYardQuote: YardQuote = {
    id: `yq-${Date.now()}`,
    title: String(title).trim(),
    description: String(description).trim(),
    yardName: yardName?.trim() || 'Keppel Shipyard Singapore',
    vesselName: vesselName?.trim() || 'MV Ocean Pioneer',
    requestDate: new Date().toISOString().split('T')[0],
    targetResponseDate: targetResponseDate || new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Awaiting Response',
    priority: priority || 'Medium'
  }

  yardQuotes.unshift(newYardQuote)
  res.status(201).json(newYardQuote)
})

// DELETE yard quote
yardQuotesRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = yardQuotes.findIndex(q => q.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Yard Quote not found' })
  }

  const deleted = yardQuotes.splice(index, 1)[0]
  res.json(deleted)
})
