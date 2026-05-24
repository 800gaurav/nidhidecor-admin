import React, { useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CRow,
  CSpinner,
} from '@coreui/react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios, { imgBaseUrl } from '../../hooks/useAxios'
import LoadingSpinner from '../common/LoadinSpinner'

const initialForm = {
  handle: '',
  title: '',
  description: '',
  vendor: '',
  category: 'Uncategorized',
  productCode: '',
  inventoryQty: 0,
  dp: '',
  mrp: '',
  sp: '',
  status: 'active',
  image: '',
  imageFile: null,
}

const cleanText = (value = '') =>
  String(value)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/\s+/g, ' ')
    .trim()

const getImageUrl = (path) => {
  if (!path) return ''
  if (/^https?:\/\//i.test(path)) return path
  return `${imgBaseUrl}${path.replace(/\\/g, '/')}`
}

const UpdateProduct = () => {
  const { userId } = useParams()
  const location = useLocation()
  const product = location.state?.user
  const navigate = useNavigate()
  const { fetchData, loading } = useAxios()
  const [form, setForm] = useState(initialForm)
  const [preview, setPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!product) return
    setForm({
      handle: product.handle || '',
      title: cleanText(product.title) || '',
      description: cleanText(product.description) || '',
      vendor: product.vendor || '',
      category: product.category || 'Uncategorized',
      productCode: product.productCode || '',
      inventoryQty: product.inventoryQty ?? 0,
      dp: product.dp || '',
      mrp: product.mrp || '',
      sp: product.sp || '',
      status: product.status || 'active',
      image: product.image || '',
      imageFile: null,
    })
    setPreview(getImageUrl(product.image))
  }, [product])

  const handleChange = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value }
      if (key === 'dp' && !prev.sp) next.sp = value
      return next
    })
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setForm((prev) => ({ ...prev, imageFile: file, image: '' }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.dp) {
      toast.error('Title and price are required')
      return
    }

    const formData = new FormData()
    const payload = {
      handle: form.handle,
      title: cleanText(form.title),
      description: cleanText(form.description),
      vendor: form.vendor,
      category: form.category || 'Uncategorized',
      productCode: form.productCode,
      inventoryQty: Number(form.inventoryQty || 0),
      dp: Number(form.dp || 0),
      mrp: Number(form.mrp || form.dp || 0),
      sp: Number(form.sp || form.dp || 0),
      status: form.status,
      image: form.image,
    }

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') formData.append(key, value)
    })
    if (form.imageFile) formData.append('image', form.imageFile)

    try {
      setIsSubmitting(true)
      const res = await fetchData({
        url: `/api/v1/admin/product/update/${userId}`,
        method: 'put',
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      if (res.success) {
        toast.success('Product updated successfully')
        navigate('/product/create')
      } else {
        toast.error(res.message || 'Update failed')
      }
    } catch (err) {
      toast.error(err?.message || 'Error while updating product')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <CCard className="p-3">
      {loading && <LoadingSpinner />}
      <CCardBody>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Update Product</h5>
          <CButton color="secondary" variant="outline" onClick={() => navigate('/product/create')}>Back</CButton>
        </div>

        <CForm onSubmit={handleSubmit}>
          <CRow className="g-3">
            <CCol md={8}>
              <CFormLabel>Title *</CFormLabel>
              <CFormInput value={form.title} onChange={(e) => handleChange('title', e.target.value)} required />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Handle</CFormLabel>
              <CFormInput value={form.handle} onChange={(e) => handleChange('handle', e.target.value)} />
            </CCol>
            <CCol md={4}>
              <CFormLabel>SKU / Product Code</CFormLabel>
              <CFormInput value={form.productCode} onChange={(e) => handleChange('productCode', e.target.value)} />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Vendor</CFormLabel>
              <CFormInput value={form.vendor} onChange={(e) => handleChange('vendor', e.target.value)} />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Category</CFormLabel>
              <CFormInput value={form.category} onChange={(e) => handleChange('category', e.target.value)} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Price *</CFormLabel>
              <CFormInput type="number" min="0" step="0.01" value={form.dp} onChange={(e) => handleChange('dp', e.target.value)} required />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Compare Price</CFormLabel>
              <CFormInput type="number" min="0" step="0.01" value={form.mrp} onChange={(e) => handleChange('mrp', e.target.value)} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>SP</CFormLabel>
              <CFormInput type="number" min="0" step="0.01" value={form.sp} onChange={(e) => handleChange('sp', e.target.value)} />
            </CCol>
            <CCol md={3}>
              <CFormLabel>Inventory Qty</CFormLabel>
              <CFormInput type="number" min="0" value={form.inventoryQty} onChange={(e) => handleChange('inventoryQty', e.target.value)} />
            </CCol>
            <CCol md={4}>
              <CFormLabel>Status</CFormLabel>
              <CFormSelect value={form.status} onChange={(e) => handleChange('status', e.target.value)}>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </CFormSelect>
            </CCol>
            <CCol md={8}>
              <CFormLabel>Image URL</CFormLabel>
              <CFormInput value={form.image} onChange={(e) => {
                handleChange('image', e.target.value)
                setPreview(e.target.value)
              }} />
            </CCol>
            <CCol md={6}>
              <CFormLabel>Upload Image</CFormLabel>
              <CFormInput type="file" accept="image/*" onChange={handleFileChange} />
            </CCol>
            <CCol md={6}>
              {preview ? (
                <img src={preview} alt="Preview" style={{ width: '180px', height: '90px', objectFit: 'contain', borderRadius: 8, border: '1px solid #ddd' }} />
              ) : (
                <p className="text-muted mb-0">No image</p>
              )}
            </CCol>
            <CCol xs={12}>
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea value={form.description} onChange={(e) => handleChange('description', e.target.value)} rows={3} />
            </CCol>
          </CRow>

          <div className="d-flex gap-2 mt-4">
            <CButton color="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? <CSpinner size="sm" /> : 'Update Product'}
            </CButton>
            <CButton color="secondary" type="button" onClick={() => navigate('/product/create')}>Cancel</CButton>
          </div>
        </CForm>
      </CCardBody>
    </CCard>
  )
}

export default UpdateProduct
