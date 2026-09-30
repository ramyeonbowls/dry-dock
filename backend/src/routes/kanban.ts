import { Router, Request, Response } from 'express'
import { kanbanColumns, kanbanQuotes } from '../mockData.js'
import { KanbanQuote } from '../types.js'

export const kanbanRouter = Router()

// GET all columns and quotes
kanbanRouter.get('/', (req: Request, res: Response) => {
  res.json({
    columns: kanbanColumns,
    quotes: kanbanQuotes
  })
})

// POST create quote
kanbanRouter.post('/', (req: Request, res: Response) => {
  const { title, description, columnId, vesselName, vendorName, estimatedCost, priority } = req.body

  if (!title || !description) {
    return res.status(400).json({ error: 'Title and Description are required' })
  }

  const targetColumn = kanbanColumns.find(c => c.id === columnId) || kanbanColumns[0]

  const newQuote: KanbanQuote = {
    id: `quote-${Date.now()}`,
    columnId: targetColumn.id,
    title: String(title).trim(),
    description: String(description).trim(),
    vesselName: vesselName?.trim() || 'MV General Fleet',
    vendorName: vendorName?.trim() || targetColumn.name,
    estimatedCost: Number(estimatedCost) || 0,
    currency: 'USD',
    priority: priority || 'Medium',
    submittedDate: new Date().toISOString().split('T')[0]
  }

  kanbanQuotes.push(newQuote)
  res.status(201).json(newQuote)
})

// PATCH update quote (e.g. move column or edit)
kanbanRouter.patch('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = kanbanQuotes.findIndex(q => q.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Quote not found' })
  }

  const { columnId, title, description, estimatedCost, priority } = req.body
  const current = kanbanQuotes[index]

  if (columnId !== undefined) {
    const validCol = kanbanColumns.find(c => c.id === columnId)
    if (validCol) {
      current.columnId = validCol.id
      current.vendorName = validCol.name
    }
  }

  if (title !== undefined) current.title = title
  if (description !== undefined) current.description = description
  if (estimatedCost !== undefined) current.estimatedCost = Number(estimatedCost)
  if (priority !== undefined) current.priority = priority

  res.json(current)
})

// DELETE quote
kanbanRouter.delete('/:id', (req: Request, res: Response) => {
  const { id } = req.params
  const index = kanbanQuotes.findIndex(q => q.id === id)

  if (index === -1) {
    return res.status(404).json({ error: 'Quote not found' })
  }

  const deleted = kanbanQuotes.splice(index, 1)[0]
  res.json(deleted)
})
