import { useState, createContext, useContext, useEffect } from 'react'
import { Outlet, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { 
  LayoutDashboard, Users, Stethoscope, CreditCard, 
  User, Menu, X, Sparkles, LogOut
} from 'lucide-react'
import api from '../modules/auth/api'

// ── Context ───────────────────────────────────────────────────────────────────
const AdminContext = createContext(null)
export function useAdmin() { return useContext(AdminContext) }

// ── Nav items ─────────────────────────────────────────────────────────────────
const navItems = [
  { path: '/admin',               icon: LayoutDashboard, label: 'Dashboard'     },
  { path: '/admin/users',         icon: Users,           label: 'Users'         },
  { path: '/admin/doctors',       icon: Stethoscope,     label: 'Doctors'       },
  { path: '/admin/transactions',  icon: CreditCard,      label: 'Transactions'  },
  { path: '/admin/admin-profile', icon: User,            label: 'Admin Profile' },
]

// ── Layout ────────────────────────────────────────────────────────────────────
export default function Layout() {
  const [admin,       setAdmin]       = useState({ name: '', email: '' })
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => {
      setAdmin({ name: data.data.name, email: data.data.email })
    }).catch(() => {})
  }, [])

  const handleLogout = async () => {
    try {
      await api.post('/logout')
    } catch (_) {}
    navigate('/auth')
  }

  return (
    <AdminContext.Provider value={{ admin, setAdmin }}>
      <div className="min-h-screen flex bg-nude-linen">

        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-espresso/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-64 bg-gradient-to-b from-dark-teal to-forest-teal
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">

            {/* Logo */}
            <div className="flex items-center gap-3 px-6 py-6 border-b border-sage-teal/30">
              <div className="w-10 h-10 rounded-xl bg-blush flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-dark-pink" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Glow Skin</h1>
                <p className="text-xs text-mist-teal">Admin Panel</p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2">
              {navItems.map((item) => {
                const isActive =
                  item.path === '/admin'
                    ? location.pathname === '/admin' || location.pathname === '/admin/'
                    : location.pathname.startsWith(item.path)
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                      ${isActive
                        ? 'bg-blush text-dark-pink shadow-lg'
                        : 'text-mist-teal hover:bg-sage-teal/20 hover:text-white'}
                    `}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                )
              })}

              {/* Logout — after Admin Profile */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-mist-teal hover:bg-red-500/20 hover:text-red-300 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Logout</span>
              </button>
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-sage-teal/30">
              <p className="text-xs text-mist-teal text-center">Glow Skin v1.0</p>
            </div>

          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-h-screen">

          {/* Header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-sand-nude px-4 lg:px-8 py-4 sticky top-0 z-30">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-sand-nude transition-colors"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              {/* Admin info only — no logout here */}
              <div className="flex items-center gap-4 ml-auto">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-dusty-rose to-terra-pink flex items-center justify-center text-white font-semibold">
                    {admin.name.charAt(0) || 'A'}
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-sm font-medium text-espresso">
                      {admin.name || 'Admin User'}
                    </p>
                    <p className="text-xs text-mocha">
                      {admin.email || 'admin@glowskin.com'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-8">
            <Outlet />
          </main>

        </div>
      </div>
    </AdminContext.Provider>
  )
} 