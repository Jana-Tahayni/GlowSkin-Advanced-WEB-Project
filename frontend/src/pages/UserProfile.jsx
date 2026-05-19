import { useParams, Link, useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, Mail, User, Calendar, Droplets,
  TrendingUp, Package, Trash2, AlertTriangle
} from 'lucide-react'
import { useState, useEffect } from 'react'
import api from '../modules/auth/api'

export default function UserProfile() {
  const { id }       = useParams()
  const navigate     = useNavigate()
  const [user,           setUser]           = useState(null)
  const [loading,        setLoading]        = useState(true)
  const [error,          setError]          = useState(null)
  const [showDeleteModal,setShowDeleteModal] = useState(false)
  const [deleting,       setDeleting]       = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await api.get(`/admin/users/${id}`)
        setUser(data.data)
      } catch (err) {
        setError('Failed to load user data.')
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await api.delete(`/admin/users/${id}`)
      navigate('/admin/users')
    } catch (err) {
      setError('Failed to delete user.')
      setShowDeleteModal(false)
    } finally {
      setDeleting(false)
    }
  }

  // ── Loading ──
  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-6 w-32 bg-sand-nude rounded" />
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-sand-nude" />
          <div className="space-y-2 flex-1">
            <div className="h-6 w-48 bg-sand-nude rounded" />
            <div className="h-4 w-64 bg-sand-nude rounded" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50 h-48" />
        ))}
      </div>
    </div>
  )

  // ── Error ──
  if (error) return (
    <div className="space-y-4">
      <Link to="/admin/users" className="inline-flex items-center gap-2 text-mocha hover:text-espresso">
        <ArrowLeft className="w-5 h-5" /> Back to Users
      </Link>
      <div className="bg-blush border border-dusty-rose/30 text-dark-pink rounded-xl px-5 py-4">
        {error}
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/admin/users"
        className="inline-flex items-center gap-2 text-mocha hover:text-espresso transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Users
      </Link>

      {/* User Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-sage-teal to-deep-teal flex items-center justify-center text-white text-2xl font-bold">
            {user.name.charAt(0)}
          </div>
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-espresso">{user.name}</h1>
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                user.status === 'Active'
                  ? 'bg-sage-teal/20 text-forest-teal'
                  : 'bg-sand-nude text-walnut'
              }`}>
                {user.status}
              </span>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-mocha">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" /> {user.email}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" /> Joined {user.registeredAt}
              </span>
              <span className="flex items-center gap-1">
                <Droplets className="w-4 h-4" /> {user.skinType} Skin
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 bg-terra-pink/10 text-terra-pink rounded-lg hover:bg-terra-pink/20 transition-colors flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete Account
          </button>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Analysis History */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-sage-teal" />
            Analysis History
          </h2>
          {user.analyses.length === 0 ? (
            <p className="text-mocha text-sm">No analyses yet.</p>
          ) : (
            <div className="space-y-3">
              {user.analyses.map((analysis) => (
                <div key={analysis.id} className="p-4 bg-nude-linen rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-mocha">{analysis.date}</span>
                    <span className={`px-2 py-1 rounded-lg text-sm font-medium ${
                      analysis.healthScore >= 80 ? 'bg-sage-teal/20 text-forest-teal' :
                      analysis.healthScore >= 60 ? 'bg-mist-teal/30 text-deep-teal' :
                      'bg-dusty-rose/30 text-dark-pink'
                    }`}>
                      {analysis.healthScore}% Health
                    </span>
                  </div>
                  <p className="font-medium text-espresso">{analysis.result}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Before / After */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-dusty-rose" />
            Before / After Comparison
          </h2>
          {!user.beforeImage && !user.afterImage ? (
            <p className="text-mocha text-sm">No images available.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-mocha mb-2 text-center">First Analysis</p>
                <img
                  src={`http://localhost:8000/storage/${user.beforeImage}`}
                  alt="Before"
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </div>
              <div>
                <p className="text-sm text-mocha mb-2 text-center">Latest Analysis</p>
                <img
                  src={`http://localhost:8000/storage/${user.afterImage}`}
                  alt="After"
                  className="w-full aspect-square object-cover rounded-xl"
                />
              </div>
            </div>
          )}
        </div>

        {/* Current Routine */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4">Current Routine</h2>
          {!user.currentRoutine ? (
            <p className="text-mocha text-sm">No active routine.</p>
          ) : (
            <>
              <div className="p-4 bg-gradient-to-br from-mist-teal/20 to-sage-teal/10 rounded-xl border border-sage-teal/20">
                <h3 className="font-semibold text-espresso">{user.currentRoutine.name}</h3>
                <p className="text-xs text-walnut mt-1">Started: {user.currentRoutine.startDate}</p>
                {user.currentRoutine.notes && (
                  <p className="text-sm text-mocha mt-1">{user.currentRoutine.notes}</p>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  {user.currentRoutine.products.map((product, idx) => (
                    <span key={idx} className="px-2 py-1 bg-white/80 text-deep-teal text-xs rounded-lg">
                      {product}
                    </span>
                  ))}
                </div>
              </div>

              {user.previousRoutines.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-mocha mb-2">Previous Routines</h4>
                  {user.previousRoutines.map((routine, idx) => (
                    <div key={idx} className="p-3 bg-sand-nude/30 rounded-lg mb-2">
                      <p className="font-medium text-espresso text-sm">{routine.name}</p>
                      <p className="text-xs text-mocha">{routine.period}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>

        {/* Analyzed Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <Package className="w-5 h-5 text-mocha" />
            Analyzed Products
          </h2>
          {user.analyzedProducts.length === 0 ? (
            <p className="text-mocha text-sm">No products analyzed yet.</p>
          ) : (
            <div className="space-y-3">
              {user.analyzedProducts.map((product, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-nude-linen rounded-xl">
                  <div>
                    <p className="font-medium text-espresso">{product.name}</p>
                    <p className={`text-sm ${
                      product.rating === 'Excellent' ? 'text-forest-teal' :
                      product.rating === 'Good'      ? 'text-deep-teal' :
                      'text-mocha'
                    }`}>
                      {product.rating}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-espresso">{product.match}%</span>
                    <p className="text-xs text-mocha">Match</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-espresso/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-terra-pink/20 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-terra-pink" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-espresso">Delete Account</h3>
                <p className="text-sm text-mocha">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-mocha mb-6">
              Are you sure you want to delete <strong>{user.name}&apos;s</strong> account? All data will be permanently removed.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="flex-1 px-4 py-2 border border-sand-nude rounded-lg hover:bg-sand-nude/50 transition-colors text-espresso"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2 bg-terra-pink text-white rounded-lg hover:bg-dark-pink transition-colors disabled:opacity-50"
              >
                {deleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}