import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import DashboardView from '../DashboardView'

vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>,
}))
vi.mock('../Header', () => ({
  default: () => <div data-testid="header">Header</div>,
}))

describe('DashboardView', () => {
  const mockData = {
    kpis: [
      { id: 1, label: 'Total Pedidos', value: 150, delta: '+5%', trend: 'up', icon: '📦', color: 'blue' },
      { id: 2, label: 'Ingresos', value: '$5000', delta: '+12%', trend: 'up', icon: '💰', color: 'emerald' },
    ],
    recentOrders: [
      { id: 1, codigoProducto: 'P001', cantidad: 5, estado: 'PROCESADO', total: 100 },
    ],
    stockAlerts: [
      { id: 1, producto: 'Producto A', stockActual: 3, stockMinimo: 10 },
    ],
    activityFeed: [
      { id: 1, type: 'order', msg: 'Pedido #1 creado', time: 'hace 5 min' },
    ],
  }

  it('renders loading skeletons when loading is true', () => {
    render(<DashboardView loading={true} error={null} data={null} activeSection="Dashboard" />)
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('renders error message when error is provided', () => {
    render(<DashboardView loading={false} error="Error de conexión" data={null} activeSection="Dashboard" />)
    expect(screen.getByText(/Error de conexión/)).toBeInTheDocument()
  })

  it('renders KPI cards when data is loaded', () => {
    render(<DashboardView loading={false} error={null} data={mockData} activeSection="Dashboard" />)
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders section titles', () => {
    render(<DashboardView loading={false} error={null} data={mockData} activeSection="Dashboard" />)
    expect(screen.getByText('Pedidos Recientes')).toBeInTheDocument()
    expect(screen.getByText(/Alertas de Stock/)).toBeInTheDocument()
    expect(screen.getByText('Actividad Reciente del Sistema')).toBeInTheDocument()
  })

  it('renders stock alerts count badge', () => {
    render(<DashboardView loading={false} error={null} data={mockData} activeSection="Dashboard" />)
    expect(screen.getByText('1')).toBeInTheDocument()
  })
})
