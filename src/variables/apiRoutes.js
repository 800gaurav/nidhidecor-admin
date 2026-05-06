import AllUsers from "../users/allusers"

const apiRoutes = {
    // buyPlan: (planId) => `/api/v1/user/auth/buy-plan/${planId}`,
    // getKyc: `/api/v1/user/auth/get-kyc`,

    dashboardDetails: `/api/v1/admin/user/dashboardDetails`,
    activeUsers: `/api/v1/admin/user/activeusers`,
    pendingUser: `/api/v1/admin/user/pendinguser`,
    suspendedUsers: `/api/v1/admin/user/suspended-users`,
    AllUsers: `/api/v1/admin/user?page=1&limit=1000`,
    bounusHistory: `/api/v1/admin/user/bounus-history`,
    dailyRoi: `/api/v1/user/auth/daily-roi`,

}
export default apiRoutes