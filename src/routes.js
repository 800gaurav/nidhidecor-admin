import React from 'react'

// User Management
import allusers from './users/allusers'
import activerusers from './users/activerusers'
import SuspendedUsers from './views/pages/member/SuspendedUsers'
import PendingUsersWithFilter from './components/common/Table/DynamicTable'
import Updateuser from './admin/Updateuser'
import AddUser from './components/users/AddUser'

// Income Reports
import directIncomeReport from './incomeReport/directIncomeReport'
import BounusHistory from './incomeReport/BounusHistory'
import PairHistory from './incomeReport/PairHistory'
import levelUsers from './incomeReport/levelusers'

// Withdrawals
import PendingWithdrawals from './Withdrawals/PendingWithdrawals'
import SuccessWithdrawals from './Withdrawals/SuccessWithdrawals'
import WithdrawalsRejected from './Withdrawals/WithdrawalsRejected'

// KYC
import UserKyc from './views/base/customPage/UserKyc'
import BankKYC from './views/base/customPage/BankKyc'

// Payment Settings


// Tree View
const TreeView = React.lazy(() => import('./components/treeView/index'))

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))

// User Dashboard & Profile
const UserDashboard = React.lazy(() => import('./components/user/Dashboard'))
const UserProfile = React.lazy(() => import('./components/user/Profile'))

// Manual Purchase Components
const ManualPurchaseAdd = React.lazy(() => import('./components/manualPurchase/AddPurchase'))
const ManualPurchaseHistory = React.lazy(() => import('./components/manualPurchase/PurchaseHistory'))
const ProductCreate = React.lazy(() => import('./components/product/ProductCreate'))
const UpdateProduct = React.lazy(() => import('./components/product/UpdateProduct'))
const PendingOrders = React.lazy(() => import('./views/base/Orders/PendingOrders'))
const ApproveOrder = React.lazy(() => import('./views/base/Orders/ApproveOrder'))
const RejectedOrder = React.lazy(() => import('./views/base/Orders/RejectedOrder'))

const routes = [
  { path: '/', name: '', element: Dashboard },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },

  // User Management
  { path: '/users-allusers', name: 'All Users', element: allusers },
  { path: '/users/add', name: 'Add User', element: AddUser },
  { path: '/active-users', exact: true, name: 'Active Users', element: activerusers },
  { path: '/pending/users', name: 'Pending Users', element: PendingUsersWithFilter },
  { path: '/suspended/users', name: 'Suspended Users', element: SuspendedUsers },
  { path: '/user/update/:userId', name: 'Update User', element: Updateuser },

  // Manual Purchase (MLM Core)
  { path: '/manual-purchase/add', name: 'Add Purchase', element: ManualPurchaseAdd },
  { path: '/manual-purchase/history', name: 'Purchase History', element: ManualPurchaseHistory },
  { path: '/product/create', name: 'Products', element: ProductCreate },
  { path: '/product/update/:userId', name: 'Update Product', element: UpdateProduct },
  { path: '/orders/pending', name: 'Pending Order', element: PendingOrders },
  { path: '/orders/approved', name: 'Complete Order', element: ApproveOrder },
  { path: '/orders/rejected', name: 'Reject Order', element: RejectedOrder },

  // Income Reports
  { path: '/earnings-report', name: 'Direct Income Report', element: directIncomeReport },
  { path: '/pair-history', name: 'Binary Matching History', element: PairHistory },
  { path: '/bounus-history', name: 'Bonus History', element: BounusHistory },
  { path: '/level-users/:level', name: 'Level Users', element: levelUsers },

  // Withdrawals
  { path: '/pending-withDrawals', name: 'Pending Withdrawals', element: PendingWithdrawals },
  { path: '/success-withdrawals', name: 'Approved Withdrawals', element: SuccessWithdrawals },
  { path: '/rejected-withdrawals', name: 'Rejected Withdrawals', element: WithdrawalsRejected },

  // KYC Management
  { path: '/user/kyc', name: 'User KYC', element: UserKyc },
  { path: '/bank/kyc', name: 'Bank KYC', element: BankKYC },



  // Tree View
  { path: '/tree', name: 'Tree View', element: TreeView },
  { path: '/tree/:userId', name: 'Tree View', element: TreeView },

  // User Routes (for login as user feature)
  { path: '/user/dashBoard', name: 'User Dashboard', element: UserDashboard },
  { path: '/user/profile', name: 'User Profile', element: UserProfile },
]

export default routes
