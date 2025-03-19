import fs from "fs-extra";
import path from "path";
import { extractText, FILES_DIR } from "./extractText";

async function indexFiles() {
  try {
    const files = await fs.readdir(FILES_DIR);
    let indexedFiles = [];

    for (const file of files) {
      const filePath = path.join(FILES_DIR, file);
      const text = await extractText(filePath);

      indexedFiles.push({
        fileName: file,
        text,
        path: filePath,
      });
    }

    console.log(`Se indexaron ${indexedFiles.length} archivos.`);
  } catch (error) {
    console.error("Error indexando archivos:", error);
  }
}

indexFiles();
