import { createResumeRecord, deleteResumeRecord, getResumesRecord } from "./resume.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const file = req.file;
    // console.log("CONTENT TYPE:", req.headers["content-type"]);
    // console.log("BODY:", req.body);
    // console.log("FILE:", req.file);

    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Resume file is required",
      });
    }

    const resume = await createResumeRecord({
      userId,
      file,
    });

    return res.status(201).json({
      success: true,
      message: "Resume uploaded successfully",
      data: resume,
    });
  } catch (error) {
    console.error("Upload resume error:", error);
    next(error);
  }
};

export const getResumes = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    const resumes = await getResumesRecord(userId);

    return res.status(200).json({
      success: true,
      message: "Resumes fetched successfully",
      data: resumes,
    });
  } catch (error) {
    console.error("Get resumes error:", error);
    next(error);
  }
};

export const deleteResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const resumeId = req.params.resumeId;

    const deletedResume = await deleteResumeRecord({
      resumeId,
      userId,
    });

    if (!deletedResume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume deleted successfully",
      data: deletedResume,
    });
  } catch (error) {
    console.error("Delete resume error:", error);
    next(error);
  }
};