import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CButton,
  CCard,
  CCardBody,
  CFormSwitch,
} from '@coreui/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios from '../hooks/useAxios'
import LoadingSpinner from '../components/common/LoadinSpinner'

const Updateuser = () => {
  const { userId } = useParams()
  const location = useLocation()
  const { user, isActivated } = location.state || {};
  const navigate = useNavigate()

  const { fetchData, loading } = useAxios()

  const [form, setForm] = useState({
    sponsor: '',
    userId: '',
    name: '',
    phone: '',
    email: '',
    walletBalance: 0,
    password: '',
    isActivated: false,
    totalInvested: 0,
  })
  console.log('data check ', user)

  useEffect(() => {
    if (user) {
      setForm({
        sponsor: user.sponsor || '',
        userId: user.userId || '',
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        walletBalance: user.walletBalance || 0,
        password: '',
        isActivated: isActivated ?? user.isActivated,
        totalInvested: user.totalInvested || 0,
      })
    }
  }, [user])

  const handleChange = (key, val) => {
    setForm((prev) => ({ ...prev, [key]: val }))
  }

  const handleSubmit = async () => {
    const payload = {
      ...form,
      walletBalance: Number(form.walletBalance),
      totalInvested: Number(form.totalInvested),
    }

    try {
      const res = await fetchData({
        url: `/api/v1/admin/user/update-a-user/${userId}`,
        method: 'post',
        data: payload,
      })

      if (res.success) {
        toast.success('User updated successfully')
        navigate(-1)
      } else {
        toast.error(res.message || 'Update failed')
      }
    } catch (err) {
      console.error(err)
      toast.error('Error while updating user')
    }
  }

  const handleReset = () => {
    if (user) {
      setForm({
        sponsor: user.sponsor || '',
        userId: user.userId || '',
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        walletBalance: user.walletBalance || 0,
        password: '',
        isActivated: isActivated ?? user.isActivated,
        totalInvested: user.totalInvested || 0,
      })
    }
  }

  return (
    <CCard className="p-3">
      {loading && <LoadingSpinner />}
      <CCardBody>
        {/* Sponsor & User ID */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput label="Sponsor ID" value={form.sponsor} disabled />
          </CCol>
          <CCol md={6}>
            <CFormInput label="User ID" value={form.userId} disabled />
          </CCol>
        </CRow>

        {/* Name & Phone */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              label="Name"
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
            />
          </CCol>
          <CCol md={6}>
            <CFormInput
              label="Mobile"
              value={form.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
            />
          </CCol>
        </CRow>

        {/* Email */}
        <CRow className="mb-3">
          <CCol md={12}>
            <CFormInput
              label="Email"
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
            />
          </CCol>
        </CRow>

        {/* Wallet Balance & Total Invested */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              label="Update Password"
              type="password"
              placeholder="Enter new password"
              value={form.forAdminPass}
              onChange={(e) => handleChange('password', e.target.value)}
            />
          </CCol>
          {/* <CCol md={6}>
            <CFormInput
              label="Total Invested"
              type="number"
              value={form.totalInvested}
              onChange={(e) => handleChange('totalInvested', e.target.value)}
            />
          </CCol> */}
        </CRow>

        {/* Password */}
        {/* <CRow className="mb-3">

        </CRow> */}

        {/* IsActivated Toggle */}
        <CRow className="mb-3">
          <CCol md={6}>
            <CFormInput
              label="Wallet Balance"
              type="number"
              value={form.walletBalance}
              onChange={(e) => handleChange('walletBalance', e.target.value)}
            />
          </CCol>
          <CCol md={6} className="d-flex flex-column justify-content-center">
            <label className="fw-bold mb-2">Activation Status:</label>
            <CFormSwitch
              label={form.isActivated ? 'Activated' : 'Deactivated'}
              checked={form.isActivated}
              onChange={(e) => handleChange('isActivated', e.target.checked)}
            />
          </CCol>
        </CRow>


        {/* Buttons */}
        <CRow className="mt-4">
          <CCol className="d-flex gap-2">
            <CButton color="primary" onClick={handleSubmit}>
              Update
            </CButton>
            <CButton color="secondary" onClick={handleReset}>
              Reset
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default Updateuser
