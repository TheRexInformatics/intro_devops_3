import { describe, it, expect, beforeEach, vi } from 'vitest'

const TOKEN_KEY = 'smartlogix_token'

function makeJwt(payload) {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
  const body = btoa(JSON.stringify(payload))
  return `${header}.${body}.signature`
}

describe('BffFacade - utilidades de token', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('getToken returns null when no token stored', async () => {
    const { getToken } = await import('../BffFacade')
    expect(getToken()).toBeNull()
  })

  it('getToken returns stored token', async () => {
    const { getToken } = await import('../BffFacade')
    localStorage.setItem(TOKEN_KEY, 'test-token')
    expect(getToken()).toBe('test-token')
  })

  it('isAuthenticated returns false when no token', async () => {
    const { isAuthenticated } = await import('../BffFacade')
    expect(isAuthenticated()).toBe(false)
  })

  it('isAuthenticated returns true when token exists', async () => {
    const { isAuthenticated } = await import('../BffFacade')
    localStorage.setItem(TOKEN_KEY, 'some-token')
    expect(isAuthenticated()).toBe(true)
  })

  it('logout removes token from localStorage', async () => {
    const { logout } = await import('../BffFacade')
    localStorage.setItem(TOKEN_KEY, 'some-token')
    logout()
    expect(localStorage.getItem(TOKEN_KEY)).toBeNull()
  })

  it('decodeTokenPayload decodes a valid JWT payload', async () => {
    const { decodeTokenPayload } = await import('../BffFacade')
    const payload = { sub: 'admin', name: 'Admin User', exp: 9999999999 }
    localStorage.setItem(TOKEN_KEY, makeJwt(payload))
    const decoded = decodeTokenPayload()
    expect(decoded.sub).toBe('admin')
    expect(decoded.name).toBe('Admin User')
  })

  it('decodeTokenPayload returns null when no token', async () => {
    const { decodeTokenPayload } = await import('../BffFacade')
    expect(decodeTokenPayload()).toBeNull()
  })

  it('isTokenExpired returns true when token is expired', async () => {
    const { isTokenExpired } = await import('../BffFacade')
    const payload = { sub: 'admin', exp: 1000 }
    localStorage.setItem(TOKEN_KEY, makeJwt(payload))
    expect(isTokenExpired()).toBe(true)
  })

  it('isTokenExpired returns false when token is valid', async () => {
    const { isTokenExpired } = await import('../BffFacade')
    const payload = { sub: 'admin', exp: 9999999999 }
    localStorage.setItem(TOKEN_KEY, makeJwt(payload))
    expect(isTokenExpired()).toBe(false)
  })

  it('isTokenExpired returns true when no token', async () => {
    const { isTokenExpired } = await import('../BffFacade')
    expect(isTokenExpired()).toBe(true)
  })
})
