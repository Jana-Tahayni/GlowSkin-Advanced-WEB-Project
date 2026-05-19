import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Save, Plus, X } from 'lucide-react'

export default function AddDoctor() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    specialty: '',
    experience: '',
    country: '',
    certificates: ['']
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const addCertificate = () => {
    setFormData(prev => ({ 
      ...prev, 
      certificates: [...prev.certificates, ''] 
    }))
  }

  const removeCertificate = (index) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index)
    }))
  }

  const updateCertificate = (index, value) => {
    setFormData(prev => ({
      ...prev,
      certificates: prev.certificates.map((cert, i) => i === index ? value : cert)
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
    navigate('/doctors')
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Back Button */}
      <Link 
        to="/doctors"
        className="inline-flex items-center gap-2 text-mocha hover:text-espresso transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Doctors</span>
      </Link>

      {/* Page Title */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Add New Doctor</h1>
        <p className="text-mocha mt-1">Fill in the details to add a new specialist</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Full Name <span className="text-terra-pink">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Dr. John Smith"
              required
              className="w-full px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Email Address <span className="text-terra-pink">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="doctor@glowskin.com"
              required
              className="w-full px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            />
          </div>

          {/* Specialty */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Specialty <span className="text-terra-pink">*</span>
            </label>
            <select
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            >
              <option value="">Select specialty</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Cosmetic Dermatology">Cosmetic Dermatology</option>
              <option value="Clinical Dermatology">Clinical Dermatology</option>
              <option value="Pediatric Dermatology">Pediatric Dermatology</option>
              <option value="Surgical Dermatology">Surgical Dermatology</option>
            </select>
          </div>

          {/* Experience */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Years of Experience <span className="text-terra-pink">*</span>
            </label>
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="10"
              min="0"
              required
              className="w-full px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Country <span className="text-terra-pink">*</span>
            </label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              placeholder="United States"
              required
              className="w-full px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
            />
          </div>

          {/* Certificates */}
          <div>
            <label className="block text-sm font-medium text-espresso mb-2">
              Certificates
            </label>
            <div className="space-y-3">
              {formData.certificates.map((cert, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={cert}
                    onChange={(e) => updateCertificate(index, e.target.value)}
                    placeholder="Certificate name"
                    className="flex-1 px-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
                  />
                  {formData.certificates.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCertificate(index)}
                      className="p-3 text-terra-pink hover:bg-terra-pink/10 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addCertificate}
                className="flex items-center gap-2 text-sage-teal hover:text-deep-teal transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Certificate
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-sand-nude/50">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sage-teal to-deep-teal text-white rounded-xl hover:from-deep-teal hover:to-forest-teal transition-all shadow-lg shadow-sage-teal/30 font-medium"
            >
              <Save className="w-5 h-5" />
              Add Doctor
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
