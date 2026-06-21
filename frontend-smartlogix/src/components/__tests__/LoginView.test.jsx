import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginView from '../LoginView'

describe('LoginView', () => {
  const defaultProps = {
    username: '',
    setUsername: vi.fn(),
    password: '',
    setPassword: vi.fn(),
    error: null,
    success: null,
    loading: false,
    onSubmit: vi.fn(),
  }

  it('renders form fields', () => {
    render(<LoginView {...defaultProps} />)
    expect(screen.getByPlaceholderText('tu_usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('renders submit button with default text', () => {
    render(<LoginView {...defaultProps} />)
    expect(screen.getByRole('button', { name: 'Iniciar Sesión' })).toBeInTheDocument()
  })

  it('shows loading text and disables button when loading', () => {
    render(<LoginView {...defaultProps} loading={true} />)
    const btn = screen.getByRole('button', { name: 'Procesando...' })
    expect(btn).toHaveTextContent('Procesando...')
    expect(btn).toBeDisabled()
  })

  it('displays error message when error is provided', () => {
    render(<LoginView {...defaultProps} error="Credenciales inválidas" />)
    expect(screen.getByText('Credenciales inválidas')).toBeInTheDocument()
  })

  it('does not display error when error is null', () => {
    render(<LoginView {...defaultProps} error={null} />)
    expect(screen.queryByText(/Credenciales/)).not.toBeInTheDocument()
  })

  it('calls setUsername when typing in username field', async () => {
    const user = userEvent.setup()
    render(<LoginView {...defaultProps} />)
    await user.type(screen.getByPlaceholderText('tu_usuario'), 'admin')
    expect(defaultProps.setUsername).toHaveBeenCalled()
  })

  it('calls onSubmit when form is submitted', async () => {
    render(<LoginView {...defaultProps} />)
    fireEvent.submit(document.querySelector('form'))
    expect(defaultProps.onSubmit).toHaveBeenCalled()
  })
})
