import { Router, Request, Response } from 'express'
import { costSummaryData } from '../mockData.js'

export const costsRouter = Router()

// GET costs summary and breakdown for Bar Chart
costsRouter.get('/', (req: Request, res: Response) => {
  // Recalculate totals from breakdown to ensure consistency
  const totalBudget = costSummaryData.breakdown.reduce((acc, curr) => acc + curr.budget, 0)
  const totalEstimates = costSummaryData.breakdown.reduce((acc, curr) => acc + curr.estimates, 0)
  const totalCosts = costSummaryData.breakdown.reduce((acc, curr) => acc + curr.costs, 0)

  res.json({
    totalBudget,
    totalEstimates,
    totalCosts,
    currency: costSummaryData.currency,
    metricsSummary: [
      { name: 'Total Budget', amount: totalBudget, color: '#6366f1' },
      { name: 'Total Estimates', amount: totalEstimates, color: '#0ea5e9' },
      { name: 'Total Costs', amount: totalCosts, color: '#f43f5e' }
    ],
    breakdown: costSummaryData.breakdown
  })
})
