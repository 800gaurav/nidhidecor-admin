import React, { useEffect, useState } from 'react'
import Tree from 'react-d3-tree'
import { CButton, CCard, CCardBody, CSpinner } from '@coreui/react'
import { FaUser } from 'react-icons/fa'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import useAxios from '../../hooks/useAxios'

const formatCurrency = (amount) =>
  `Rs ${new Intl.NumberFormat('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount || 0))}`

const createNode = (user, isEmpty = false) => {
  if (!user || isEmpty) {
    return { name: 'Empty', attributes: { isEmpty: true } }
  }

  return {
    name: user.name || 'N/A',
    attributes: {
      _id: user._id,
      userId: user.userId,
      email: user.email,
      phone: user.phone,
      sponsor: user.sponsor,
      totalPurchaseAmount: user.totalPurchaseAmount || 0,
      walletBalance: user.walletBalance || 0,
      createdAt: user.createdAt,
      isActivated: user.isActivated,
      isEmpty: false,
    },
    children: [],
  }
}

const addChildrenToNode = (tree, nodeId, leftChild, rightChild) => {
  if (!tree) return null

  if (tree.attributes?._id === nodeId) {
    tree.children = [
      leftChild ? createNode(leftChild) : createNode(null, true),
      rightChild ? createNode(rightChild) : createNode(null, true),
    ]
    return tree
  }

  if (tree.children?.length) {
    tree.children = tree.children.map((child) =>
      addChildrenToNode(child, nodeId, leftChild, rightChild),
    )
  }

  return tree
}

const CustomNode = ({ nodeDatum, onNodeClick, onNodeMouseOver, onNodeMouseOut }) => {
  const isRoot = nodeDatum.__rd3t.depth === 0
  const isEmpty = nodeDatum.attributes?.isEmpty
  const fill = isEmpty ? '#f8fafc' : isRoot ? '#2563eb' : '#0f766e'

  return (
    <g>
      <circle
        r="26"
        fill={fill}
        stroke={isEmpty ? '#cbd5e1' : '#0f172a'}
        strokeWidth="1.5"
        style={{ cursor: isEmpty ? 'default' : 'pointer' }}
        onClick={() => !isEmpty && onNodeClick(nodeDatum)}
        onMouseOver={(event) => !isEmpty && onNodeMouseOver(nodeDatum, event)}
        onMouseOut={onNodeMouseOut}
      />

      {!isEmpty && (
        <foreignObject x="-12" y="-12" width="24" height="24" style={{ pointerEvents: 'none' }}>
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            className="d-flex align-items-center justify-content-center text-white"
            style={{ width: 24, height: 24 }}
          >
            <FaUser size={16} />
          </div>
        </foreignObject>
      )}

      <foreignObject x="36" y="-32" width="190" height="72" style={{ pointerEvents: 'none' }}>
        <div xmlns="http://www.w3.org/1999/xhtml" style={{ fontFamily: 'Arial, sans-serif' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: isEmpty ? '#94a3b8' : '#111827' }}>
            {isEmpty ? 'Empty' : nodeDatum.name || 'N/A'}
          </div>
          <div style={{ fontSize: 12, color: isEmpty ? '#cbd5e1' : '#4b5563' }}>
            {isEmpty ? '-' : nodeDatum.attributes?.userId || 'N/A'}
          </div>
          {!isEmpty && (
            <div style={{ fontSize: 11, color: '#6b7280' }}>
              Purchase: {formatCurrency(nodeDatum.attributes?.totalPurchaseAmount)}
            </div>
          )}
        </div>
      </foreignObject>
    </g>
  )
}

