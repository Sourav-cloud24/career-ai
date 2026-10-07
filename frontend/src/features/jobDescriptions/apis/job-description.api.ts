import apiClient from "@/lib/apiClient"

export const jobDescriptionApi = {
    createJobDescription: async(data: { title: string; company?: string; description: string }) => {
        const response = await apiClient.post("/job-description", {
            jobTitle: data.title,
            companyName: data.company,
            description: data.description
        })
        //  jobTitle, companyName, description 

        return response.data;
    },
    getJobDescriptions: async () => {
        const response = await apiClient.get("/job-description");

        return response.data;
    },
    deleteJobDescription: async (jobId: string) => {
        const response = await apiClient.delete(`/job-description/${jobId}`);

        return response.data;
    }
}