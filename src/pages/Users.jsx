import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, ChevronLeft, ChevronRight } from 'lucide-react'
import api from '../modules/auth/api'

export default function Users() {
  const [users,       setUsers]       = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages,  setTotalPages]  = useState(1)
  const [total,       setTotal]       = useState(0)
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)

  const fetchUsers = async (page = 1, search = '') => {
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get('/admin/users', {
        params: { page, search }
      })
      setUsers(data.data.data)
      setCurrentPage(data.data.current_page)
      setTotalPages(data.data.last_page)
      setTotal(data.data.total)
    } catch (err) {
      setError('Failed to load users. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers(1, '')
  }, [])

  useEffect(() => {
    const timeout = setTimeout(() => {
      setCurrentPage(1)
      fetchUsers(1, searchQuery)
    }, 400)
    return () => clearTimeout(timeout)
  }, [searchQuery])

  const handlePageChange = (page) => {
    fetchUsers(page, searchQuery)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Users Management</h1>
        <p className="text-mocha mt-1">Manage all registered users</p>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-nude/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="bg-blush border border-dusty-rose/30 text-dark-pink rounded-xl px-5 py-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-sand-nude/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-nude/30">
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Name</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso hidden md:table-cell">Registered</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso hidden lg:table-cell">Skin Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Status</th>
                <th className="text-right px-6 py-4 text-sm font-semibold text-espresso">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-nude/50">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-sand-nude animate-pulse" />
                        <div className="h-4 w-32 bg-sand-nude rounded animate-pulse" />
                      </div>
                    </td>
                    <td className="px-6 py-4"><div className="h-4 w-40 bg-sand-nude rounded animate-pulse" /></td>
                    <td className="px-6 py-4 hidden md:table-cell"><div className="h-4 w-24 bg-sand-nude rounded animate-pulse" /></td>
                    <td className="px-6 py-4 hidden lg:table-cell"><div className="h-6 w-20 bg-sand-nude rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-16 bg-sand-nude rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4 text-right"><div className="h-8 w-16 bg-sand-nude rounded-lg animate-pulse ml-auto" /></td>
                  </tr>
                ))
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-mocha">
                    No users found.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-nude-linen/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sage-teal to-deep-teal flex items-center justify-center text-white font-medium">
                          {user.first_name?.charAt(0)}
                        </div>
                        <span className="font-medium text-espresso">
                          {user.first_name} {user.last_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-mocha">{user.email}</td>
                    <td className="px-6 py-4 text-mocha hidden md:table-cell">
                      {user.created_at?.slice(0, 10)}
                    </td>
                    <td className="px-6 py-4 hidden lg:table-cell">
                      <span className="px-3 py-1 bg-mist-teal/30 text-deep-teal text-sm rounded-full">
                        {user.skin_type ?? '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-sm rounded-full ${
                        user.email_verified_at
                          ? 'bg-sage-teal/20 text-forest-teal'
                          : 'bg-sand-nude text-walnut'
                      }`}>
                        {user.email_verified_at ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={`/admin/users/${user.id}`}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-forest-teal transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                        <span className="hidden sm:inline">View</span>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between px-6 py-4 bg-sand-nude/20 border-t border-sand-nude/50">
          <p className="text-sm text-mocha">
            {loading ? '...' : `${total} users total`}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || loading}
              className="p-2 rounded-lg border border-sand-nude hover:bg-sand-nude disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-mocha" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-espresso">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || loading}
              className="p-2 rounded-lg border border-sand-nude hover:bg-sand-nude disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-mocha" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}