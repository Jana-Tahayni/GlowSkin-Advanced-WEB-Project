import { useParams, Link } from 'react-router-dom'
import { useState } from 'react'
import { 
  ArrowLeft, 
  Mail, 
  MapPin, 
  Award,
  Calendar,
  ClipboardCheck,
  XCircle,
  Edit2,
  Trash2,
  Power,
  AlertTriangle
} from 'lucide-react'

const mockDoctorData = {
  1: {
    id: 1,
    name: 'Dr. Emma Wilson',
    email: 'emma.wilson@glowskin.com',
    specialty: 'Dermatology',
    certificates: ['Board Certified Dermatologist', 'Fellow of AAD', 'Skin Cancer Specialist'],
    experience: 12,
    country: 'United States',
    status: 'Active',
    approvedRoutines: 245,
    rejectedCases: 12,
    routines: [
      { id: 1, name: 'Acne Treatment Protocol', user: 'Sarah Johnson', date: '2024-03-10', status: 'Active' },
      { id: 2, name: 'Anti-Aging Routine', user: 'Michael Chen', date: '2024-03-08', status: 'Active' },
      { id: 3, name: 'Sensitive Skin Care', user: 'Emily Davis', date: '2024-03-05', status: 'Completed' },
      { id: 4, name: 'Hyperpigmentation Treatment', user: 'James Wilson', date: '2024-02-28', status: 'Active' },
      { id: 5, name: 'Rosacea Management', user: 'Jessica Miller', date: '2024-02-20', status: 'Completed' },
    ],
    adminNotes: 'Excellent performer. Consistently high patient satisfaction scores.'
  }
}

