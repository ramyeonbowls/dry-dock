import express from 'express'
import cors from 'cors'
import { kanbanRouter } from './routes/kanban.js'
import { yardQuotesRouter } from './routes/yardQuotes.js'
import { jobsRouter } from './routes/jobs.js'
import { dryDocksRouter } from './routes/dryDocks.js'
import { costsRouter } from './routes/costs.js'
import { navPagesRouter } from './routes/navPages.js'

const app = express()
const PORT = process.env.PORT || 3000

// Middlewares
app.use(cors())
app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() })
})

// API Routes
app.use('/api/kanban-quotes', kanbanRouter)
app.use('/api/yard-quotes', yardQuotesRouter)
app.use('/api/jobs-awaiting-dock', jobsRouter)
app.use('/api/dry-docks', dryDocksRouter)
app.use('/api/costs', costsRouter)
app.use('/api', navPagesRouter)

app.listen(PORT, () => {
  console.log(`[DryDock API] Server running on http://localhost:${PORT}`)
})

export default app
