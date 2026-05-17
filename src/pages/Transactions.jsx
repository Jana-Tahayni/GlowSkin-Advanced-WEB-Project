import { useState } from 'react'
import { Search, ChevronLeft, ChevronRight, Filter } from 'lucide-react'

const mockTransactions = [
  { id: 'TXN-001', user: 'Sarah Johnson', email: 'sarah.johnson@email.com', amount: 29.99, date: '2024-03-10', status: 'paid' },
  { id: 'TXN-002', user: 'Michael Chen', email: 'michael.chen@email.com', amount: 49.99, date: '2024-03-10', status: 'paid' },
  { id: 'TXN-003', user: 'Emily Davis', email: 'emily.davis@email.com', amount: 29.99, date: '2024-03-09', status: 'pending' },
  { id: 'TXN-004', user: 'James Wilson', email: 'james.wilson@email.com', amount: 99.99, date: '2024-03-09', status: 'failed' },
  { id: 'TXN-005', user: 'Jessica Miller', email: 'jessica.miller@email.com', amount: 29.99, date: '2024-03-08', status: 'paid' },
  { id: 'TXN-006', user: 'David Brown', email: 'david.brown@email.com', amount: 49.99, date: '2024-03-08', status: 'paid' },
  { id: 'TXN-007', user: 'Anna Lee', email: 'anna.lee@email.com', amount: 29.99, date: '2024-03-07', status: 'pending' },
  { id: 'TXN-008', user: 'Tom Wilson', email: 'tom.wilson@email.com', amount: 99.99, date: '2024-03-07', status: 'paid' },
  { id: 'TXN-009', user: 'Lisa Park', email: 'lisa.park@email.com', amount: 29.99, date: '2024-03-06', status: 'failed' },
  { id: 'TXN-010', user: 'John Doe', email: 'john.doe@email.com', amount: 49.99, date: '2024-03-06', status: 'paid' },
]

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredTransactions = mockTransactions.filter(txn => {
    const matchesSearch = txn.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      txn.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || txn.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedTransactions = filteredTransactions.slice(startIndex, startIndex + itemsPerPage)

  const getStatusStyles = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-sage-teal/20 text-forest-teal'
      case 'pending':
        return 'bg-dusty-rose/20 text-dusty-rose'
      case 'failed':
        return 'bg-terra-pink/20 text-terra-pink'
      default:
        return 'bg-sand-nude text-walnut'
    }
  }

  const totalRevenue = mockTransactions
    .filter(t => t.status === 'paid')
    .reduce((sum, t) => sum + t.amount, 0)

  const pendingAmount = mockTransactions
    .filter(t => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0)

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Transactions</h1>
        <p className="text-mocha mt-1">View all financial operations</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-nude/50">
          <p className="text-sm text-mocha">Total Revenue</p>
          <p className="text-2xl font-bold text-forest-teal mt-1">${totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-nude/50">
          <p className="text-sm text-mocha">Pending Amount</p>
          <p className="text-2xl font-bold text-dusty-rose mt-1">${pendingAmount.toFixed(2)}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-sand-nude/50">
          <p className="text-sm text-mocha">Total Transactions</p>
          <p className="text-2xl font-bold text-espresso mt-1">{mockTransactions.length}</p>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-nude/50">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
            <input
              type="text"
              placeholder="Search by ID, user, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-mocha" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            >
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-sand-nude/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-nude/30">
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Transaction ID</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">User</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso hidden md:table-cell">Email</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso hidden lg:table-cell">Date</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-espresso">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-nude/50">
              {paginatedTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-nude-linen/50 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-mono text-sm font-medium text-deep-teal">{txn.id}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sage-teal to-deep-teal flex items-center justify-center text-white text-sm font-medium">
                        {txn.user.charAt(0)}
                      </div>
                      <span className="font-medium text-espresso">{txn.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-mocha hidden md:table-cell">{txn.email}</td>
                  <td className="px-6 py-4">
                    <span className="font-semibold text-espresso">${txn.amount.toFixed(2)}</span>
                  </td>
                  <td className="px-6 py-4 text-mocha hidden lg:table-cell">{txn.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full capitalize ${getStatusStyles(txn.status)}`}>
                      {txn.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 bg-sand-nude/20 border-t border-sand-nude/50">
          <p className="text-sm text-mocha">
            Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredTransactions.length)} of {filteredTransactions.length} transactions
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-sand-nude hover:bg-sand-nude disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-mocha" />
            </button>
            <span className="px-4 py-2 text-sm font-medium text-espresso">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
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
