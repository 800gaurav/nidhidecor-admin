import React, { useEffect, useMemo, useState } from 'react'
import {
  CBadge,
  CButton,
  CCard,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSelect,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CSpinner,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Swal from 'sweetalert2'
import useAxios, { imgBaseUrl } from '../../hooks/useAxios'
import ImagePreviewModal from '../common/ImageViewModal'
import LoadingSpinner from '../common/LoadinSpinner'
import Export from '../../views/Export'
import color from '../../views/color'

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

const money = (value) => `Rs ${Number(value || 0).toLocaleString('en-IN')}`

const ProductCreate = () => {
  const { fetchData, loading } = useAxios()
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [visible, setVisible] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [filterText, setFilterText] = useState('')
  const [formData, setFormData] = useState(initialForm)
  const [preview, setPreview] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const itemsPerPage = 10

  const normalizePath = (path) => path?.replace(/\\/g, '/')
  const getProductImageUrl = (path) => {
    if (!path) return ''
    if (/^https?:\/\//i.test(path)) return path
    return `${imgBaseUrl}${normalizePath(path)}`
  }

  const fetchProducts = async () => {
    try {
      const res = await fetchData({ url: '/api/v1/admin/product/get-all', method: 'GET' })
      if (res?.success) setProducts(res.data || [])
      else toast.error('No products found')
    } catch (error) {
      toast.error('Failed to fetch products')
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const filteredProducts = useMemo(() => {
    const term = filterText.toLowerCase().trim()
    if (!term) return products
    return products.filter((item) =>
      [item.title, item.productCode, item.handle, item.vendor, item.category, item.status]
        .some((value) => String(value || '').toLowerCase().includes(term)),
    )
  }, [products, filterText])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage))
  const indexOfFirst = (currentPage - 1) * itemsPerPage
  const currentItems = filteredProducts.slice(indexOfFirst, indexOfFirst + itemsPerPage)

  const resetForm = () => {
    setFormData(initialForm)
    setPreview(null)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => {
      const next = { ...prev, [name]: value }
      if (name === 'dp' && !prev.sp) next.sp = value
      return next
    })
  }

  const handleImageFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setFormData((prev) => ({ ...prev, imageFile: file, image: '' }))
    setPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.title || !formData.dp) {
      toast.error('Title and price are required')
      return
    }

    const postData = new FormData()
    const payload = {
      handle: formData.handle,
      title: cleanText(formData.title),
      description: cleanText(formData.description),
      vendor: formData.vendor,
      category: formData.category || 'Uncategorized',
      productCode: formData.productCode,
      inventoryQty: Number(formData.inventoryQty || 0),
      dp: Number(formData.dp || 0),
      mrp: Number(formData.mrp || formData.dp || 0),
      sp: Number(formData.sp || formData.dp || 0),
      status: formData.status,
      image: formData.image,
    }

    Object.entries(payload).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') postData.append(key, value)
    })
    if (formData.imageFile) postData.append('image', formData.imageFile)

    try {
      setIsSubmitting(true)
      const res = await fetchData({ url: '/api/v1/admin/product/create', method: 'POST', data: postData })
      if (res.success) {
        toast.success('Product created successfully')
        setProducts((prev) => [res.data, ...prev])
        setVisible(false)
        resetForm()
      } else {
        toast.error(res.message || 'Failed to create product')
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to create product')
    } finally {
      setIsSubmitting(false)
    }
  }

  const deleteProduct = async (productId) => {
    const result = await Swal.fire({
      title: 'Delete product?',
      text: 'This product will be removed from listing.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#dc3545',
    })

    if (!result.isConfirmed) return

    try {
      const res = await fetchData({ url: `/api/v1/admin/product/delete/${productId}`, method: 'DELETE' })
      if (res?.success) {
        toast.success('Product deleted successfully')
        fetchProducts()
      }
    } catch (error) {
      toast.error('Failed to delete product')
    }
  }

  const PaginationControls = () => (
    <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
      <div className="text-muted">
        Showing {filteredProducts.length ? indexOfFirst + 1 : 0} to{' '}
        {Math.min(indexOfFirst + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} products
      </div>
      <div className="d-flex gap-1 flex-wrap">
        {Array.from({ length: totalPages }, (_, i) => i + 1).slice(0, 8).map((page) => (
          <CButton
            key={page}
            size="sm"
            color={page === currentPage ? 'dark' : 'light'}
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </CButton>
        ))}
      </div>
    </div>
  )

  const exportFields = [
    { key: 'productCode', label: 'SKU' },
    { key: 'title', label: 'Title' },
    { key: 'vendor', label: 'Vendor' },
    { key: 'category', label: 'Category' },
    { key: 'dp', label: 'Price' },
    { key: 'mrp', label: 'MRP' },
    { key: 'inventoryQty', label: 'Inventory' },
    { key: 'status', label: 'Status' },
  ]

  return (
    <CCard className="mb-4">
      {loading && <LoadingSpinner />}
      <CCardBody>
        <div className="d-flex flex-column flex-lg-row gap-2 justify-content-between align-items-lg-center mb-3">
          <CCol lg={5} className="p-0">
            <CFormInput
              placeholder="Search title, SKU, vendor, category, status"
              value={filterText}
              onChange={(e) => {
                setFilterText(e.target.value)
                setCurrentPage(1)
              }}
            />
          </CCol>
          <div className="d-flex gap-2 flex-wrap">
            <CButton
              onClick={() => setVisible(true)}
              style={{
                background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
                color: 'white',
              }}
            >
              + Add Product
            </CButton>
            <Export userdata={products} fields={exportFields} />
          </div>
        </div>

        <CModal alignment="center" visible={visible} onClose={() => setVisible(false)} size="lg">
          <CModalHeader onClose={() => setVisible(false)}>
            <strong>Add Product</strong>
          </CModalHeader>
          <CModalBody>
            <CForm onSubmit={handleSubmit}>
              <div className="row g-3">
                <div className="col-md-8">
                  <CFormLabel>Title *</CFormLabel>
                  <CFormInput name="title" value={formData.title} onChange={handleInputChange} required />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Handle</CFormLabel>
                  <CFormInput name="handle" value={formData.handle} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <CFormLabel>SKU / Product Code</CFormLabel>
                  <CFormInput name="productCode" value={formData.productCode} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Vendor</CFormLabel>
                  <CFormInput name="vendor" value={formData.vendor} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Category</CFormLabel>
                  <CFormInput name="category" value={formData.category} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                  <CFormLabel>Price *</CFormLabel>
                  <CFormInput name="dp" type="number" min="0" step="0.01" value={formData.dp} onChange={handleInputChange} required />
                </div>
                <div className="col-md-3">
                  <CFormLabel>Compare Price</CFormLabel>
                  <CFormInput name="mrp" type="number" min="0" step="0.01" value={formData.mrp} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                  <CFormLabel>SP</CFormLabel>
                  <CFormInput name="sp" type="number" min="0" step="0.01" value={formData.sp} onChange={handleInputChange} />
                </div>
                <div className="col-md-3">
                  <CFormLabel>Inventory Qty</CFormLabel>
                  <CFormInput name="inventoryQty" type="number" min="0" value={formData.inventoryQty} onChange={handleInputChange} />
                </div>
                <div className="col-md-4">
                  <CFormLabel>Status</CFormLabel>
                  <CFormSelect name="status" value={formData.status} onChange={handleInputChange}>
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </CFormSelect>
                </div>
                <div className="col-md-8">
                  <CFormLabel>Image URL</CFormLabel>
                  <CFormInput name="image" value={formData.image} onChange={handleInputChange} placeholder="https://..." />
                </div>
                <div className="col-md-6">
                  <CFormLabel>Upload Image</CFormLabel>
                  <CFormInput type="file" accept="image/*" onChange={handleImageFileChange} />
                </div>
                <div className="col-md-6">
                  {(preview || formData.image) && (
                    <img
                      src={preview || formData.image}
                      alt="Preview"
                      style={{ width: '160px', height: '90px', objectFit: 'contain', border: '1px solid #ddd', borderRadius: 8 }}
                    />
                  )}
                </div>
                <div className="col-12">
                  <CFormLabel>Description</CFormLabel>
                  <CFormTextarea name="description" value={formData.description} onChange={handleInputChange} rows={3} />
                </div>
              </div>
            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={() => setVisible(false)}>Cancel</CButton>
            <CButton color="primary" onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? <CSpinner size="sm" /> : 'Create Product'}
            </CButton>
          </CModalFooter>
        </CModal>

        <div className="table-responsive">
          <CTable align="middle" hover responsive className="border">
            <CTableHead color="light">
              <CTableRow>
                <CTableHeaderCell style={{ width: 70 }}>#</CTableHeaderCell>
                <CTableHeaderCell style={{ width: 100 }}>Image</CTableHeaderCell>
                <CTableHeaderCell>Product</CTableHeaderCell>
                <CTableHeaderCell>Vendor / Category</CTableHeaderCell>
                <CTableHeaderCell className="text-end">Price</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Stock</CTableHeaderCell>
                <CTableHeaderCell className="text-center">Status</CTableHeaderCell>
                <CTableHeaderCell className="text-center" style={{ width: 150 }}>Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {currentItems.length ? (
                currentItems.map((product, index) => (
                  <CTableRow key={product._id}>
                    <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                    <CTableDataCell>
                      {product.image ? (
                        <img
                          src={getProductImageUrl(product.image)}
                          alt={product.title}
                          style={{ width: 72, height: 54, objectFit: 'contain', borderRadius: 6, cursor: 'pointer', background: '#f8f9fa' }}
                          onClick={() => setSelectedImage(getProductImageUrl(product.image))}
                        />
                      ) : (
                        <span className="text-muted">No image</span>
                      )}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div className="fw-semibold text-dark">{cleanText(product.title) || 'Untitled'}</div>
                      <div className="small text-muted">SKU: {product.productCode || product.handle || '-'}</div>
                      {product.description && <div className="small text-muted text-truncate" style={{ maxWidth: 360 }}>{cleanText(product.description)}</div>}
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{product.vendor || '-'}</div>
                      <div className="small text-muted">{product.category || 'Uncategorized'}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-end">
                      <div className="fw-semibold">{money(product.dp)}</div>
                      {Number(product.mrp) > Number(product.dp) && <div className="small text-muted text-decoration-line-through">{money(product.mrp)}</div>}
                      <div className="small text-muted">SP: {Number(product.sp || 0).toLocaleString('en-IN')}</div>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">{product.inventoryQty ?? 0}</CTableDataCell>
                    <CTableDataCell className="text-center">
                      <CBadge color={product.status === 'active' ? 'success' : product.status === 'draft' ? 'warning' : 'secondary'}>
                        {product.status || 'active'}
                      </CBadge>
                    </CTableDataCell>
                    <CTableDataCell className="text-center">
                      <div className="d-flex justify-content-center gap-2">
                        <CButton size="sm" color="info" className="text-white" onClick={() => navigate(`/product/update/${product._id}`, { state: { user: product } })}>
                          Edit
                        </CButton>
                        <CButton size="sm" color="danger" onClick={() => deleteProduct(product._id)}>
                          Delete
                        </CButton>
                      </div>
                    </CTableDataCell>
                  </CTableRow>
                ))
              ) : (
                <CTableRow>
                  <CTableDataCell colSpan={8} className="text-center text-muted py-4">No products found</CTableDataCell>
                </CTableRow>
              )}
            </CTableBody>
          </CTable>
        </div>

        <PaginationControls />

        <ImagePreviewModal imageUrl={selectedImage} isOpen={!!selectedImage} onClose={() => setSelectedImage(null)} />
      </CCardBody>
    </CCard>
  )
}

export default ProductCreate
