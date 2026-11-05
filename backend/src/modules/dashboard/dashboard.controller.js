import { getDashboardOverview } from "./dashboard.service.js";

export const getDashboardOverviewController = async (req, res, next) => {
  try {
    // 1. Get authenticated user's ID
    const userId = req.user.userId;

    // 2. Fetch dashboard overview from service
    const dashboardData = await getDashboardOverview({ userId });

    // 3. Send successful response
    return res.status(200).json({
      success: true,
      message: "Dashboard overview fetched successfully",
      data: dashboardData,
    });
  } catch (error) {
    // 4. Forward error to global error handler
    next(error);
  }
};
