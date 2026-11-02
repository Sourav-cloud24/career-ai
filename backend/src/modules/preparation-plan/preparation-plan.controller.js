import {
  generatePreparationPlan,
  getPreparationPlan,
} from "./preparation-plan.service.js";

export const generatePreparationPlanController = async (req, res, next) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.userId;

    const preparationPlan = await generatePreparationPlan({
      analysisId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Preparation plan generated successfully.",
      data: preparationPlan,
    });
  } catch (error) {
    next(error);
  }
};

export const getPreparationPlanController = async (req, res, next) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.userId;

    const preparationPlan = await getPreparationPlan({
      analysisId,
      userId,
    });

    return res.status(200).json({
      success: true,
      message: "Preparation plan retrieved successfully.",
      data: preparationPlan,
    });
  } catch (error) {
    next(error);
  }
};
