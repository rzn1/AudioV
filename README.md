# 💫 AudioV

A **smart audio player** with real-time 3D visualizations that react to your music. Built with Nuxt 3, Three.js (via TresJS), and the Web Audio API.

---

![Nuxt](https://img.shields.io/badge/Nuxt-3-00DC82?style=for-the-badge&logo=nuxt.js&logoColor=white)
![Vue](https://img.shields.io/badge/Vue-3-4FC08D?style=for-the-badge&logo=vue.js&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-black?style=for-the-badge&logo=three.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)

## ✨ Features

### 🎵 Smart Audio Processing
- **BPM Detection** - Automatically detects the tempo of each track
- **Energy Profiling** - Analyzes RMS levels to find the "drop" and "outro" of songs
- **Smart Transitions** - Automatically crossfades between tracks at optimal points
- **7-Band Equalizer** - Fine-tune your audio with a built-in EQ

### 🌌 Real-Time 3D Visualization
- **Reactive Particle Sphere** - A dynamic icosahedron that pulses to the beat
- **Bass & Treble Response** - Low frequencies expand the sphere, highs trigger flashes
- **Adaptive Color Palettes** - "Vibe AI" automatically picks colors based on track energy
- **Bloom & Reflection** - Post-processing effects for that premium look

### 🎨 Vibe AI
The visualizer intelligently adapts to your music:
| Vibe | Trigger | Colors |
|------|---------|--------|
| 🔥 **Rage** | High BPM + High Energy | Red → Orange |
| 🧊 **Chill** | Low BPM + Low Energy | Cyan → Blue |
| 🌑 **Deep** | Low Brightness (Bass Heavy) | Dark Purple |
| 💖 **Pop** | High Brightness | Pink → Purple |

### 🎛️ User Interface
- **Drag & Drop Queue** - Reorder your playlist on the fly
- **Real-Time Waveform** - See your track's energy curve with smart markers
- **Track Title Drop** - Animated title appears when a new song starts
- **Processing Indicator** - Visual feedback during audio analysis

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/rzn1/AudioV.git
cd AudioV

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | Nuxt 3 |
| **UI** | Vue 3 + Nuxt UI |
| **3D Graphics** | TresJS (Three.js wrapper) |
| **Audio** | Web Audio API |
| **BPM Detection** | music-tempo |
| **Feature Extraction** | Meyda.js |
| **State Management** | Pinia |
| **Language** | TypeScript |

---

## 📁 Project Structure

```
AudioV/
├── app/
│   ├── components/
│   │   ├── Sphere.vue      # 3D particle visualization
│   │   ├── Plane.vue       # Reflective floor + post-processing
│   │   ├── TrackTitle.vue  # Animated track name overlay
│   │   ├── Waveform.vue    # Real-time waveform display
│   │   └── Overflow.vue    # Main UI drawer (controls, queue)
│   ├── stores/
│   │   └── player.ts       # Pinia store for audio state
│   ├── workers/
│   │   └── audio.worker.ts # Web Worker for audio analysis
│   └── app.vue             # Main application entry
├── public/
│   └── audio/              # Your audio files here
├── nuxt.config.ts
└── package.json
```

---

## 🎮 Usage

1. **Upload Tracks** - Drag audio files into the upload zone
2. **Wait for Analysis** - BPM and energy profiling runs in the background
3. **Hit Start** - The automix begins with smart transitions
4. **Watch & Vibe** - The sphere reacts to bass, treble, and energy

### Controls
| Control | Description |
|---------|-------------|
| 🎚️ Volume | Master volume slider |
| ⚡ Speed | Particle animation speed |
| 🔴 Flash | Toggle high-frequency flash effect |
| 🎨 Auto Vibe | Let AI pick colors based on track |
| ⏱️ Fade | Crossfade duration between tracks |

---

## 🧪 Development

### Key Files

- **`app/components/Sphere.vue`** - GLSL shaders for the particle effect
- **`app/stores/player.ts`** - Core audio logic (scheduling, crossfading)
- **`app/workers/audio.worker.ts`** - Off-thread BPM & energy analysis

### Shader Uniforms

The sphere uses custom shaders driven by these uniforms:
- `u_time` - Animation clock
- `u_intensity` - Pulsing intensity
- `u_bass` - Low frequency response
- `u_high` - High frequency flash
- `u_color_a` / `u_color_b` - Gradient colors
- `u_partical_size` - Point size

---

## 📜 License

MIT License - feel free to use this for your own projects!

---

## 🙏 Acknowledgments

- [TresJS](https://tresjs.org/) - Vue 3 + Three.js made easy
- [Nuxt UI](https://ui.nuxt.com/) - Beautiful Vue components
- [music-tempo](https://npmjs.com/package/music-tempo) - BPM detection
- [Meyda](https://meyda.js.org/) - Audio feature extraction

---

<p align="center">
  Made with 💜 and way too much coffee
</p>