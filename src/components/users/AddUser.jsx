import React, { useState } from 'react'
import {
  CAlert,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormCheck,
  CFormInput,
  CFormLabel,
  CRow,
  CSpinner,
} from '@coreui/react'
import useAxios from '../../hooks/useAxios'

const initialForm = {
  name: '',
  phone: '',
  email: '',
  password: '',
  referralCode: '',
  isActivated: false,
}

const AddUser = () => {
  const { fetchData } = useAxios()
  const [formData, setFormData] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState({ show: false, message: '', color: '' })

  const showAlert = (message, color) => {
    setAlert({ show: true, message, color })
    setTimeout(() => setAlert({ show: false, message: '', color: '' }), 5000)
  }

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.name || !formData.phone || !formData.password) {
      showAlert('Name, phone and password are required', 'warning')
      return
    }

    setLoading(true)
    try {
      const payload = {
        ...formData,
        referralCode: formData.referralCode.trim() || undefined,
      }
      const res = await fetchData({
        url: '/api/v1/admin/user/add',
        method: 'POST',
        data: payload,
      })

      if (res.success) {
        showAlert(`User added successfully. User ID: ${res.data.user.userId}`, 'success')
        setFormData(initialForm)
      }
    } catch (error) {
      showAlert(error?.message || 'Failed to add user', 'danger')
    } finally {
      setLoading(false)
    }
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>Add User</strong>
          </CCardHeader>
          <CCardBody>
            {alert.show && (
              <CAlert color={alert.color} dismissible onClose={() => setAlert({ show: false })}>
                {alert.message}
              </CAlert>
            )}

            <CForm onSubmit={handleSubmit}>
              <CRow>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Name *</CFormLabel>
                  <CFormInput name="name" value={formData.name} onChange={handleChange} required />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Phone *</CFormLabel>
                  <CFormInput type="number" name="phone" value={formData.phone} onChange={handleChange} required />
                </CCol>
                <CCol md={4} className="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput type="email" name="email" value={formData.email} onChange={handleChange} />
                </CCol>
              </CRow>

              <CRow>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Password *</CFormLabel>
                  <CFormInput type="text" name="password" value={formData.password} onChange={handleChange} required />
                </CCol>
                <CCol md={6} className="mb-3">
                  <CFormLabel>Referral Code</CFormLabel>
                  <CFormInput name="referralCode" value={formData.referralCode} onChange={handleChange} placeholder="Optional" />
                </CCol>
              </CRow>

              {/* <div className="mb-3">
                <CFormCheck
                  id="isActivated"
                  name="isActivated"
                  label="Mark user active"
                  checked={formData.isActivated}
                  onChange={handleChange}
                />
              </div> */}

              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton type="submit" color="primary" disabled={loading}>
                  {loading ? <><CSpinner size="sm" className="me-2" />Adding...</> : 'Add User'}
                </CButton>
              </div>
            </CForm>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default AddUser
