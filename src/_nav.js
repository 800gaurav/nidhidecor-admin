import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilPeople,
  cilCash,
  cilMoney,
  cilChart,
  cilUser,
  cilWallet,
  cilSettings,
  cilShieldAlt,
  cilDollar,
  cilGraph
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'User Management',
  },
  {
    component: CNavGroup,
    name: 'Users',
    to: '/users',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'All Users',
        to: '/users-allusers',
      },
      {
        component: CNavItem,
        name: 'Active Users',
        to: '/active-users',
      },
      {
        component: CNavItem,
        name: 'Pending Users',
        to: '/pending/users',
      },
      {
        component: CNavItem,
        name: 'Suspended Users',
        to: '/suspended/users',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'MLM System',
  },
  {
    component: CNavItem,
    name: 'Add Purchase',
    to: '/manual-purchase/add',
    icon: <CIcon icon={cilCash} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Purchase History',
    to: '/manual-purchase/history',
    icon: <CIcon icon={cilChart} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Tree View',
    to: '/tree',
    icon: <CIcon icon={cilGraph} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Income Reports',
  },
  {
    component: CNavGroup,
    name: 'Income',
    to: '/income',
    icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Direct Income',
        to: '/earnings-report',
      },
      {
        component: CNavItem,
        name: 'Binary Matching',
        to: '/pair-history',
      },
      {
        component: CNavItem,
        name: 'Bonus History',
        to: '/bounus-history',
      },
      {
        component: CNavItem,
        name: 'Level Users',
        to: '/level-users/all',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Withdrawals',
  },
  {
    component: CNavGroup,
    name: 'Withdrawals',
    to: '/withdrawals',
    icon: <CIcon icon={cilWallet} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pending',
        to: '/pending-withDrawals',
      },
      {
        component: CNavItem,
        name: 'Approved',
        to: '/success-withdrawals',
      },
      {
        component: CNavItem,
        name: 'Rejected',
        to: '/rejected-withdrawals',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'KYC Management',
  },
  {
    component: CNavGroup,
    name: 'KYC',
    to: '/kyc',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'User KYC',
        to: '/user/kyc',
      },
      {
        component: CNavItem,
        name: 'Bank KYC',
        to: '/bank/kyc',
      },
    ],
  },

  {
    component: CNavTitle,
    name: 'Settings',
  },
  {
    component: CNavItem,
    name: 'Payment Settings',
    to: '/payment-create',
    icon: <CIcon icon={cilSettings} customClassName="nav-icon" />,
  },
]

export default _nav
