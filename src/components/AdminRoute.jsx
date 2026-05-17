import { Navigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import api from '../modules/auth/api'

export default function AdminRoute({ children }) {
  const [status, setStatus] = useState("checking")

  useEffect(() => {
    const token = localStorage.getItem("token")
    const user  = JSON.parse(localStorage.getItem("user") || "null")

    if (!token || !user || user.role !== "admin") {
      setStatus("fail")
      return
    }

    api.get("/auth/me")
      .then(({ data }) => {
        if (data.data?.user?.role === "admin") setStatus("ok")
        else setStatus("fail")
      })
      .catch(() => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setStatus("fail")
      })
  }, [])

  if (status === "checking") return (
    <div className="min-h-screen flex items-center justify-center bg-nude-linen">
      <p className="text-mocha">Loading...</p>
    </div>
  )

  if (status === "fail") return <Navigate to="/auth" replace />

  return children
}