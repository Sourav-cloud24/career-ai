import apiClient from "@/lib/apiClient"

export const resumeApi = {
    uploadResume: async (file: File) => {
        const formData = new FormData()

        formData.append("resume", file)

        const response = await apiClient.post("/resumes", formData)

        return response.data
    },
    getResumes: async () => {
        const response = await apiClient.get("/resumes");

        return response.data;
    },
    deleteResume: async (resumeId: string) => {
        const response = await apiClient.delete(`/resumes/${resumeId}`);

        return response.data;
    }
}