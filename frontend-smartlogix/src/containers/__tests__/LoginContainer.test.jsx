import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LoginContainer from '../LoginContainer'

describe('LoginContainer', () => {
  const onLoginSuccess = vi.fn()

  beforeEach(() => {
    vi.restoreAllMocks()
    localStorage.clear()
    onLoginSuccess.mockClear()
  })

  it('renders login form', () => {
    render(<LoginContainer onLoginSuccess={onLoginSuccess} />)
    expect(screen.getByPlaceholderText('tu_usuario')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
  })

  it('shows error on failed login', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 401,
      json: async () => ({ error: 'Unauthorized' }),
    })

    render(<LoginContainer onLoginSuccess={onLoginSuccess} />)

    await user.type(screen.getByPlaceholderText('tu_usuario'), 'admin')
    await user.type(screen.getByPlaceholderText('••••••••'), 'wrong')
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() => {
      expect(screen.getByText(/Unauthorized/)).toBeInTheDocument()
    })

    expect(onLoginSuccess).not.toHaveBeenCalled()
  })

  it('saves token and calls onLoginSuccess on successful login', async () => {
    const user = userEvent.setup()
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ token: 'jwt-token-123' }),
    })

    render(<LoginContainer onLoginSuccess={onLoginSuccess} />)

    await user.type(screen.getByPlaceholderText('tu_usuario'), 'admin')
    await user.type(screen.getByPlaceholderText('••••••••'), 'password')
    await user.click(screen.getByRole('button', { name: 'Iniciar Sesión' }))

    await waitFor(() => {
      expect(localStorage.getItem('smartlogix_token')).toBe('jwt-token-123')
      expect(onLoginSuccess).toHaveBeenCalled()
    })
  })
})
