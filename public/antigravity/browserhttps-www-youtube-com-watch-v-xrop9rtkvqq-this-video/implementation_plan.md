# Generate Remotion Starter Project

This plan sets up a complete Remotion starter project that implements the "video essay / commentary" editorial style based on the breakdown provided. The new project will be created in your workspace.

## User Review Required

> [!IMPORTANT]
> Since this project requires placeholder assets to render properly (images, videos, character poses), I will create simple placeholder images/videos to stand in for the assets mentioned in the breakdown. You will need to replace these placeholders with your actual assets (e.g., character poses, billionaire photos) in the `public/` directory after the project is generated.

> [!NOTE]
> The project will be created in `[local path redacted]`. You should set this directory as your active workspace after creation.

## Proposed Changes

### Setup and Configuration

I will use `npx create-video` to initialize a new blank Remotion project and install the necessary dependencies, including the Google Fonts mentioned in the breakdown.

#### [NEW] [local path redacted] (modified)
I will add the required font dependencies: `@fontsource/league-gothic` and `@fontsource/bebas-neue`.

### Core Application

#### [NEW] [local path redacted]
Will register the main `MyVideo` composition and import the necessary fonts.

#### [NEW] [local path redacted]
Will assemble all the scenes together into the main timeline using Remotion `<Sequence>` components.

### Reusable Components

#### [NEW] [local path redacted]
The Character component that swaps between static poses based on a `pose` prop.

#### [NEW] [local path redacted]
The red angled text overlay component with spring animation.

### Scenes

#### [NEW] [local path redacted]
The introductory title card scene.

#### [NEW] [local path redacted]
A scene to display a character pose alongside a headline.

#### [NEW] [local path redacted]
The B&W photo essay scene with slow zoom and text slide-in.

#### [NEW] [local path redacted]
The animated word cloud background.

#### [NEW] [local path redacted]
The falling dollar bills particle effect.

#### [NEW] [local path redacted]
The spinning 3D CSS gold coin.

#### [NEW] [local path redacted]
The grid displaying photos and net worths.

### Placeholder Assets

I will create simple placeholder images in the `public/` folder so that the project runs out-of-the-box without missing file errors.

## Verification Plan

### Automated Tests
- Verify that the Remotion project compiles successfully without any missing components or type errors by checking the development server.

### Manual Verification
- You can run `npm start` in the project directory to open the Remotion Studio and preview the timeline to ensure everything renders as expected.
