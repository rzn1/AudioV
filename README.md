# AudioV

AudioV is a smart audio player with 3D visualizations. It analyzes audio files to automatically mix them with crossfades and generates a dynamic 3D scene that reacts to the music.

## Features

*   **Smart Automix**: Automatically crossfades between tracks by analyzing audio to find the perfect transition points.
*   **3D Audio Visualization**: A dynamic 3D scene that reacts in real-time to the music.
*   **Custom Shaders**: Custom GLSL shaders for a unique and immersive visual experience.
*   **Web Audio API**: Precise audio scheduling and playback.
*   **Real-time Audio Analysis**: Audio analysis powered by Meyda.js.

## Technologies Used

*   **Framework**: [Nuxt.js 3](https://nuxt.com/)
*   **Language**: [TypeScript](https://www.typescriptlang.org/)
*   **UI**: [Vue.js 3](https://vuejs.org/)
*   **3D Graphics**: [TresJS](https://tresjs.org/) (a declarative layer for [Three.js](https://threejs.org/))
*   **Audio Processing**:
    *   **Playback**: Web Audio API
    *   **Analysis**: [Meyda.js](https://meyda.js.org/)
*   **State Management**: [Pinia](https://pinia.vuejs.org/)

## Getting Started

### Prerequisites

*   [Node.js](https://nodejs.org/en/) (v18 or higher)
*   [npm](https://www.npmjs.com/)

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/audiov.git
    ```
2.  Install the dependencies:
    ```bash
    npm install
    ```

### Development

Start the development server with hot-reloading:

```bash
npm run dev
```

### Production

Build the application for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Project Structure

*   **/components**: Reusable Vue.js components for the UI and the 3D scene.
*   **/composables**: Reusable Vue Composition API functions.
*   **/public**: Static assets, including audio files and images.
*   **/server/api**: Server-side API endpoints.
*   **/stores**: Pinia stores for state management.
*   **app.vue**: The main entry point of the application.
*   **nuxt.config.ts**: The configuration file for the Nuxt.js application.

## Contributing

Contributions are welcome! Please feel free to open an issue or submit a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.