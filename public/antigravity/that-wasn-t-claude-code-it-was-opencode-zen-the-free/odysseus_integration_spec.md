# ODYSSEUS INTEGRATION SPEC
**Connecting the Central Brain to the Local AI Router**
*Drafted: September 2026*

---

## THE OBJECTIVE
To build a seamless, automated bridge between JD's raw inputs (The Central Brain) and the local Odysseus LLM/AI GUI interface. Odysseus will act as the "Local Router," parsing unstructured brain dumps, story beats, and blog posts, and synthesizing them into reactive content formats for human review.

## 1. THE DATA INGESTION LAYER (File System & Hooks)
Odysseus needs to be aware of new data the moment it is written. 

**Implementation Strategy: Local Directory Watcher**
*   **The Setup:** A lightweight Python script (e.g., using the `watchdog` library) runs locally, monitoring specific directories where JD drops raw thoughts or updates projects.
*   **Monitored Paths:**
    *   `/A_Plain_of_Jars/` (Story beats, prose, documentary notes)
    *   `/Reluctant_Capitalist/` (Drafts, essays, economic analysis)
    *   `/MLM_Truth/` (New datasets, FTC updates, JSON/CSV files)
    *   `/Chat_History/` (Exported JSON logs of critical LLM sessions)
*   **The Trigger:** When a file is created or modified, the watcher pushes an event (via local HTTP webhook or WebSockets) to the Odysseus backend.

## 2. THE SYNTHESIS LAYER (Odysseus Backend)
Once Odysseus receives the raw input, it performs automated RAG (Retrieval-Augmented Generation) against the entire Central Brain.

**The Routing Logic (Prompts within Odysseus):**
When a new input arrives, Odysseus runs it through a series of system prompts to determine its highest value application.
1.  *Is this a narrative beat?* -> Generate a Substack serialization outline (Channel B).
2.  *Is this a systemic breakdown?* -> Generate a YouTube video essay script and interactive data visualization spec (Channel A).
3.  *Is this a quick thought?* -> Generate 3 short-form hooks for TikTok/Shorts testing.

## 3. THE GUI / UX LAYER (The Human-in-the-Loop Review)
This is where the automation hits the required stop-gap. Odysseus does not publish directly; it queues the synthesized outputs in the local GUI.

**The Odysseus Dashboard Design:**
*   **The Inbox:** A Trello-style or list-view queue of generated content ideas, tagged by source (e.g., `[Reluctant Capitalist]`, `[MLM Truth]`).
*   **The Preview Pane:** Shows the raw input on the left and the AI-generated outputs (Script, Substack post, Hook) on the right.
*   **The Action Buttons:** 
    *   `Approve -> Send to Cloud Render` (Triggers API calls to Descript/Midjourney).
    *   `Pivot Channel` (Moves a Channel A concept to Channel B based on JD's intuition).
    *   `Reject & Regenerate` (Sends back to the local LLM with new prompting).

## 4. NEXT STEPS FOR TECHNICAL IMPLEMENTATION
1.  **Define the Odysseus API:** Does Odysseus currently accept incoming webhooks, or does it need a polling script to read from the local file directories?
2.  **Write the Directory Watcher:** Deploy the `watchdog` Python script to actively monitor the project folders.
3.  **Configure the RAG Index:** Ensure Odysseus has a fast, local vector database (like ChromaDB or FAISS) to embed the historical markdown files so new inputs are always contextualized by the past.
