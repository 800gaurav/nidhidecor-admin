import React, { useEffect, useState, useMemo, useCallback } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilUser, cilCheck, cilWarning, cilReload, cilChartLine,
  cilPeople, cilDollar, cilWallet, cilListRich, cilCash,
  cilArrowTop, cilArrowBottom
} from '@coreui/icons'
import {
  CCol, CRow, CSpinner, CAlert, CCard, CCardBody, CCardHeader,
  CButton, CBadge, CContainer, CFormInput, CNav, CNavItem, CNavLink
} from '@coreui/react'
import { CChartDoughnut, CChartLine } from '@coreui/react-chartjs'

import useAxios from '../../hooks/useAxios'
import useAuth from '../../hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import apiRoutes from '../../variables/apiRoutes'
import color from '../color'

// Format helpers
const formatNumber = (n) => new Intl.NumberFormat().format(Number(n ?? 0))
const formatCurrency = (n) =>
  `₹${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(n ?? 0))}`

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)

  const [error, setError] = useState(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [activeTab, setActiveTab] = useState('withdrawal')


  const { user } = useAuth()
  const navigate = useNavigate()
  const { fetchData, loading } = useAxios()

  const getDashboardDetails = useCallback(async () => {
    try {
      setError(null)
      setIsRefreshing(true)
      const res = await fetchData({ url: apiRoutes.dashboardDetails, method: 'GET' })
      if (res?.data) setDashboardData(res.data)
      else setError('No data available')
    } catch (error) {
      setError(error.message || 'Failed to load dashboard data')
    } finally {
      setIsRefreshing(false)
    }
  }, [fetchData])





  useEffect(() => {
    getDashboardDetails()

  }, [])
















  // Metric Cards (unchanged as requested)
  const keyMetrics = [
    {
      label: 'Total Users',
      value: formatNumber(dashboardData?.totalUsers),
      icon: cilPeople,
      color: color.white,
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },
    {
      label: 'Active Users',
      value: formatNumber(dashboardData?.totalActiveUsers),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/active-users',
    },

    {
      label: 'Purchase Amount',
      value: formatCurrency(dashboardData?.totalApprovedOrderAmount),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/suspended/users',
    },
    {
      label: 'Today Joining',
      value: formatNumber(dashboardData?.todayJoinedUsers),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },
    {
      label: 'Total Withdraw',
      value: formatCurrency(dashboardData?.totalApprovedWithdraw),
      icon: cilDollar,
      color: '#22c55e',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
    },
    {
      label: 'Today All User Income',
      value: formatCurrency(dashboardData?.todayTotalIncome),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },
    {
      label: 'Total Wallet balance',
      value: formatCurrency(dashboardData?.totalWalletBalance),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },
    {
      label: 'User Total Income',
      value: formatCurrency(dashboardData?.totalIncome),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },

    {
      label: 'Pending Withdrawal',
      value: formatNumber(dashboardData?.totalPendingWithdraw),
      icon: cilPeople,
      color: '#3b82f6',
      bg: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 100%)`,
      route: '/users-allusers',
    },
  


  ]

  if (loading && !dashboardData) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: '60vh' }}>
        <CSpinner color="primary" size="lg" />
      </div>
    )
  }

  return (
    <CContainer fluid className="p-4 dashboard-container">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fw-bold mb-1">Admin Dashboard</h2>
          <p className="text-muted mb-0">Welcome back, {user?.name || 'Admin'} 👋</p>
        </div>
        {/* <CButton color="primary" onClick={getDashboardDetails} disabled={isRefreshing}>
          <CIcon icon={cilReload} className={`me-2 ${isRefreshing ? 'spin' : ''}`} />
          {isRefreshing ? 'Refreshing...' : 'Refresh'}
        </CButton> */}
      </div>

      {error && (
        <CAlert color="danger">
          <CIcon icon={cilWarning} className="me-2" />
          {error}
        </CAlert>
      )}

      {/* Metrics */}
      <CRow className="g-4 mb-4">
        {keyMetrics.map((m, i) => (
          <CCol xs={12} sm={6} xl={3} key={i}>
            <CCard
              className="metric-card text-white border-0 shadow-sm"
              style={{ background: m.bg, cursor: m.route ? 'pointer' : 'default' }}
              onClick={() => m.route && navigate(m.route)}
            >
              <CCardBody>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div>
                    <h7 className="text-white-50 mb-1">{m.label}</h7>
                    <h4 className="fw-bold mb-0">{m.value}</h4>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        ))}
      </CRow>



    </CContainer>
  )
}

export default Dashboard