const Tooltip = ({ user, position }) => {
  if (!user) return null

  return (
    <div
      className="position-fixed bg-white shadow border rounded p-3"
      style={{ left: position.x + 10, top: position.y + 10, zIndex: 1050, width: 320 }}
    >
      <strong className="text-primary">{user.name || 'N/A'}</strong>
      <div className="text-muted small mb-2">{user.userId || 'N/A'}</div>
      <div className="row small g-2">
        <div className="col-6"><b>Email:</b> {user.email || 'N/A'}</div>
        <div className="col-6"><b>Phone:</b> {user.phone || 'N/A'}</div>
        <div className="col-6"><b>Sponsor:</b> {user.sponsor || 'N/A'}</div>
        <div className="col-6"><b>Wallet:</b> {formatCurrency(user.walletBalance)}</div>
        <div className="col-6"><b>Purchase:</b> {formatCurrency(user.totalPurchaseAmount)}</div>
        <div className="col-6">
          <b>Status:</b> {user.isActivated ? 'Active' : 'Inactive'}
        </div>
      </div>
    </div>
  )
}

export default function OrgChartTree() {
  const { userId } = useParams()
  const navigate = useNavigate()
  const { fetchData, loading } = useAxios()
  const [treeData, setTreeData] = useState(null)
  const [hoveredUser, setHoveredUser] = useState(null)
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 })

  const loadUserTree = async (id, isRoot = false) => {
    if (!id) return

    try {
      const res = await fetchData({
        url: `/api/v1/admin/user/get-left-right-user/${id}`,
        method: 'GET',
      })
      const user = res?.data

      if (!user) {
        toast.error('Tree data not found')
        return
      }

      if (isRoot) {
        const root = createNode(user)
        root.children = [
          user.leftChild ? createNode(user.leftChild) : createNode(null, true),
          user.rightChild ? createNode(user.rightChild) : createNode(null, true),
        ]
        setTreeData(root)
        return
      }

      setTreeData((prevTree) =>
        JSON.parse(
          JSON.stringify(
            addChildrenToNode({ ...prevTree }, id, user.leftChild, user.rightChild),
          ),
        ),
      )
    } catch (error) {
      console.error('Error fetching tree data:', error)
      toast.error('Failed to fetch tree data')
    }
  }

  useEffect(() => {
    loadUserTree(userId, true)
  }, [userId])

  const handleNodeClick = (nodeDatum) => {
    const id = nodeDatum.attributes?._id
    if (!id || nodeDatum.attributes?.isEmpty) return

    const alreadyExpanded = nodeDatum.children?.some((child) => !child.attributes?.isEmpty)
    if (!alreadyExpanded) loadUserTree(id, false)
  }

  const handleNodeMouseOver = (nodeDatum, event) => {
    setHoveredUser({ ...nodeDatum.attributes, name: nodeDatum.name })
    setTooltipPos({ x: event.clientX, y: event.clientY })
  }

  return (
    <CCard className="mb-4">
      <CCardBody className="p-0">
        <div className="d-flex justify-content-between align-items-center border-bottom px-4 py-3">
          <div>
            <h4 className="mb-0">Team Structure</h4>
            <small className="text-muted">Click any user node to expand left and right children.</small>
          </div>
          <CButton color="secondary" variant="outline" onClick={() => navigate(-1)}>
            Back
          </CButton>
        </div>

        <div style={{ width: '100%', height: 'calc(100vh - 190px)', minHeight: 560 }}>
          {loading && !treeData ? (
            <div className="d-flex h-100 align-items-center justify-content-center">
              <CSpinner color="primary" />
            </div>
          ) : treeData ? (
            <Tree
              data={treeData}
              renderCustomNodeElement={(props) => (
                <CustomNode
                  {...props}
                  onNodeClick={handleNodeClick}
                  onNodeMouseOver={handleNodeMouseOver}
                  onNodeMouseOut={() => setHoveredUser(null)}
                />
              )}
              orientation="vertical"
              translate={{ x: 420, y: 110 }}
              separation={{ siblings: 1.6, nonSiblings: 2.2 }}
              pathClassFunc={() => 'tree-path'}
              enableLegacyTransitions
            />
          ) : (
            <div className="d-flex h-100 align-items-center justify-content-center text-muted">
              Tree data not found
            </div>
          )}

          {hoveredUser && <Tooltip user={hoveredUser} position={tooltipPos} />}
        </div>

        <style>
          {`
            .tree-path {
              stroke: #64748b;
              stroke-width: 2;
              fill: none;
            }
          `}
        </style>
      </CCardBody>
    </CCard>
  )
}
