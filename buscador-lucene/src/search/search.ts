import { getIndex, getDocuments, waitForIndex, isIndexReady } from "./index";

async function search(query: string) {
  // Make sure index is ready before searching
  if (!isIndexReady) {
    console.log("Esperando a que el índice se prepare...");
    await waitForIndex();
  }
  
  const index = getIndex();
  const documents = getDocuments();
  const results = index.search(query);

  return results.map((result) => {
    return documents.find((doc) => doc.id === result.ref);
  });
}

// 🔹 Prueba la búsqueda
async function runSearch() {
  try {
    const results = await search("término de prueba");
    console.log("Resultados de búsqueda:", results);
  } catch (error) {
    console.error("Error durante la búsqueda:", error);
  }
}

runSearch();

export { search };
