import AnalysisDetails from "@/features/annalysis/components/AnalysisDetails"

type AnalysisDetailsPageProps = {
    params: Promise<{ analysisId: string }>
}

const AnalysisDetailsPage = async ({ params }: AnalysisDetailsPageProps) => {
    const { analysisId } = await params

    return <AnalysisDetails analysisId={analysisId} />
}

export default AnalysisDetailsPage