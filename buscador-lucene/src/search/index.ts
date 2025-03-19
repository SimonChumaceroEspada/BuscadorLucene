import lunr from "lunr";
import { query } from "../db/database";
import { extractText, FILES_DIR } from "../files/extractText";
import fs from "fs-extra";
import path from "path";

let documents: any[] = [];
let index: lunr.Index;
let isIndexReady = false;

async function indexDatabase() {
  const tablesRes = await query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public';
  `);

  for (const { table_name } of tablesRes.rows) {
    const dataRes = await query(`SELECT * FROM ${table_name}`);

    for (const row of dataRes.rows) {
      documents.push({
        id: `${table_name}-${row.id}`,
        type: "database",
        table: table_name,
        content: JSON.stringify(row),
      });
    }
  }
}

async function indexFiles() {
  const files = await fs.readdir(FILES_DIR);

  for (const file of files) {
    const filePath = path.join(FILES_DIR, file);
    const text = await extractText(filePath);

    documents.push({
      id: `file-${file}`,
      type: "file",
      fileName: file,
      content: text,
    });
  }
}

async function createIndex() {
  index = lunr(function () {
    this.ref("id");
    this.field("content");

    documents.forEach((doc) => this.add(doc));
  });

  console.log(`Se indexaron ${documents.length} elementos.`);
  isIndexReady = true;
}

async function indexAll() {
  await indexDatabase();
  await indexFiles();
  await createIndex();
}

// Start indexing but don't wait for it to complete here
const indexingPromise = indexAll();

function getIndex() {
  if (!isIndexReady) {
    throw new Error("El índice aún no está listo. Por favor espere.");
  }
  return index;
}

function getDocuments() {
  if (!isIndexReady) {
    throw new Error("El índice aún no está listo. Por favor espere.");
  }
  return documents;
}

// Export a function to wait for index to be ready
async function waitForIndex() {
  if (!isIndexReady) {
    await indexingPromise;
  }
  return true;
}

export { getIndex, getDocuments, waitForIndex, isIndexReady };
