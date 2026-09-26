# Implementation Plan: Remotion Project Build-Out

We will build out the Remotion project for **Concept 1: The Beta Testers of Real Life** to include actual animated components, audio scaffolding, and placeholder visuals. This will turn the basic structure into a dynamic video template.

## User Review Required
> [!IMPORTANT]
> Please review the proposed components and asset structure below. Once approved, I will implement the code and you can preview the animated results in your browser.

## Open Questions
> [!WARNING]
> 1. Do you have a recorded VoiceOver (e.g. an MP3 or WAV file) ready, or should I just set up a placeholder track in the `public` folder that you can replace later?
> 2. For B-roll, I plan to use placeholder CSS gradients and generic shapes for now until you have specific video files to drop in. Is that acceptable?

## Proposed Changes

We will create new reusable React components in the `src/` directory and refactor the main video file.

### Remotion Components

#### [NEW] [AnimatedText.tsx](file://[local path redacted])
- A reusable component that uses Remotion's `spring()` and `useCurrentFrame()` to animate text fading and sliding up onto the screen. This will be used for subtitles and key points.

#### [NEW] [TitleCard.tsx](file://[local path redacted])
- A component specifically for full-screen title cards (e.g. "The Beta Testers of Real Life", "The First Cracks in the Wall"). It will feature a stylized, retro 90s aesthetic (e.g., monospace fonts or glitch effects) that animates in.

#### [NEW] [SceneWrapper.tsx](file://[local path redacted])
- A wrapper component to manage the background (B-roll placeholder) and layer the text/animations on top. It will allow us to easily swap out CSS backgrounds for actual `<Video>` tags later.

### Main Video Refactor

#### [MODIFY] [BetaTestersVideo.tsx](file://[local path redacted])
- Replace the raw HTML elements with our new `AnimatedText` and `TitleCard` components.
- Add an `<Audio />` tag mapped to a generic `voiceover.mp3` file (which we will place in the `public/` directory).
- Sync the timing of the animated text to the general pacing of the script.

## Verification Plan

### Manual Verification
- Start the Remotion dev server (`npm run dev`).
- Open the browser to view the generated scenes.
- Scrub the timeline to ensure `spring` animations trigger correctly and the audio track plays.
