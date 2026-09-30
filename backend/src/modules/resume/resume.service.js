import { extractResumeText } from "../../utils/resume-parser.js";
import { createResume, updateExtractedText } from "./resume.repository.js"
import path from "path"

export const createResumeRecord = async ({userId, file}) => {
    const storageKey = path.relative(
        process.cwd(),
        file.path
    );
    const resume = await createResume({
        userId,
        fileName: file.originalname,
        fileType: file.mimetype,
        fileSize: file.size,
        storageKey,
    })
    const extractedText = await extractResumeText({
        filePath: file.path,
        fileType: file.mimetype,
    });

    const updatedResume = await updateExtractedText({
        resumeId: resume.id,
        extractedText,
    });

    return updatedResume
}