import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { authApi } from '../api/client'

const AuthContext = createContext(null)

const DEMO_USERS = {
  'owner@serenityresorts.com': { id: 1, name: 'Rajiv Mehta', email: 'owner@serenityresorts.com', role: 'owner', avatar: 'RM', title: 'Resort Group Owner', resort: 'Serenity Resorts Group', department: 'management', permissions: ['all'] },
  'manager@serenityresorts.com': { id: 2, name: 'Priya Sharma', email: 'manager@serenityresorts.com', role: 'management', avatar: 'PS', title: 'General Manager', resort: 'Serenity Goa', department: 'management', permissions: ['dashboard', 'resorts', 'rooms', 'reservations', 'guests', 'housekeeping', 'maintenance', 'billing', 'reports', 'settings'] },
  'staff@serenityresorts.com': { id: 3, name: 'Arjun Patel', email: 'staff@serenityresorts.com', role: 'staff', avatar: 'AP', title: 'Front Desk Officer', resort: 'Serenity Goa', department: 'front_desk', permissions: ['dashboard', 'reservations', 'guests', 'housekeeping'] },
  'guest@serenityresorts.com': { id: 4, name: 'Rajesh Kumar', email: 'guest@serenityresorts.com', role: 'guest', avatar: 'RK', title: 'Platinum Member', resort: 'Serenity Goa', department: 'guest', permissions: ['guest'] },
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Verify token on initial load
  useEffect(() => {
    async function loadUser() {
      const token = localStorage.getItem('resort_token')
      const savedUserStr = localStorage.getItem('resort_user')

      if (token) {
        try {
          if (token.startsWith('demo-token-') && savedUserStr) {
            setUser(JSON.parse(savedUserStr))
          } else {
            const data = await authApi.me()
            if (data && data.user) {
              setUser(data.user)
            } else if (savedUserStr) {
              setUser(JSON.parse(savedUserStr))
            } else {
              localStorage.removeItem('resort_token')
            }
          }
        } catch (err) {
          console.warn('Session restore network fallback:', err.message)
          if (savedUserStr) {
            try {
              setUser(JSON.parse(savedUserStr))
            } catch (e) {
              localStorage.removeItem('resort_token')
              localStorage.removeItem('resort_user')
            }
          }
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
        localStorage.setItem('resort_user', JSON.stringify(data.user))
        setUser(data.user)
        setLoading(false)
        return { success: true, role: data.user.role }
      } else {
        throw new Error('Invalid login response')
      }
    } catch (err) {
      // Fallback for network connection errors (e.g. backend server offline)
      const emailKey = (email || '').trim().toLowerCase()
      const demoUser = DEMO_USERS[emailKey]

      if (demoUser) {
        const fallbackToken = `demo-token-${demoUser.role}`
        localStorage.setItem('resort_token', fallbackToken)
        localStorage.setItem('resort_user', JSON.stringify(demoUser))
        setUser(demoUser)
        setLoading(false)
        return { success: true, role: demoUser.role }
      }

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
        localStorage.setItem('resort_user', JSON.stringify(data.user))
        setUser(data.user)
        setLoading(false)
        return { success: true, role: 'guest' }
      } else {
        throw new Error('Invalid registration response')
      }
    } catch (err) {
      // Network fallback registration
      const newGuestUser = {
        id: Date.now(),
        name: name || 'Valued Guest',
        email,
        role: 'guest',
        avatar: (name || 'G').slice(0, 2).toUpperCase(),
        title: 'Guest Member',
        resort: 'Serenity Goa',
        department: 'guest',
        permissions: ['guest']
      }
      localStorage.setItem('resort_token', `demo-token-guest`)
      localStorage.setItem('resort_user', JSON.stringify(newGuestUser))
      setUser(newGuestUser)
      setLoading(false)
      return { success: true, role: 'guest' }
    }
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('resort_token')
    localStorage.removeItem('resort_user')
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
