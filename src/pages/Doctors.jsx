import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Search, Eye, Plus, ChevronLeft, ChevronRight } from 'lucide-react'

const mockDoctors = [
  { id: 1, name: 'Dr. Emma Wilson', specialty: 'Dermatology', routines: 245, rating: 4.9, status: 'Active' },
  { id: 2, name: 'Dr. James Smith', specialty: 'Cosmetic Dermatology', routines: 189, rating: 4.8, status: 'Active' },
  { id: 3, name: 'Dr. Sarah Chen', specialty: 'Clinical Dermatology', routines: 156, rating: 4.7, status: 'Active' },
  { id: 4, name: 'Dr. Michael Brown', specialty: 'Pediatric Dermatology', routines: 134, rating: 4.9, status: 'Inactive' },
  { id: 5, name: 'Dr. Lisa Park', specialty: 'Dermatology', routines: 112, rating: 4.6, status: 'Active' },
  { id: 6, name: 'Dr. Robert Lee', specialty: 'Surgical Dermatology', routines: 98, rating: 4.8, status: 'Active' },
  { id: 7, name: 'Dr. Anna Martinez', specialty: 'Cosmetic Dermatology', routines: 87, rating: 4.5, status: 'Active' },
  { id: 8, name: 'Dr. David Kim', specialty: 'Clinical Dermatology', routines: 76, rating: 4.7, status: 'Inactive' },
]

export default function Doctors() {
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  const filteredDoctors = mockDoctors.filter(doctor => 
    doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const totalPages = Math.ceil(filteredDoctors.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDoctors = filteredDoctors.slice(startIndex, startIndex + itemsPerPage)

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Doctors Management</h1>
          <p className="text-mocha mt-1">Manage all registered specialists</p>
        </div>
        {/* ✅ /admin/doctors/add */}
        <Link
          to="/admin/doctors/add"
          className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-sage-teal to-deep-teal text-white rounded-xl hover:from-deep-teal hover:to-forest-teal transition-all shadow-lg shadow-sage-teal/30"
        >
          <Plus className="w-5 h-5" />
          Add Doctor
        </Link>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-nude/50">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
          <input
            type="text"
            placeholder="Search doctors by name or specialty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
          />
        </div>
      </div>

      {/* Doctors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedDoctors.map((doctor) => (
          <div 
            key={doctor.id}
            className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-dusty-rose to-terra-pink flex items-center justify-center text-white text-xl font-bold">
                {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-espresso truncate">{doctor.name}</h3>
                <p className="text-sm text-mocha">{doctor.specialty}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                  doctor.status === 'Active' 
                    ? 'bg-sage-teal/20 text-forest-teal' 
                    : 'bg-sand-nude text-walnut'
                }`}>
                  {doctor.status}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-sand-nude/50 flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-espresso">{doctor.routines}</p>
                <p className="text-xs text-mocha">Routines Created</p>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1">
                  <span className="text-lg font-bold text-espresso">{doctor.rating}</span>
                  <span className="text-yellow-500">★</span>
                </div>
                <p className="text-xs text-mocha">Rating</p>
              </div>
            </div>

            {/* ✅ /admin/doctors/:id */}
            <Link
              to={`/admin/doctors/${doctor.id}`}
              className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-deep-teal text-white rounded-xl hover:bg-forest-teal transition-colors"
            >
              <Eye className="w-4 h-4" />
              View Details
            </Link>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-sand-nude/50 flex items-center justify-between">
        <p className="text-sm text-mocha">
          Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredDoctors.length)} of {filteredDoctors.length} doctors
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
  )
}