import os
from pathlib import Path
import chromadb
from chromadb.utils import embedding_functions

# NOTE: Requires chromadb package
# pip install chromadb

class OdysseusRAG:
    """
    The foundational Vector Database for the Odysseus Local Ideation Engine.
    This reads the Central Brain directories, chunks the markdown files,
    embeds them using a local embedding model, and stores them in ChromaDB.
    """
    def __init__(self, db_path: str = "./odysseus_chroma_db"):
        self.db_path = db_path
        # Initialize a persistent local Chroma client
        self.client = chromadb.PersistentClient(path=self.db_path)
        
        # Use a lightweight, open-source local embedding model (runs on CPU/local GPU)
        self.embedding_fn = embedding_functions.DefaultEmbeddingFunction()
        
        # Get or create the collection for the Central Brain
        self.collection = self.client.get_or_create_collection(
            name="central_brain",
            embedding_function=self.embedding_fn
        )

    def ingest_directory(self, directory_path: str, source_tag: str):
        """
        Reads all markdown files in a directory, chunks them, and adds them to the vector DB.
        """
        path = Path(directory_path)
        if not path.exists():
            print(f"Directory {path} does not exist. Skipping.")
            return

        print(f"Ingesting {path} into RAG database...")
        docs = []
        metadatas = []
        ids = []

        for file_path in path.glob("**/*.md"):
            try:
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()
                    
                    # Basic naive chunking (split by double newlines/paragraphs)
                    # For production, use langchain.text_splitter or similar.
                    chunks = [c.strip() for c in content.split('\n\n') if len(c.strip()) > 50]
                    
                    for i, chunk in enumerate(chunks):
                        docs.append(chunk)
                        metadatas.append({"source": file_path.name, "tag": source_tag})
                        ids.append(f"{file_path.name}_chunk_{i}")
            except Exception as e:
                print(f"Error reading {file_path}: {e}")

        if docs:
            # Upsert into ChromaDB
            self.collection.upsert(
                documents=docs,
                metadatas=metadatas,
                ids=ids
            )
            print(f"Successfully ingested {len(docs)} chunks from {source_tag}.")
        else:
            print(f"No valid markdown content found in {source_tag}.")

    def query_brain(self, query: str, n_results: int = 3):
        """
        Searches the Central Brain for context relevant to the prompt.
        """
        print(f"\nSearching Central Brain for: '{query}'")
        results = self.collection.query(
            query_texts=[query],
            n_results=n_results
        )
        
        context_blocks = []
        if results['documents']:
            for i, doc_list in enumerate(results['documents']):
                for j, doc in enumerate(doc_list):
                    meta = results['metadatas'][i][j]
                    context_blocks.append(f"--- From {meta['source']} ({meta['tag']}) ---\n{doc}")
        
        return "\n\n".join(context_blocks)

if __name__ == "__main__":
    # Test initialization and ingestion
    rag_engine = OdysseusRAG()
    
    # Assuming these directories exist locally based on previous scripts
    rag_engine.ingest_directory("./A_Plain_of_Jars", "Narrative")
    rag_engine.ingest_directory("./Reluctant_Capitalist", "Systems")
    rag_engine.ingest_directory("./MLM_Truth", "Data")
    
    # Test a query
    context = rag_engine.query_brain("What is the Blame Loop in MLMs?")
    print("\n[RAG OUTPUT]")
    print(context)
