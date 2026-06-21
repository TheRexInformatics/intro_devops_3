import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Sidebar from '../Sidebar'

describe('Sidebar', () => {
  it('renders all navigation items for admin', () => {
    render(<Sidebar activeSection="Dashboard" userRole="ROLE_ADMIN" />)
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
    expect(screen.getByText('Inventario')).toBeInTheDocument()
    expect(screen.getByText('Pedidos')).toBeInTheDocument()
    expect(screen.getByText('Envíos')).toBeInTheDocument()
  })

  it('renders limited nav items for client', () => {
    render(<Sidebar activeSection="Dashboard" userRole="ROLE_CLIENTE" />)
    expect(screen.getByText('Tienda')).toBeInTheDocument()
    expect(screen.getByText('Mis Pedidos')).toBeInTheDocument()
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    expect(screen.queryByText('Inventario')).not.toBeInTheDocument()
    expect(screen.queryByText('Envios')).not.toBeInTheDocument()
  })

  it('highlights the active section', () => {
    render(<Sidebar activeSection="Pedidos" userRole="ROLE_ADMIN" />)
    const pedidosBtn = screen.getByText('Pedidos').closest('button')
    expect(pedidosBtn).toHaveClass('bg-indigo-500/20')
  })

  it('does not highlight inactive sections', () => {
    render(<Sidebar activeSection="Dashboard" userRole="ROLE_ADMIN" />)
    const pedidosBtn = screen.getByText('Pedidos').closest('button')
    expect(pedidosBtn).not.toHaveClass('bg-indigo-500/20')
  })

  it('renders SmartLogix branding', () => {
    render(<Sidebar activeSection="Dashboard" userRole="ROLE_ADMIN" />)
    expect(screen.getByText('SmartLogix')).toBeInTheDocument()
  })
})
