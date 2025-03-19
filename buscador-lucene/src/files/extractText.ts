import fs from "fs-extra";
import path from "path";
import pdf from "pdf-parse";
import mammoth from "mammoth";
import textract from "textract";

const FILES_DIR = path.join(__dirname, "../../data/documents");

async function extractText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === ".txt") {
      return fs.readFile(filePath, "utf-8");
    } else if (ext === ".pdf") {
      const data = await pdf(await fs.readFile(filePath));
      return data.text;
    } else if (ext === ".docx") {
      const { value } = await mammoth.extractRawText({ path: filePath });
      return value;
    } else {
      return new Promise((resolve, reject) => {
        textract.fromFileWithPath(filePath, (error, text) => {
          if (error) reject(error);
          else resolve(text);
        });
      });
    }
  } catch (error) {
    console.error(`Error extrayendo texto de ${filePath}:`, error);
    return "";
  }
}

export { extractText, FILES_DIR };
