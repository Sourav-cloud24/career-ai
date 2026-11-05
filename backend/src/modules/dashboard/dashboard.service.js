import { getDashboardStats, getLatestAnalysis, getRecentAnalyses } from "./dashboard.repository.js"


export const getDashboardOverview = async ({userId}) => {

    // 1. Fetch dashboard data
    const [states, recentAnalyses, latestAnalysis] = await Promise.all(
        [
            getDashboardStats({ userId }),
            getRecentAnalyses({ userId }),
            getLatestAnalysis({ userId }),
        ]
    )

    // 2. Convert PostgreSQL COUNT values into numbers
    const formattedStats = {
        totalResumes: Number(states.total_resumes),
        totalJobDescriptions: Number(states.total_job_descriptions),
        totalAnalyses: Number(states.total_analyses),
        completedAnalyses: Number(states.completed_analyses),
    };

    // 3. Return dashboard overview
    return {
        stats: formattedStats,
        recentAnalyses,
        latestAnalysis,
        latestPreparationPlan: null,
    };
}