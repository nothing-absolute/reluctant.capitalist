import os
import json
from pathlib import Path

# To use this in production, ensure you have the ollama python package installed:
# pip install ollama
# And ensure the Ollama application is running locally with the specified model pulled.
try:
    import ollama
except ImportError:
    print("WARNING: 'ollama' package not found. Install via 'pip install ollama'")
    ollama = None

class LocalIdeationEngine:
    def __init__(self, data_dir: str, model_name: str = "llama3"):
        self.data_dir = Path(data_dir)
        self.model_name = model_name
        self.context_library = []
        self._load_context_library()

    def _load_context_library(self):
        """
        Loads the foundational texts: The Story Bible, MLM Truth data,
        and Channel Strategy documents.
        """
        print(f"Loading context from {self.data_dir}...")
        for file_path in self.data_dir.glob("*.md"):
            with open(file_path, 'r', encoding='utf-8') as f:
                content = f.read()
                self.context_library.append({
                    "source": file_path.name,
                    "content": content
                })
        print(f"Loaded {len(self.context_library)} foundational documents.")

    def generate_script_outline(self, topic_prompt: str) -> str:
        """
        Takes a topic prompt, aggregates relevant context, and queries the local LLM
        (via Ollama) to generate a V1 script outline.
        """
        print(f"\n--- Generating Script Outline for Topic: '{topic_prompt}' ---")
        
        # 1. Retrieval Step (Simplified Aggregation)
        # In a full RAG system, we'd use a vector DB (e.g., ChromaDB) here.
        # For now, we aggregate the most relevant foundational files.
        print("Aggregating context from Story Bible and MLM Data...")
        aggregated_context = "\n\n".join([doc['content'] for doc in self.context_library])

        # 2. Generation Step
        system_prompt = (
            "You are an expert video essay scriptwriter for 'The Machine' YouTube channel. "
            "Use the provided context to draft a script outline. "
            "Tone: Empathetic, data-driven, analytical. No snark. "
            "Structure: The Hook, The Systemic Problem, The Personal/Human Stake, The Exit/Alternative."
        )
        
        llm_prompt = f"Context:\n{aggregated_context}\n\nTopic:\n{topic_prompt}\n\nOutline:"
        
        if ollama:
            print(f"Querying local LLM ({self.model_name}) via Ollama...")
            try:
                response = ollama.chat(model=self.model_name, messages=[
                  {'role': 'system', 'content': system_prompt},
                  {'role': 'user', 'content': llm_prompt}
                ])
                return response['message']['content']
            except Exception as e:
                print(f"Error querying Ollama: {e}")
                return self._mock_output(topic_prompt)
        else:
            print("Ollama not available. Falling back to mock output.")
            return self._mock_output(topic_prompt)

    def _mock_output(self, topic_prompt: str) -> str:
        return f"""
# SCRIPT OUTLINE: {topic_prompt}

## 1. THE HOOK (0:00 - 1:00)
- Visual: [Data visualization or personal artifact]
- Hook: Introduce the illusion vs. the mathematical reality of the system.
- Thesis: We are going to follow the money and show the math.

## 2. THE SYSTEMIC PROBLEM (1:00 - 5:00)
- Explanation of the specific extraction mechanic (e.g., the blame loop, rent-seeking).
- Data points pulled from FTC disclosures or the MLM Truth calculator.

## 3. THE PERSONAL STAKE (5:00 - 8:00)
- Connecting the data back to JD's father or the wider 'Pipeline' of radicalization.
- Empathy: Treating participants as victims of predatory architecture.

## 4. THE EXIT (8:00 - 10:00)
- Presenting the alternative: Maker culture, open source, cooperative economics.
- Call to Action: Use the free tools on nothing-absolute.github.io.
"""

    def save_outline(self, outline: str, filename: str):
        """Saves the generated outline for human review."""
        output_path = self.data_dir / "drafts" / filename
        output_path.parent.mkdir(exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            f.write(outline)
        print(f"\n[HUMAN REVIEW GATE] Outline saved to {output_path}. Waiting for JD's approval.")

if __name__ == "__main__":
    # Point this to the directory containing the Story Bible and strategy docs.
    BRAIN_DIR = "." 
    
    engine = LocalIdeationEngine(data_dir=BRAIN_DIR, model_name="llama3")
    
    # Test generation for a new topic
    topic = "The Master Resell Rights Illusion: Coding the Pyramid"
    draft_outline = engine.generate_script_outline(topic)
    
    engine.save_outline(draft_outline, "outline_002_mrr_illusion.md")
