# GEMINI.md - Project Overview: AudioV

## Project Overview

AudioV is a Nuxt.js web application that functions as a smart audio player with 3D visualizations. It analyzes audio files to automatically mix them with crossfades and generates a dynamic 3D scene that reacts to the music.

*   **Framework**: Nuxt.js 3
*   **Language**: TypeScript
*   **UI**: Vue.js 3
*   **3D Graphics**: TresJS (a declarative layer for Three.js)
*   **Audio Processing**:
    *   **Playback**: Web Audio API
    *   **Analysis**: Meyda.js, web-audio-beat-detector
*   **State Management**: Pinia

## Building and Running

The following commands are available in `package.json`:

*   **`npm run dev`**: Starts the development server with hot-reloading.
*   **`npm run build`**: Builds the application for production.
*   **`npm run generate`**: Statically generates the application.
*   **`npm run preview`**: Previews the production build.
*   **`npm install`**: Installs the project dependencies.

## Project Structure

*   **`/app/components`**: Contains reusable Vue.js components for both the UI (`Start.vue`, `Waveform.vue`, `Overflow.vue`) and the 3D scene (`Sphere.vue`, `Plane.vue`).
*   **`/app/stores`**: Pinia stores for state management. `player.ts` manages the state of the audio player.
*   **`/public`**: Static assets, including the audio files (`/public/audio`) and images.
*   **`/server/api`**: Server-side API endpoints. `spotify.ts` suggests an integration with the Spotify API.
*   **`app.vue`**: The main entry point of the application. It sets up the 3D scene and orchestrates the audio playback.
*   **`nuxt.config.ts`**: The configuration file for the Nuxt.js application.

## Core Functionality

### Audio Processing

The application has a sophisticated audio processing pipeline that enables the "smart automix" feature:

1.  **Loading**: Audio files are loaded from the `/public/audio` directory.
2.  **BPM Detection**: The `web-audio-beat-detector` library is used to analyze the audio files and detect their BPM (Beats Per Minute).
3.  **Analysis**: The Meyda.js library is used to analyze the audio files to find their "smart" start and end points by calculating the Root Mean Square (RMS) of the audio signal. This allows the application to trim silence from the beginning and end of the tracks.
4.  **Sequencing**: The Web Audio API is used to schedule the playback of the audio tracks with precise timing. It creates a continuous mix by crossfading between the end of one track and the beginning of the next. It also adjusts the playback rate of the tracks to match the BPM of the next track.
5.  **Real-time Analysis**: During playback, Meyda.js is also used for real-time audio feature extraction (`rms`). This data is then used to drive the 3D visualization.

### 3D Visualization

The application uses TresJS to create a declarative 3D scene with Three.js.

*   The main scene is defined in `app.vue` and consists of a `Sphere` and a `Plane`.
*   The `Sphere` component (`app/components/Sphere.vue`) uses a custom shader material to create a dynamic, animated particle effect. The shaders use Perlin noise and are driven by uniforms (`u_time`, `u_speed`, `u_intensity`) that are updated in real-time based on the audio analysis from Meyda.js. This creates a visual experience that is synchronized with the music.
*   The `Plane` component (`app/components/Plane.vue`) uses a `Reflector` to create a reflective surface and post-processing effects like `Bloom` and `Noise` to enhance the visuals.

## Development Conventions

*   **TypeScript**: The entire codebase is written in TypeScript.
*   **Vue 3 Composition API**: The project heavily utilizes the Vue 3 Composition API, with logic encapsulated in the `setup` script of the components.
*   **Pinia for State Management**: State is managed centrally in a Pinia store (`app/stores/player.ts`).
*   **Shaders in Components**: GLSL shaders are defined as strings directly within the Vue components that use them.
