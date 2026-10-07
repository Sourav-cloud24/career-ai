import { createJobDescription, deleteJobDescription, getJobDescriptionsByUserId } from "./job-description.repository.js";

export const createJobDescriptionRecord = async ({
    userId,
    jobTitle,
    companyName,
    description,
}) => {
    const jobDescription = await createJobDescription({
        userId,
        jobTitle,
        companyName,
        description,
    });

    return jobDescription;
};

export const getUserJobDescriptions = async (userId) => {
    const jobDescriptions = await getJobDescriptionsByUserId(userId);

    return jobDescriptions;
};

export const deleteUserJobDescriptions = async ({ jobId, userId }) => {
    const jobDescription = await deleteJobDescription({jobId, userId})

    return jobDescription
}
