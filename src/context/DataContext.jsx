import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import {
  cilCursor,
  cilFindInPage,
  cilImage,
  cilSpeedometer,
  cilStar,
  cilGroup,
  cilList,
  cilPeople,
  cilUser,
  cilBank,
  cilSettings,
  cilSwapHorizontal,
  cilCaretRight,
  cilMoney,
  cilChevronCircleUpAlt,
  cilChevronDoubleUp,
  cilArrowThickToTop,
  cilArrowThickFromTop,
  cilCreditCard,
  cilLan,
  cibGreensock,
  cibKeycdn,
  cibNintendo3ds,
  cibStackbit,
  cibOdnoklassniki
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'
import useAxios from '../hooks/useAxios'
import useAuth from '../hooks/useAuth'
import { VscReferences } from "react-icons/vsc";
import { MdOutlineCalendarMonth, MdOutlinePendingActions } from "react-icons/md";
import { FaMoneyBillTrendUp, FaMoneyBillTransfer } from "react-icons/fa6";
import { LuUsersRound } from "react-icons/lu";
import { RiMoneyRupeeCircleFill, RiPassPendingLine } from "react-icons/ri";
import { FaUserShield, FaUsers, FaFileInvoiceDollar } from "react-icons/fa";
import { FaBoxOpen } from "react-icons/fa";
import { TbReportMoney } from "react-icons/tb";
import { TiBook } from "react-icons/ti";
import { SiMoneygram } from "react-icons/si";
import { BsTicket } from 'react-icons/bs'
import { CiMoneyCheck1 } from "react-icons/ci";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
// import { MdOutlinePendingActions } from "react-icons/md";

export const DataContext = createContext()

const lists = [
  {
    component: CNavItem,
    name: 'DashBoard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },

  {
    component: CNavGroup,
    name: 'Users Section',
    to: '/member',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon"
    />,
    items: [
      {
        component: CNavItem,
        name: 'All Users',
        to: '/users-allusers',
        icon: <FaUsers size={20} style={{  marginRight: 5  }} />,
      },
      {
              component: CNavItem,
              name: 'Add User',
              to: '/users/add',
            },
      {
        component: CNavItem,
        name: 'Active Users',
        to: '/active-users',
        icon: <FaUserShield size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Pending Users',
        to: '/pending/users',
        icon: <RiPassPendingLine size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Suspended Users',
        to: '/suspended/users',
        icon: <LuUsersRound size={20} style={{ marginRight: 5 }} />,
      },


    ],
  },
  {
    component: CNavGroup,
    name: 'Income History',
    to: '/income-report',
    icon: <CIcon icon={cilBank} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Earnings Report',
        to: '/earnings-report',
        icon: <VscReferences size={20} style={{ marginRight: 5 }} />,
      },

    ],
  },

  {
    component: CNavGroup,
    name: 'Purchase Bills',
    to: '/manual-purchase',
    icon: <FaFileInvoiceDollar size={20} style={{ marginRight: 5 }} />,
    items: [
      {
        component: CNavItem,
        name: 'Add Purchase',
        to: '/manual-purchase/add',
        icon: <RiMoneyRupeeCircleFill size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Purchase History',
        to: '/manual-purchase/history',
        icon: <TbReportMoney size={20} style={{ marginRight: 5 }} />,
      },
      // {
      //   component: CNavItem,
      //   name: 'Tree View',
      //   to: '/tree',
      //   icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
      // },
    ],
  },

  {
    component: CNavGroup,
    name: 'Products & Orders',
    to: '/commerce',
    icon: <FaBoxOpen size={20} style={{ marginRight: 5 }} />,
    items: [
      {
        component: CNavItem,
        name: 'Products',
        to: '/product/create',
        icon: <FaBoxOpen size={18} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Pending Orders',
        to: '/orders/pending',
        icon: <MdOutlinePendingActions size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Complete Orders',
        to: '/orders/approved',
        icon: <FaMoneyBillTrendUp size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Rejected Orders',
        to: '/orders/rejected',
        icon: <FaMoneyBillTransfer size={20} style={{ marginRight: 5 }} />,
      },
    ],
  },





  // {
  //   component: CNavGroup,
  //   name: 'Deposit',
  //   to: '/topup-Pending',
  //   icon: <CIcon icon={cilMoney} customClassName="nav-icon" />,
  //   items: [
  //     {
  //       component: CNavItem,
  //       name: 'Pending Deposit',
  //       to: '/topup-pending',
  //       icon: <FaMoneyBillTransfer size={20} style={{ marginRight: 5 }} />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Approved Deposit',
  //       to: '/topup-approved',
  //       icon: <FaMoneyBillTransfer size={20} style={{ marginRight: 5 }} />,
  //     },
  //     {
  //       component: CNavItem,
  //       name: 'Rejected Deposit',
  //       to: '/topup-rejected',
  //       icon: <FaMoneyBillTransfer size={20} style={{ marginRight: 5 }} />,
  //     },
  //   ],
  // },

  {
    component: CNavGroup,
    name: 'User KYC',
    // to: '/income-report',
    icon: <CiMoneyCheck1 size={23} style={{ marginRight: 5 }} />,
    items: [
      {
        component: CNavItem,
        name: 'Users KYC',
        to: '/user/kyc',
        icon: <LuUsersRound size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Bank KYC',
        to: '/bank/kyc',
        icon: <LuUsersRound size={20} style={{ marginRight: 5 }} />,
      },
    ],
  },

  {
    component: CNavGroup,
    name: 'Withdrawals',
    to: '/income-report',
    icon: <CIcon icon={cibNintendo3ds} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: 'Pending WithDrawals',
        to: '/pending-withDrawals',
        icon: <MdOutlinePendingActions size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Success Withdrawals',
        to: '/success-withdrawals',
        icon: <FaMoneyBillTrendUp size={20} style={{ marginRight: 5 }} />,
      },
      {
        component: CNavItem,
        name: 'Rejected Withdrawals',
        to: '/rejected-withdrawals',
        icon: <FaMoneyBillTransfer size={20} style={{ marginRight: 5 }} />,
      },
    ],
  },








  //   ],
  // },
]

