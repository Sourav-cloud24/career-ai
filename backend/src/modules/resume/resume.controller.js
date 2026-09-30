import { createResumeRecord } from "./resume.service.js";

export const uploadResume = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const file = req.file;

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
