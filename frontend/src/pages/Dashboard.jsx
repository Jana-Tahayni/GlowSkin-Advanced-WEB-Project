import { useState, useEffect } from 'react'
import {
  Users, Stethoscope, BrainCircuit, ClipboardCheck,
  TrendingUp, AlertCircle, CreditCard, Activity
} from 'lucide-react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar
} from 'recharts'
import api from '../modules/auth/api'

const paymentAlerts = [
  { id: 1, user: 'John Doe',  type: 'Subscription expiring', days: 3 },
  { id: 2, user: 'Lisa Park', type: 'Payment failed',        days: 1 },
]

export default function Dashboard() {
  const [stats,          setStats]          = useState(null)
  const [weeklyAnalyses, setWeeklyAnalyses] = useState([])
  const [topProducts,    setTopProducts]    = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    api.get('/admin/dashboard').then(({ data }) => {
      setStats(data.data.stats)
      setWeeklyAnalyses(data.data.weeklyAnalyses)
      setTopProducts(data.data.topProducts)
      setRecentActivity(data.data.recentActivity)
    }).finally(() => setLoading(false))
  }, [])

  const statsCards = stats ? [
    {
      label:  'Total Users',
      value:  stats.totalUsers.toLocaleString(),
      change: '+12%',
      icon:   Users,
      iconBg: 'bg-mist-teal',
    },
    {
      label:  'Total Doctors',
      value:  stats.totalDoctors.toLocaleString(),
      change: '+8%',
      icon:   Stethoscope,
      iconBg: 'bg-blush',
    },
    {
      label:  'AI Analyses',
      value:  stats.totalAnalyses.toLocaleString(),
      change: '+24%',
      icon:   BrainCircuit,
      iconBg: 'bg-mist-teal',
    },
    {
      label:  'Routines Reviewed',
      value:  stats.totalRoutines.toLocaleString(),
      change: '+15%',
      icon:   ClipboardCheck,
      iconBg: 'bg-sand-nude',
    },
  ] : []

  if (loading) return (
    <div className="space-y-6 animate-pulse">
      <div className="h-8 w-64 bg-sand-nude rounded" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 h-32 border border-sand-nude/50" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl h-80 border border-sand-nude/50" />
        <div className="bg-white rounded-2xl h-80 border border-sand-nude/50" />
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Dashboard Overview</h1>
        <p className="text-mocha mt-1">Welcome back! Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-2xl p-5 shadow-sm border border-sand-nude/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div className={`p-3 rounded-xl ${stat.iconBg}`}>
                <stat.icon className="w-6 h-6 text-dark-teal" />
              </div>
              <span className="flex items-center gap-1 text-sm font-medium text-sage-teal">
                <TrendingUp className="w-4 h-4" />
                {stat.change}
              </span>
            </div>
            <div className="mt-4">
              <p className="text-2xl font-bold text-espresso">{stat.value}</p>
              <p className="text-sm text-mocha mt-1">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weekly Analyses */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h3 className="text-lg font-semibold text-espresso mb-4">AI Analyses This Week</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyAnalyses}>
                <defs>
                  <linearGradient id="colorAnalyses" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#5AADA0" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#5AADA0" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD0C0" />
                <XAxis dataKey="name" stroke="#8B6450" fontSize={12} />
                <YAxis stroke="#8B6450" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDD0C0', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="analyses" stroke="#3D8C80" strokeWidth={2} fillOpacity={1} fill="url(#colorAnalyses)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h3 className="text-lg font-semibold text-espresso mb-4">Most Analyzed Products</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#DDD0C0" horizontal={false} />
                <XAxis type="number" stroke="#8B6450" fontSize={12} />
                <YAxis dataKey="name" type="category" stroke="#8B6450" fontSize={11} width={120} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #DDD0C0', borderRadius: '12px' }} />
                <Bar dataKey="count" fill="#D4907E" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Widgets Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Alerts — still static */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-espresso">Payment Alerts</h3>
            <AlertCircle className="w-5 h-5 text-terra-pink" />
          </div>
          <div className="space-y-3">
            {paymentAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-3 p-3 bg-blush/50 rounded-xl border border-dusty-rose/30">
                <CreditCard className="w-5 h-5 text-dark-pink" />
                <div className="flex-1">
                  <p className="font-medium text-espresso">{alert.user}</p>
                  <p className="text-sm text-terra-pink">{alert.type}</p>
                </div>
                <span className="px-2 py-1 bg-terra-pink text-white text-xs rounded-lg">
                  {alert.days}d
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-espresso">Recent Activity</h3>
            <Activity className="w-5 h-5 text-sage-teal" />
          </div>
          <div className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  activity.type === 'user'     ? 'bg-sage-teal'  :
                  activity.type === 'analysis' ? 'bg-deep-teal'  :
                  activity.type === 'routine'  ? 'bg-dusty-rose' :
                  activity.type === 'payment'  ? 'bg-terra-pink' : 'bg-mocha'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-espresso">{activity.action}</p>
                  <p className="text-xs text-mocha">{activity.user} • {activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}