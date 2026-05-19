
import { createContext, useContext, useState, useEffect } from 'react'
import api from '../modules/auth/api'

const AdminContext = createContext(null)

export function AdminProvider({ children }) {
  const [admin, setAdmin] = useState({ name: '', email: '' })

  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => {
      setAdmin({ name: data.data.name, email: data.data.email })
    })
  }, [])

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}