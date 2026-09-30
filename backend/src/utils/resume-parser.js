import fs from "fs/promises";
import path from "path";
import { PDFParse } from "pdf-parse";
import mammoth from "mammoth";

export const extractResumeText = async ({ filePath, fileType }) => {
  const absolutePath = path.resolve(filePath);

  const fileBuffer = await fs.readFile(absolutePath);

  if (fileType === "application/pdf") {
    const parser = new PDFParse({ data: fileBuffer });

    try {
      const pdfData = await parser.getText();

      return pdfData.text.trim();
    } finally {
      await parser.destroy();
    }
  }

  if (
    fileType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    const result = await mammoth.extractRawText({
      buffer: fileBuffer,
    });

    return result.value.trim();
  }

  throw new Error("Unsupported resume file type");
};
