import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Verify token on initial load
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('resort_token')
      if (token) {
        try {
          const data = await authApi.me()
          if (data && data.user) {
            setUser(data.user)
          } else {
            localStorage.removeItem('resort_token')
          }
        } catch (err) {
          console.error('Session restore failed:', err)
          localStorage.removeItem('resort_token')
        }
      }
      setLoading(false)
    }
    loadUser()
  }, [])

  const login = useCallback(async (email, password) => {
    setLoading(true)
    setError('')
    try {
      const data = await authApi.login(email, password)
      if (data.token && data.user) {
        localStorage.setItem('resort_token', data.token)
        setUser(data.user)
        setLoading(false)
        return { success: true, role: data.user.role }
      } else {
        throw new Error('Invalid login response')
      }
    } catch (err) {
      const msg = err.message || 'Invalid email or password.'
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const register = useCallback(async (name, email, password, phone) => {
    setLoading(true)
    setError('')
    try {
      const data = await authApi.register(name, email, password, phone)
      if (data.token && data.user) {
        localStorage.setItem('resort_token', data.token)
        setUser(data.user)
        setLoading(false)
        return { success: true, role: 'guest' }
      } else {
        throw new Error('Invalid registration response')
      }
    } catch (err) {
      const msg = err.message || 'Failed to register account.'
      setError(msg)
      setLoading(false)
      return { success: false, error: msg }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('resort_token')
    setUser(null)
  }, [])

  const hasPermission = useCallback((permission) => {
    if (!user) return false
    if (user.permissions && user.permissions.includes('all')) return true
    return user.permissions ? user.permissions.includes(permission) : false
  }, [user])

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
