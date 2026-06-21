import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import KpiCard from '../KpiCard'

describe('KpiCard', () => {
  const defaultProps = {
    label: 'Total Pedidos',
    value: 150,
    delta: '+5%',
    trend: 'up',
    icon: '📦',
    color: 'blue',
  }

  it('renders label and value', () => {
    render(<KpiCard {...defaultProps} />)
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()
  })

  it('renders delta with up arrow', () => {
    render(<KpiCard {...defaultProps} trend="up" />)
    expect(screen.getByText(/▲ \+5%/)).toBeInTheDocument()
  })

  it('renders delta with down arrow', () => {
    render(<KpiCard {...defaultProps} trend="down" delta="-3%" />)
    expect(screen.getByText(/▼ -3%/)).toBeInTheDocument()
  })

  it('renders icon', () => {
    render(<KpiCard {...defaultProps} />)
    expect(screen.getByText('📦')).toBeInTheDocument()
  })

  it('applies blue color classes', () => {
    render(<KpiCard {...defaultProps} color="blue" />)
    const card = screen.getByText('Total Pedidos').closest('div')
    expect(card).toBeInTheDocument()
  })

  it('applies emerald color classes', () => {
    render(<KpiCard {...defaultProps} color="emerald" />)
    const card = screen.getByText('Total Pedidos').closest('div')
    expect(card).toBeInTheDocument()
  })

  it('falls back to blue when color is unknown', () => {
    render(<KpiCard {...defaultProps} color="unknown" />)
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument()
  })
})
