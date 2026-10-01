import {
  createJobDescriptionRecord,
  getUserJobDescriptions,
} from "./job-description.service.js";

export const createJobDescription = async (req, res) => {
  try {
    const userId = req.user.userId;

    const { jobTitle, companyName, description } = req.body;

    if (!jobTitle || !description) {
      return res.status(400).json({
        success: false,
        message: "Job title and description are required",
      });
    }

    const jobDescription = await createJobDescriptionRecord({
      userId,
      jobTitle,
      companyName,
      description,
    });

    return res.status(201).json({
      success: true,
      message: "Job description created successfully",
      data: jobDescription,
    });
  } catch (error) {
    console.error("Create job description error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to create job description",
    });
  }
};

export const getJobDescriptions = async (req, res) => {
  try {
    const userId = req.user.userId;

    const jobDescriptions = await getUserJobDescriptions(userId);

    return res.status(200).json({
      success: true,
      data: jobDescriptions,
    });
  } catch (error) {
    console.error("Get job descriptions error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch job descriptions",
    });
  }
};
