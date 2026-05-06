import React, { useEffect, useState } from 'react';
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
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem
} from '@coreui/react';
import useAxios, { loginUrl } from '../../../hooks/useAxios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import LoadingSpinner from '../../../components/common/LoadinSpinner';
import useToastHandler from '../../../hooks/useToastHandler';
import apiRoutes from '../../../variables/apiRoutes';
import { exportToExcel, exportToPDF, exportToWordPress } from '../../../help/DownloadFiles';
import color from '../../color';
import Export from '../../Export';

const SuspendedUsers = () => {
  const { fetchData, loading } = useAxios();
  const { showToast } = useToastHandler();
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    from: '',
    to: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchSuspendedUsers = async () => {
    try {
      const res = await fetchData({ url: apiRoutes.suspendedUsers });
      if (res?.users) {
        setUsers(res.users);
        setFiltered(res.users);
      } else {
        toast.error('No suspended users found');
      }
    } catch (err) {
      toast.error('Failed to fetch suspended users');
    }
  };

  useEffect(() => {
    fetchSuspendedUsers();
  }, []);

  const loginAsUser = async (id, userId) => {
    try {
      const data = await fetchData({
        url: `/api/v1/admin/user/login-as-user/${id}`,
        method: 'get',
      })
      if (data.success) {
        console.log(data.data)
        console.log(userId)
        const token = data?.data.token;
        const redirectUrl = `${loginUrl}/Login?userId=${userId}&token=${token}`;
        window.open(redirectUrl, "_blank", "noopener,noreferrer");

      }
    } catch (error) {
      toast.error('Login as user failed')
      console.log(error)
    }
  }

  const activateUser = async (userId) => {
    try {
      const res = await fetchData({
        url: `/api/v1/admin/user/unblockuser/${userId}`,
        method: 'PATCH',
        data: { status: false },
      });

      if (res?.message) {
        toast.success('User activated successfully');
        fetchSuspendedUsers();
      }
    } catch (error) {
      toast.error('Failed to activate user');
    }
  };

  const handleSearch = () => {
    let filteredList = [...users];


    if (filters.search) {
      filteredList = filteredList.filter(
        (user) =>
          user.userId?.toLowerCase().includes(filters.search.toLowerCase().trim()) ||
          user.name?.toLowerCase().includes(filters.search.toLowerCase().trim())
      );
    }


    if (filters.from) {
      filteredList = filteredList.filter(
        (user) => new Date(user.createdAt) >= new Date(filters.from)
      );
    }

    if (filters.to) {
      filteredList = filteredList.filter(
        (user) => new Date(user.createdAt) <= new Date(filters.to)
      );
    }

    setFiltered(filteredList);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({ userId: '', from: '', to: '' });
    setFiltered(users);
    setCurrentPage(1);
  };

  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filtered.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);


  const fields = [
    { key: "userId", label: "User Id" },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "phone" },
    { key: "walletBalance", label: "Wallet Balance" },
    { key: "sponsor", label: "Sponsor" },
  ];


  return (
    <>
      {loading && <LoadingSpinner />}

      <CRow className="mb-3">
        <CCol md={3}>
          <CFormInput
            label="UserId"
            placeholder="Search by UserId , Name"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="From Date"
            value={filters.from}
            onChange={(e) => setFilters({ ...filters, from: e.target.value })}
          />
        </CCol>
        <CCol md={3}>
          <CFormInput
            type="date"
            label="To Date"
            value={filters.to}
            onChange={(e) => setFilters({ ...filters, to: e.target.value })}
          />
        </CCol>
        <CCol md={3} className="d-flex align-items-end gap-2">
          <CButton color="primary" onClick={handleSearch}
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
          {/*  */}
            <Export userdata={users} fields={fields} />
        </CCol>


      </CRow>

      <div className="table-responsive">
        <CTable hover bordered responsive className="text-nowrap">
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell>S.No</CTableHeaderCell>
              <CTableHeaderCell>UserId</CTableHeaderCell>
              <CTableHeaderCell>Name</CTableHeaderCell>
              <CTableHeaderCell>Mobile</CTableHeaderCell>
              <CTableHeaderCell>Email</CTableHeaderCell>
              {/* <CTableHeaderCell>Main Wallet</CTableHeaderCell> */}
              <CTableHeaderCell>Wallet Bonus</CTableHeaderCell>
              {/* <CTableHeaderCell>Earning</CTableHeaderCell> */}
              <CTableHeaderCell>Sponsor</CTableHeaderCell>
              {/* <CTableHeaderCell>Password</CTableHeaderCell> */}
              <CTableHeaderCell>Date</CTableHeaderCell>
              <CTableHeaderCell>Action</CTableHeaderCell>
              <CTableHeaderCell>Login</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            {currentItems.map((user, index) => {
              const date = new Date(user.createdAt);
              return (
                <CTableRow key={user._id}>
                  <CTableDataCell>{indexOfFirst + index + 1}</CTableDataCell>
                  <CTableDataCell>{user.userId || "N/A"}</CTableDataCell>
                  <CTableDataCell>{user.name || "N/A"}</CTableDataCell>
                  <CTableDataCell>{user.phone || "N/A"}</CTableDataCell>
                  <CTableDataCell>{user.email || "N/A"}</CTableDataCell>
                  {/* <CTableDataCell>{user.walletBalance || 0}</CTableDataCell> */}
                  <CTableDataCell>{user.walletBalance || 0}</CTableDataCell>
                  {/* <CTableDataCell>{user.totalProfitEarned || 0}</CTableDataCell> */}
                  <CTableDataCell>{user.sponsor || "N/A"}</CTableDataCell>
                  {/* <CTableDataCell>{user.forAdminPass || "N/A"}</CTableDataCell> */}
                  <CTableDataCell>
                    {date.toLocaleDateString()} <br />
                    <small className="text-muted">{date.toLocaleTimeString() || "N/A"}</small>
                  </CTableDataCell>
                  <CTableDataCell className="d-flex gap-2 flex-wrap">
                    {/* <CButton
                      color="info"
                      size="sm"
                      onClick={() => navigate(`/user/update/${user.userId}`, { state: { user } })}
                      style={{
                        background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                        color: 'white',
                      }}
                    >
                      ✎
                    </CButton> */}
                    <CButton
                      color="success"
                      size="sm"
                      onClick={() => activateUser(user.userId)}
                      style={{
                        background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                        color: 'white',
                      }}
                    >
                      Activate
                    </CButton>
                  </CTableDataCell>
                  <CTableDataCell className="text-center">
                    <CButton
                      disabled={user?.role === 'admin'}
                      color="primary"
                      size="sm"
                      onClick={() => loginAsUser(user._id, user.userId)}
                      // style={{ backgroundColor: '#1A73E8', borderColor: '#ffffff', color: '#ffffff' }}
                      style={{
                        background: `linear-gradient(135deg, ${color.primary} 0%, ${color.accent} 50%, ${color.secondary} 100%)`,
                        color: 'white',
                      }}
                    >
                      Login
                    </CButton>
                  </CTableDataCell>
                </CTableRow>
              );
            })}
          </CTableBody>
        </CTable>
      </div>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Showing {indexOfFirst + 1} to {Math.min(indexOfLast, filtered.length)} of {filtered.length} entries
        </div>
        <div>
          {Array.from({ length: totalPages }, (_, i) => (
            <CButton
              key={i}
              size="sm"
              color={i + 1 === currentPage ? 'dark' : 'light'}
              className="me-1"
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </CButton>
          ))}
        </div>
      </div>
    </>
  );
};

export default SuspendedUsers;

