# Implementation Plan - Export Gemini Sessions and Projects to Odysseus

This plan outlines the steps to migrate user data from the Gemini Antigravity coding assistant to Odysseus.

## Proposed Changes

### 1. Migrating Chat Sessions

We will create a Python migration script `migrate_sessions.py` to:
1. Parse the available conversations and titles from `[local path redacted]`.
2. For each conversation:
   - Read the transcript log from `[local path redacted]/<session_id>/.system_generated/logs/transcript.jsonl`.
   - Extract user messages (`source: USER_EXPLICIT`, `type: USER_INPUT`) and assistant replies (`source: MODEL`, `type: PLANNER_RESPONSE`).
   - Format timestamps to match Odysseus SQLite datetime structure (`YYYY-MM-DD HH:MM:SS.ffffff`).
3. Connect to `[local path redacted]` and insert sessions and messages.
4. Update session-level metadata (`message_count`, `last_message_at`, `last_accessed`).

### 2. Exporting Projects

We will copy all project workspaces from `[local path redacted]/` to `[local path redacted]/`:
- Exclude large dependency/cache directories (`node_modules`, `venv`, `.venv`, `.git`) to prevent disk bloat and keep indexing fast.
- Create `[local path redacted]/` directory if it does not exist.

## Verification Plan

### Manual Verification
1. Run the migration script and inspect output logs for successfully migrated sessions.
2. Verify table entries in `[local path redacted]` via python sqlite3 commands.
3. Check `[local path redacted]/` directory structure to verify copied project files.