export default function DoctorProfile() {
  const { id } = useParams()
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [isActive, setIsActive] = useState(true)
  
  const doctor = mockDoctorData[id] || mockDoctorData[1]

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link 
        to="/doctors"
        className="inline-flex items-center gap-2 text-mocha hover:text-espresso transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Doctors</span>
      </Link>

      {/* Doctor Header */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-dusty-rose to-terra-pink flex items-center justify-center text-white text-3xl font-bold">
            {doctor.name.split(' ').slice(1).map(n => n[0]).join('')}
          </div>
          
          <div className="flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
              <h1 className="text-2xl font-bold text-espresso">{doctor.name}</h1>
              <span className={`inline-flex px-3 py-1 text-sm rounded-full ${
                isActive 
                  ? 'bg-sage-teal/20 text-forest-teal' 
                  : 'bg-sand-nude text-walnut'
              }`}>
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <p className="text-lg text-deep-teal mt-1">{doctor.specialty}</p>
            
            <div className="flex flex-wrap gap-4 mt-3 text-sm text-mocha">
              <span className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {doctor.email}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {doctor.country}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {doctor.experience} years experience
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsActive(!isActive)}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                isActive 
                  ? 'bg-walnut/10 text-walnut hover:bg-walnut/20' 
                  : 'bg-sage-teal/10 text-sage-teal hover:bg-sage-teal/20'
              }`}
            >
              <Power className="w-4 h-4" />
              {isActive ? 'Deactivate' : 'Activate'}
            </button>
            <button
              onClick={() => setShowEditModal(true)}
              className="px-4 py-2 bg-deep-teal/10 text-deep-teal rounded-lg hover:bg-deep-teal/20 transition-colors flex items-center gap-2"
            >
              <Edit2 className="w-4 h-4" />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="px-4 py-2 bg-terra-pink/10 text-terra-pink rounded-lg hover:bg-terra-pink/20 transition-colors flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </div>
        </div>
      </div>

      {/* Stats and Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4">Performance</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-sage-teal/10 rounded-xl">
              <div className="flex items-center gap-3">
                <ClipboardCheck className="w-6 h-6 text-sage-teal" />
                <span className="text-mocha">Approved Routines</span>
              </div>
              <span className="text-2xl font-bold text-forest-teal">{doctor.approvedRoutines}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-dusty-rose/10 rounded-xl">
              <div className="flex items-center gap-3">
                <XCircle className="w-6 h-6 text-dusty-rose" />
                <span className="text-mocha">Rejected Cases</span>
              </div>
              <span className="text-2xl font-bold text-terra-pink">{doctor.rejectedCases}</span>
            </div>
            <div className="pt-4 border-t border-sand-nude/50">
              <p className="text-sm text-mocha">Approval Rate</p>
              <div className="mt-2 h-3 bg-sand-nude rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-sage-teal to-deep-teal rounded-full"
                  style={{ width: `${(doctor.approvedRoutines / (doctor.approvedRoutines + doctor.rejectedCases)) * 100}%` }}
                />
              </div>
              <p className="text-right text-sm font-medium text-deep-teal mt-1">
                {Math.round((doctor.approvedRoutines / (doctor.approvedRoutines + doctor.rejectedCases)) * 100)}%
              </p>
            </div>
          </div>
        </div>

        {/* Certificates */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-dusty-rose" />
            Certificates
          </h2>
          <div className="space-y-3">
            {doctor.certificates.map((cert, idx) => (
              <div key={idx} className="p-3 bg-blush/30 rounded-xl border border-dusty-rose/20">
                <p className="font-medium text-espresso">{cert}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Notes */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso mb-4">Admin Notes</h2>
          <div className="p-4 bg-nude-linen rounded-xl">
            <p className="text-mocha">{doctor.adminNotes || 'No notes added yet.'}</p>
          </div>
        </div>
      </div>

      {/* Routines List */}
      <div className="bg-white rounded-2xl shadow-sm border border-sand-nude/50 overflow-hidden">
        <div className="p-6 border-b border-sand-nude/50">
          <h2 className="text-lg font-semibold text-espresso">Created Routines</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sand-nude/30">
                <th className="text-left px-6 py-3 text-sm font-semibold text-espresso">Routine Name</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-espresso">User</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-espresso hidden md:table-cell">Date</th>
                <th className="text-left px-6 py-3 text-sm font-semibold text-espresso">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-nude/50">
              {doctor.routines.map((routine) => (
                <tr key={routine.id} className="hover:bg-nude-linen/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-espresso">{routine.name}</td>
                  <td className="px-6 py-4 text-mocha">{routine.user}</td>
                  <td className="px-6 py-4 text-mocha hidden md:table-cell">{routine.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 text-sm rounded-full ${
                      routine.status === 'Active' 
                        ? 'bg-sage-teal/20 text-forest-teal' 
                        : 'bg-sand-nude text-walnut'
                    }`}>
                      {routine.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
                <h3 className="text-lg font-semibold text-espresso">Delete Doctor</h3>
                <p className="text-sm text-mocha">This action cannot be undone</p>
              </div>
            </div>
            <p className="text-mocha mb-6">
              Are you sure you want to delete <strong>{doctor.name}&apos;s</strong> account?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 border border-sand-nude rounded-lg hover:bg-sand-nude/50 transition-colors text-espresso"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-terra-pink text-white rounded-lg hover:bg-dark-pink transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-espresso/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold text-espresso mb-4">Edit Doctor</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Name</label>
                <input
                  type="text"
                  defaultValue={doctor.name}
                  className="w-full px-4 py-2 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Email</label>
                <input
                  type="email"
                  defaultValue={doctor.email}
                  className="w-full px-4 py-2 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Specialty</label>
                <input
                  type="text"
                  defaultValue={doctor.specialty}
                  className="w-full px-4 py-2 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-espresso mb-1">Country</label>
                <input
                  type="text"
                  defaultValue={doctor.country}
                  className="w-full px-4 py-2 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-sand-nude rounded-lg hover:bg-sand-nude/50 transition-colors text-espresso"
              >
                Cancel
              </button>
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 bg-deep-teal text-white rounded-lg hover:bg-forest-teal transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
