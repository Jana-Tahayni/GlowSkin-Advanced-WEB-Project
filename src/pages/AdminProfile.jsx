import { useState, useEffect } from 'react'
import { User, Mail, Lock, Eye, EyeOff, Save, Check } from 'lucide-react'
import api from '../modules/auth/api'

export default function AdminProfile() {
  const [showPassword,        setShowPassword]        = useState(false)
  const [showNewPassword,     setShowNewPassword]     = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [profileSaved,        setProfileSaved]        = useState(false)
  const [passwordSaved,       setPasswordSaved]       = useState(false)
  const [profileError,        setProfileError]        = useState(null)
  const [passwordError,       setPasswordError]       = useState(null)
  const [loading,             setLoading]             = useState(false)

  const [profileData, setProfileData] = useState({
    name:  '',
    email: '',
  })

  const [passwordData, setPasswordData] = useState({
    currentPassword:  '',
    newPassword:      '',
    confirmPassword:  '',
  })


  useEffect(() => {
    api.get('/admin/profile').then(({ data }) => {
      setProfileData({ name: data.data.name, email: data.data.email })
    })
  }, [])

  const handleProfileChange = (e) => {
    const { name, value } = e.target
    setProfileData(prev => ({ ...prev, [name]: value }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileError(null)
    setLoading(true)
    try {
      const { data } = await api.put('/admin/profile', profileData)
      setProfileData({ name: data.data.name, email: data.data.email })
      setProfileSaved(true)
      setTimeout(() => setProfileSaved(false), 2000)
    } catch (err) {
      setProfileError(
        err.response?.data?.message || 'Failed to update profile.'
      )
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError(null)

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('Passwords do not match.')
      return
    }

    setLoading(true)
    try {
      await api.put('/admin/profile/password', {
        currentPassword:          passwordData.currentPassword,
        newPassword:              passwordData.newPassword,
        newPassword_confirmation: passwordData.confirmPassword,
      })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setPasswordSaved(true)
      setTimeout(() => setPasswordSaved(false), 2000)
    } catch (err) {
      setPasswordError(
        err.response?.data?.errors?.currentPassword?.[0] ||
        err.response?.data?.message ||
        'Failed to update password.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-espresso">Admin Profile</h1>
        <p className="text-mocha mt-1">Manage your account settings</p>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-sand-nude/50">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-dusty-rose to-terra-pink flex items-center justify-center text-white text-2xl font-bold">
            {profileData.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold text-espresso">{profileData.name}</h2>
            <p className="text-mocha">{profileData.email}</p>
            <span className="inline-block mt-2 px-3 py-1 bg-sage-teal/20 text-forest-teal text-sm rounded-full">
              Administrator
            </span>
          </div>
        </div>

        <form onSubmit={handleProfileSubmit}>
          <h3 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-sage-teal" />
            Personal Information
          </h3>

          {profileError && (
            <div className="mb-4 px-4 py-3 bg-blush border border-dusty-rose/30 text-dark-pink rounded-xl text-sm">
              {profileError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-espresso mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  className="w-full pl-12 pr-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-espresso mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="w-full pl-12 pr-4 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-sage-teal to-deep-teal text-white rounded-xl hover:from-deep-teal hover:to-forest-teal transition-all shadow-lg shadow-sage-teal/30 font-medium disabled:opacity-50"
            >
              {profileSaved ? <Check className="w-5 h-5" /> : <Save className="w-5 h-5" />}
              {profileSaved ? 'Saved!' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>

      {/* Password Card */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-sand-nude/50">
        <form onSubmit={handlePasswordSubmit}>
          <h3 className="text-lg font-semibold text-espresso mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-terra-pink" />
            Change Password
          </h3>

          {passwordError && (
            <div className="mb-4 px-4 py-3 bg-blush border border-dusty-rose/30 text-dark-pink rounded-xl text-sm">
              {passwordError}
            </div>
          )}

          <div className="space-y-4">
            {[
              { label: 'Current Password',     name: 'currentPassword',  show: showPassword,        setShow: setShowPassword },
              { label: 'New Password',          name: 'newPassword',      show: showNewPassword,     setShow: setShowNewPassword },
              { label: 'Confirm New Password',  name: 'confirmPassword',  show: showConfirmPassword, setShow: setShowConfirmPassword },
            ].map(({ label, name, show, setShow }) => (
              <div key={name}>
                <label className="block text-sm font-medium text-espresso mb-2">{label}</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-mocha" />
                  <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={passwordData[name]}
                    onChange={handlePasswordChange}
                    placeholder={`Enter ${label.toLowerCase()}`}
                    className="w-full pl-12 pr-12 py-3 bg-nude-linen border border-sand-nude rounded-xl focus:outline-none focus:ring-2 focus:ring-sage-teal/50 focus:border-sage-teal transition-all"
                  />
                  <button type="button" onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-mocha hover:text-espresso">
                    {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-terra-pink to-dark-pink text-white rounded-xl hover:from-dark-pink hover:to-espresso transition-all shadow-lg shadow-terra-pink/30 font-medium disabled:opacity-50"
            >
              {passwordSaved ? <Check className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              {passwordSaved ? 'Updated!' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}