export const DataProvider = ({ children }) => {
  const { fetchData } = useAxios()
  const loadedRef = useRef(false) // ✅ Prevent multiple API calls
  const { userRole, setUserRole } = useAuth()

  const [siteTabs, setSiteTabs] = useState();

  const getAllLists = () => { }
  const deleteSiteTab = () => { }

  useEffect(() => {
    if (userRole === 'user') {
      setSiteTabs([
        {
          component: CNavItem,
          name: 'DashBoard',
          to: '/user/dashboard',
          icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Profile',
          to: '/user/profile',
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Activation',
          to: '/user/activation',
          icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
        },
        {
          component: CNavItem,
          name: 'Tree View',
          to: '/tree',
          icon: <CIcon icon={cilLan} customClassName="nav-icon" />,
        },
        {
          component: CNavGroup,
          name: 'Support',
          to: '/support',
          icon: <CIcon icon={cibGreensock} customClassName="nav-icon" />,
          items: [
            {
              component: CNavItem,
              name: 'Raise Ticket',
              to: '/user/raise-ticket',
              icon: <CIcon icon={cilCaretRight} />,
            },
            {
              component: CNavItem,
              name: 'Ticket Status',
              to: '/user/ticket-status',
              icon: <CIcon icon={cilCaretRight} />,

            },

          ],
        },

      ])
    }
    if (userRole !== 'user') {
      setSiteTabs(lists)
    }
    console.log(userRole)
  }, [userRole])

  useEffect(() => {
    // getAllLists() // ✅ Trigger once when component mounts
  }, [])

  const value = {
    siteTabs,
    setSiteTabs,
    getAllLists,
    deleteSiteTab,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export const useData = () => useContext(DataContext)
