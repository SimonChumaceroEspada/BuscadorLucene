import * as lucene from "lucene";
import { query } from "../db/database";
import { extractText, FILES_DIR } from "../files/extractText";
import fs from "fs-extra";
import path from "path";

let index: any[] = [];

async function indexDatabase() {
  const tablesRes = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `);

  for (const { table_name } of tablesRes.rows) {
    const dataRes = await query(`SELECT * FROM ${table_name}`);

    for (const row of dataRes.rows) {
      index.push({
        type: "database",
        table: table_name,
        ...row,
      });
    }
  }
}

async function indexFiles() {
  const files = await fs.readdir(FILES_DIR);

  for (const file of files) {
    const filePath = path.join(FILES_DIR, file);
    const text = await extractText(filePath);

    index.push({
      type: "file",
      fileName: file,
      text,
      path: filePath,
    });
  }
}

async function indexAll() {
  await indexDatabase();
  await indexFiles();
  console.log(`Se indexaron ${index.length} elementos.`);
}

indexAll();
