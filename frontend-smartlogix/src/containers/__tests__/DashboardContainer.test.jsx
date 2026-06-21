import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import DashboardContainer from '../DashboardContainer'

vi.mock('../../facade/BffFacade', () => ({
  bffFacade: {
    getDashboardData: vi.fn(),
  },
}))

vi.mock('../../components/DashboardView', () => ({
  default: ({ loading, error, data }) => {
    if (loading) return <div data-testid="loading">Loading...</div>
    if (error) return <div data-testid="error">{error}</div>
    return (
      <div data-testid="dashboard-data">
        <span>{data?.kpis?.length ?? 0} kpis</span>
        <span>{data?.recentOrders?.length ?? 0} orders</span>
      </div>
    )
  },
}))

import { bffFacade } from '../../facade/BffFacade'

describe('DashboardContainer', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('shows loading state initially', () => {
    bffFacade.getDashboardData.mockReturnValue(new Promise(() => {}))
    render(<DashboardContainer />)
    expect(screen.getByTestId('loading')).toBeInTheDocument()
  })

  it('renders data after successful fetch', async () => {
    bffFacade.getDashboardData.mockResolvedValue({
      kpis: [{ id: 1, title: 'Pedidos', value: 10 }],
      recentOrders: [{ id: 1 }],
      stockAlerts: [],
      activityFeed: [],
    })

    render(<DashboardContainer />)

    await waitFor(() => {
      expect(screen.getByTestId('dashboard-data')).toBeInTheDocument()
    })

    expect(screen.getByText('1 kpis')).toBeInTheDocument()
    expect(screen.getByText('1 orders')).toBeInTheDocument()
  })

  it('renders error state on fetch failure', async () => {
    bffFacade.getDashboardData.mockRejectedValue(new Error('Network error'))

    render(<DashboardContainer />)

    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument()
    })

    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument()
  })
})
