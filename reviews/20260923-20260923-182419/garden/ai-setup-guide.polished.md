---
title: "AI Setup Guide"
description: "A guide to configuring AI-powered features in your Obsidian vault for enhanced productivity and knowledge management."
date: "2026-09-23"
vault: true
tags: ["ai","obsidian","plugins","setup","productivity","knowledge management","automation","configuration"]
source: "Knowledge/References/ai-setup-guide.md"
---
### AI Assistance Setup Guide

This guide helps you configure AI-powered features in your Obsidian vault.

#### Recommended AI Plugins

##### 1. Text Generator
**Purpose**: Generate content, summaries, and ideas
**Install**: Community Plugins → Search "Text Generator"
**Setup**:
- Choose your preferred AI provider (OpenAI, Anthropic, etc.)
- Configure API key in settings
- Set up custom prompts in the templates

##### 2. Copilot
**Purpose**: Smart autocomplete and suggestions
**Install**: Community Plugins → Search "Copilot"
**Setup**:
- Enable in settings
- Configure model preferences
- Set up custom commands

##### 3. Smart Connections
**Purpose**: Find related notes and build knowledge graphs
**Install**: Community Plugins → Search "Smart Connections"
**Setup**:
- Install local AI model or use API
- Configure embedding settings
- Set up automatic indexing

##### 4. AI Chat
**Purpose**: Conversational AI assistant within Obsidian
**Install**: Community Plugins → Search "AI Chat"
**Setup**:
- Configure API keys
- Set up custom personas
- Enable note context awareness

#### Configuration Steps

##### Step 1: Install Core Plugins
1. Open Obsidian Settings → Community Plugins
2. Turn on Community Plugins
3. Browse and install the plugins above

##### Step 2: Configure API Keys
For each plugin, you'll need:
- **OpenAI**: API key from platform.openai.com
- **Anthropic**: API key from console.anthropic.com
- **Local Models**: Ollama or similar for privacy

##### Step 3: Set Up Custom Prompts

###### Text Generator Prompts
```yaml
summarize: "Summarize the following text in 3 bullet points:"
expand: "Expand this idea with examples and details:"
connect: "Find connections between these concepts:"
critique: "Provide constructive feedback on:"
```

###### AI Chat Personas
- **Research Assistant**: Helps with information gathering
- **Writing Coach**: Improves clarity and style
- **Idea Generator**: Brainstorms new concepts
- **Productivity Expert**: Optimizes workflows

#### AI Workflows

##### Daily Workflow
1. **Morning**: AI analyzes yesterday's patterns
2. **Planning**: AI suggests optimal task ordering
3. **Writing**: AI provides real-time suggestions
4. **Evening**: AI generates insights from the day

##### Knowledge Building
1. **Capture**: Quick notes in inbox
2. **Process**: AI categorizes and tags
3. **Connect**: AI finds related notes
4. **Synthesize**: AI generates new insights

##### Project Management
1. **Planning**: AI breaks down objectives
2. **Risk Analysis**: AI identifies potential issues
3. **Resource Allocation**: AI optimizes assignments
4. **Progress Tracking**: AI analyzes patterns

#### Template Integration

Each template includes AI prompts specifically designed for:
- **Daily Notes**: Pattern analysis and recommendations
- **Projects**: Risk assessment and optimization
- **Zettelkasten**: Connection discovery and expansion
- **Inbox**: Automatic categorization and processing

#### Privacy Considerations

##### Local AI Options
- **Ollama**: Run models locally
- **LM Studio**: Local model management
- **GPT4All**: Privacy-focused models

##### Data Management
- Review what data is sent to APIs
- Use local models for sensitive information
- Regularly audit AI-generated content

#### Advanced Features

##### Custom Commands
Create custom AI commands for:
- Literature review synthesis
- Meeting summary generation
- Code documentation
- Learning path creation

##### Automation
Set up automatic:
- Tag suggestions
- Link recommendations
- Content summarization
- Knowledge gap identification
