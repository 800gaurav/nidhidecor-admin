import React, { useEffect, useState } from 'react'
import {
  CRow,
  CCol,
  CFormInput,
  CButton,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CCard,
  CCardBody,
  CCardHeader,
  CBadge,
} from '@coreui/react'
import toast from 'react-hot-toast'
import LoadingSpinner from '../components/common/LoadinSpinner'
import useAxios from '../hooks/useAxios'
import color from '../views/color'
import Export from '../views/Export'

function DirectIncomeReport() {
  const { fetchData, loading } = useAxios()

  const [history, setHistory] = useState([])
  const [filtered, setFiltered] = useState([])
  const [summary, setSummary] = useState(null)
  const [filters, setFilters] = useState({
    userId: '',
    from: '',
    to: '',
    paymenttype: '',
  })
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchIncomeReport = async () => {
    try {
      const params = new URLSearchParams()
      if (filters.userId) params.append('userId', filters.userId)
      if (filters.from) params.append('startDate', filters.from)
      if (filters.to) params.append('endDate', filters.to)
      if (filters.paymenttype) params.append('paymenttype', filters.paymenttype)

      const res = await fetchData({
        url: `/api/v1/admin/income-report/all?${params}`
      })

      if (res?.success) {
        setHistory(res.data.incomes)
        setFiltered(res.data.incomes)
        setSummary(res.data.summary)
      } else {
        toast.error('No income history found')
      }
    } catch (err) {
      toast.error('Failed to fetch income history')
      console.error(err)
    }
  }

  useEffect(() => {
    fetchIncomeReport()
  }, [])

  const handleSearch = () => {
    fetchIncomeReport()
    setCurrentPage(1)
  }

  const handleReset = () => {
    setFilters({ userId: '', from: '', to: '', paymenttype: '' })
    setCurrentPage(1)
    setTimeout(() => {
      fetchIncomeReport()
    }, 100)
  }

  const indexOfLast = currentPage * itemsPerPage
  const indexOfFirst = indexOfLast - itemsPerPage
  const currentItems = filtered.slice(indexOfFirst, indexOfLast)
  const totalPages = Math.ceil(filtered.length / itemsPerPage)

  const generatePageNumbers = (currentPage, totalPages) => {
    const pages = []

    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
      }
    }

    return pages
  }

  const fields = [
    { key: "userId", label: "User Id" },
    { key: "amount", label: "Amount" },
    { key: "paymenttype", label: "Payment Type" },
    // { key: "slsp", label: "Left SP" },
    // { key: "srsp", label: "Right SP" },
  ]

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount || 0)
  }

  const getPaymentTypeBadge = (type) => {
    const badges = {
      'Direct Referral Income': 'success',
      'Sales Incentive Income': 'primary',
      'Sales Bonus Income': 'warning',
    }
    return badges[type] || 'secondary'
  }

  return (
    <>
      {loading && <LoadingSpinner />}

      {/* Summary Cards */}
      {summary && (
        <CRow className="mb-4">
          <CCol md={4}>
            <CCard className="text-center">
              <CCardBody>
                <h6 className="text-muted">Total Records</h6>
                <h3 className="mb-0">{summary.totalRecords}</h3>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="text-center">
              <CCardBody>
                <h6 className="text-muted">Total Amount Distributed</h6>
                <h3 className="mb-0 text-success">{formatCurrency(summary.totalAmount)}</h3>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol md={4}>
            <CCard className="text-center">
              <CCardBody>
                <h6 className="text-muted">Income Types</h6>
                <h3 className="mb-0">{Object.keys(summary.byType || {}).length}</h3>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      )}

      {/* Filters */}
      <CCard className="mb-4">
        <CCardHeader>
          <strong>Filters</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="mb-3">
            <CCol md={3}>
              <CFormInput
                label="User ID"
                placeholder="Enter User ID"
                value={filters.userId}
                onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                type="date"
                label="From Date"
                value={filters.from}
                onChange={(e) => setFilters({ ...filters, from: e.target.value })}
              />
            </CCol>
            <CCol md={2}>
              <CFormInput
                type="date"
                label="To Date"
                value={filters.to}
                onChange={(e) => setFilters({ ...filters, to: e.target.value })}
              />
            </CCol>
            {/* <CCol md={2}>
              <label className="form-label">Payment Type</label>
              <select
                className="form-select"
                value={filters.paymenttype}
                onChange={(e) => setFilters({ ...filters, paymenttype: e.target.value })}
              >
                <option value="">All Types</option>
                <option value="Direct Referral Income">Direct Referral</option>
                <option value="Sales Incentive Income">Binary Matching</option>
                <option value="Sales Bonus Income">Bonus</option>
              </select>
            </CCol> */}
            <CCol md={3} className="d-flex align-items-end gap-2">
              <CButton
                color="primary"
                onClick={handleSearch}
                style={{
                  background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                  color: 'white',
                }}
              >
                Search
              </CButton>
              <CButton color="secondary" onClick={handleReset}>
                Reset
              </CButton>
              {/* <Export userdata={history} fields={fields} /> */}
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>

      {/* Table */}
      <CCard>
        <CCardHeader>
          <strong>Income History</strong>
        </CCardHeader>
        <CCardBody>
          <div className="table-responsive">
            <CTable hover bordered className="text-nowrap">
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell>User ID</CTableHeaderCell>
                  <CTableHeaderCell>User Name</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Payment Type</CTableHeaderCell>
                  {/* <CTableHeaderCell>Left SP</CTableHeaderCell>
                  <CTableHeaderCell>Right SP</CTableHeaderCell>
                  <CTableHeaderCell>Carry Left</CTableHeaderCell>
                  <CTableHeaderCell>Carry Right</CTableHeaderCell> */}
                  <CTableHeaderCell>Date</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {currentItems.length === 0 ? (
                  <CTableRow>
                    <CTableDataCell colSpan="10" className="text-center">
                      No income records found
                    </CTableDataCell>
                  </CTableRow>
                ) : (
                  currentItems.map((item, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                      <CTableDataCell>
                        <strong>{item?.userId || "N/A"}</strong>
                      </CTableDataCell>
                      <CTableDataCell>{item?.user_id?.name || "N/A"}</CTableDataCell>
                      <CTableDataCell>
                        <strong className="text-success">{formatCurrency(item?.amount)}</strong>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CBadge color={getPaymentTypeBadge(item?.paymenttype)}>
                          {item?.paymenttype || "N/A"}
                        </CBadge>
                      </CTableDataCell>
                      {/* <CTableDataCell>{item?.slsp || 0}</CTableDataCell>
                      <CTableDataCell>{item?.srsp || 0}</CTableDataCell>
                      <CTableDataCell>{item?.carryslsp || 0}</CTableDataCell>
                      <CTableDataCell>{item?.carrysrsp || 0}</CTableDataCell> */}
                      <CTableDataCell>
                        {new Date(item.createdAt).toLocaleString('en-IN')}
                      </CTableDataCell>
                    </CTableRow>
                  ))
                )}
              </CTableBody>
            </CTable>
          </div>

          {/* Pagination */}
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
            </div>

            <div>
              {generatePageNumbers(currentPage, totalPages).map((page, index) =>
                page === '...' ? (
                  <CButton key={`ellipsis-${index}`} size="sm" color="light" className="me-1" disabled>
                    ...
                  </CButton>
                ) : (
                  <CButton
                    key={page}
                    size="sm"
                    color={page === currentPage ? 'dark' : 'light'}
                    className="me-1"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </CButton>
                )
              )}
            </div>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default DirectIncomeReport
