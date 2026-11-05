import { deleteAnalysisById } from "./analysis.repository.js";
import {
  analyzeResumeAgainstJob,
  deleteAnalyses,
  getAnalysesHistory,
  getAnalysisByIdForUser,
} from "./analysis.service.js";

export const createAnalysisController = async (req, res, next) => {
  try {
    const { resumeId, jobDescriptionId } = req.body;
    const userId = req.user.userId;
    console.log(" resumeId, jobDescriptionId", resumeId, jobDescriptionId);

    if (
      !Number.isSafeInteger(resumeId) ||
      resumeId <= 0 ||
      !Number.isSafeInteger(jobDescriptionId) ||
      jobDescriptionId <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid resumeId and jobDescriptionId are required.",
      });
    }

    const analysis = await analyzeResumeAgainstJob({
      resumeId,
      jobDescriptionId,
      userId,
    });

    return res.status(201).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysisByIdController = async (req, res, next) => {
  try {
    const analysisId = Number(req.params.analysisId);
    const userId = req.user.userId;

    if (!Number.isSafeInteger(analysisId) || analysisId <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid analysis ID.",
      });
    }

    const analysis = await getAnalysisByIdForUser({
      analysisId,
      userId,
    });

    return res.status(200).json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    next(error);
  }
};

export const getAnalysesController = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const analyses = await getAnalysesHistory({ userId });

    return res.status(200).json({
      success: true,
      data: analyses,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteAnalysis = async (req, res, next) => {
  try {
    const { analysisId } = req.params;
    const userId = req.user.userId;

    const deletedAnalysis = await deleteAnalysisById({
      analysisId,
      userId,
    });

    if (!deletedAnalysis) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Analysis deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
