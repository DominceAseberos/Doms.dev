# Building Custom ASCII Animations Like Cline's Cursor-Following Robot Logo

## Complete Developer Guide with Web Tools & Cross-Platform Support

---

## Table of Contents
1. [Overview](#overview)
2. [How Cline's Animation Works](#how-clines-animation-works)
3. [Architecture Breakdown](#architecture-breakdown)
4. [Building Your Own: Step-by-Step](#building-your-own-step-by-step)
5. [Web Tools & Libraries](#web-tools--libraries)
6. [Complete Working Examples](#complete-working-examples)
7. [Advanced Techniques](#advanced-techniques)
8. [Cross-Platform Adaptation](#cross-platform-adaptation)
9. [Resources & References](#resources--references)

---

## Overview

The Cline CLI features an **animated ASCII art robot** that appears to watch and follow your mouse cursor on the home screen. This document explains exactly how it works and provides everything you need to build your own custom ASCII animation with cursor-tracking capabilities — **for CLI, web browsers, or any platform**.

### Key Features of Cline's Robot Animation
- **130 pre-rendered frames** of ASCII art (34×12 characters)
- **Real-time cursor tracking** with 30ms throttling (~33 FPS)
- **Smooth frame interpolation** at 12ms intervals (~83 FPS)
- **Directional facing**: Robot turns its head to look at cursor position
- **Dual-mode tracking**: Follows mouse when idle, follows text cursor when typing
- **Color support**: 3-color palette (black, white, gray) with run-length encoding
- **Cross-platform**: Works in CLI (Node.js), web browsers (JS/HTML), and more

---

## How Cline's Animation Works

### Animation Flow

```
Mouse Move → Cursor Position → Calculate Angle to Robot → Map to Target Frame → Interpolate Frames (12ms) → Render ASCII Art
```

1. **Cursor Tracking**: A mouse move handler captures cursor position on the container
2. **Angle Calculation**: Computes dx/dy between cursor and robot's face position
3. **Frame Mapping**: Maps the horizontal offset to a frame index (0-129 range)
4. **Frame Interpolation**: Smoothly transitions from current frame to target frame using easing
5. **Rendering**: Current frame is rendered with per-cell color segmentation

### Frame Mapping Logic

```typescript
// Frame zones (0-129 total)
FRAME_STRAIGHT = 0      // Forward-facing
FRAME_BOTTOM_LEFT = 64  // Looking bottom-left
FRAME_BOTTOM_CENTER = 96 // Looking straight down
FRAME_BOTTOM_RIGHT = 128 // Looking bottom-right
```

### Sample ASCII Art Frames

**Straight Pose (Frame 0):**
```
                @@
              @@@@@@
         @@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@
      @@@@@@@@@@@@@@@@@@@@@@
      @@@@@    @@@@    @@@@@
    @@@@@@     *@@@     @@@@@@
    @@@@@@     *@@@     @@@@@@
      @@@@@    @@@@.   @@@@@
      @@@@@@@@@@@@@@@@@@@@@@
       @@@@@@@@@@@@@@@@@@@@
         @@@@@@@@@@@@@@@@.
```

**Bottom-Right Facing (Frame 128+):**
```
          @@@@@
          @@@@@@@@@@@+
     +@@@@@@@@@@@@@@@@@#
   @@@@@@@@@@@@@@@@@@@@@@
  .@@@@@@@@@@@@@@@@@@@@@@.
   @. @@.  @@@@@@@@@@@@@@@
   @; @@*  @@@@@@@@@@@@@@@
   +@  @#   @@@@@@@@@@@@@
    @: @@.  @@@@@@@@@@@@
         @@@@@@@@@@@@@@@@@@
     @@@@@@@@@@@@@@@@

---

## Architecture Breakdown

### File Structure (from Cline source code)

```
apps/cli/src/tui/
├── index.tsx                       # Entry point - creates OpenTUI renderer
├── root.tsx                        # Root component - conditionally renders views
├── views/
│   └── home-view.tsx              # Home screen with mouse tracking + robot
├── components/
│   ├── tracked-robot.tsx          # Mouse tracker hook + robot wrapper
│   ├── robot-animation.tsx        # Core animation logic (frame interpolation)
│   └── robot-frames.ts            # Frame data decoder (loads from JSON)
│       robot-frames.generated.json # 156KB encoded ASCII art frames
├── hooks/
│   ├── use-theme.ts               # Theme provider hook
│   └── theme-provider.ts          # Theme state management
└── themes.ts                       # Color theme definitions
```

### Core Component Code (from Cline source)

**`robot-animation.tsx` - The animation engine:**
```typescript
export function RobotAnimation({ cursorX, cursorY, defaultColor }) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [targetFrame, setTargetFrame] = useState(0);
    const { width, height } = useTerminalDimensions();

    const faceX = Math.floor(width / 2);
    const trackStartY = Math.floor(height / 2) - 6;

    // Phase 1: Calculate target frame from cursor position
    useEffect(() => {
        const dx = cursorX - faceX;
        const dy = cursorY - trackStartY;

        if (dy < 0 || dy > height - trackStartY) {
            setTargetFrame(0);
            return;
        }

        const clampedDx = Math.max(-40, Math.min(40, dx));
        const normalized = clampedDx / 40;

        let target;
        if (normalized <= 0) {
            target = Math.round(64 + (1 + normalized) * (96 - 64));
        } else {
            target = Math.round(96 + normalized * (128 - 96));
        }
        setTargetFrame(target);
    }, [cursorX, cursorY, width, height]);

    // Phase 2: Smooth interpolation (every 12ms)
    useEffect(() => {
        const interval = setInterval(() => {
            setFrameIndex(current => {
                if (current === targetFrame) return current;
                const diff = targetFrame - current;
                const step = Math.sign(diff) * Math.max(Math.abs(Math.round(diff * 0.5)), 1);
                const next = current + step;
                if ((diff > 0 && next > targetFrame) || (diff < 0 && next < targetFrame)) {
                    return targetFrame;
                }
                return next;
            });
        }, 12);
        return () => clearInterval(interval);
    }, [targetFrame]);

    const frame = FRAMES[Math.max(0, Math.min(frameIndex, FRAMES.length - 1))];
        return <RobotFrame frame={frame} defaultColor={defaultColor} />;
}
```

---

## Building Your Own: Step-by-Step

### Step 1: Create ASCII Art Frames

**Option A: Manual Creation**
Create 50-130 frames using simple ASCII characters:

| Character | Visual Density |
|-----------|----------------|
| `.` `·` `,` | Lightest |
| `:` `o` `*` | Light |
| `=` `+` `#` | Medium |
| `@` `M` `W` | Darkest |
| ` ` (space) | Empty |

**Option B: Generate with Figlet**
```javascript
const figlet = require('figlet');
const text = figlet.textSync('HELLO', { font: 'Standard' });
console.log(text);
```

**Option C: Convert Images to ASCII**
```javascript
const Jimp = require('jimp');
async function imageToAscii(imagePath, width = 34) {
    const image = await Jimp.read(imagePath);
    const asciiChars = ' .:-=+*#%@';
    const resized = image.resize(width, Jimp.AUTO);
    let ascii = '';
    for (let y = 0; y < resized.bitmap.height; y++) {
        for (let x = 0; x < resized.bitmap.width; x++) {
            const pixel = resized.getPixelColor(x, y);
            const gray = (pixel >> 24 & 0xFF) * 0.3 + (pixel >> 16 & 0xFF) * 0.59 + (pixel >> 8 & 0xFF) * 0.11;
            const charIndex = Math.floor((gray / 255) * (asciiChars.length - 1));
            ascii += asciiChars[asciiChars.length - 1 - charIndex];
        }
        ascii += '\n';
    }
    return ascii;
}
```

### Step 2: Implement Cursor Tracking

**For Web Browsers:**
```javascript
function useMousePosition() {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);
    return mousePos;
}
```

**For CLI Terminals:**
```javascript
process.stdout.write('\x1b[?1003h\x1b[?1006h'); // Enable mouse tracking
stdin.setRawMode(true);
stdin.on('data', (data) => {
    if (data[0] === 0x1b && data[1] === '[' && data[2] === '<') {
        const match = data.toString().match(/\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
        if (match) {
            cursorX = parseInt(match[2], 10);
            cursorY = parseInt(match[3], 10);
        }
    }
});
```

### Step 3: Calculate Target Frame

```javascript
function getTargetFrame(cursorX, faceX, maxOffset = 40, frameLeft = 64, frameCenter = 96, frameRight = 128) {
    const clampedDx = Math.max(-maxOffset, Math.min(maxOffset, cursorX - faceX));
    const normalized = clampedDx / maxOffset;
    if (normalized <= 0) {
        return Math.round(frameLeft + (1 + normalized) * (frameCenter - frameLeft));
    } else {
        return Math.round(frameCenter + normalized * (frameRight - frameCenter));
    }
}
```

### Step 4: Implement Frame Interpolation

```javascript
function interpolateToTarget(currentFrame, targetFrame) {
    if (currentFrame === targetFrame) return currentFrame;
    const diff = targetFrame - currentFrame;
    const step = Math.sign(diff) * Math.max(Math.abs(Math.round(diff * 0.5)), 1);
    const next = currentFrame + step;
    if ((diff > 0 && next > targetFrame) || (diff < 0 && next < targetFrame)) {
        return targetFrame;
    }
    return next;
}

// Animation loop
setInterval(() => {
    currentFrame = interpolateToTarget(currentFrame, targetFrame);
    renderFrame(currentFrame);
}, 12); // ~83 FPS
```

### Step 5: Frame Data Storage

```json
{
    "width": 34,
    "height": 12,
    "palette": ["black", "whiteBright", "gray"],
    "frames": [
        ["row1_data", "row2_data"],
        [color_run_length_data]
    ]
}
```

### Step 6: Render with Colors

**For Web:**
```javascript
function renderFrame(frame) {
    const container = document.getElementById('ascii-art');
    let html = '';
    for (let y = 0; y < frame.length; y++) {
        for (let x = 0; x < frame[y].length; x++) {
            const char = frame[y][x];
            const color = getCellColor(x, y, frame.colors);
            html += `<span style="color:${color}">${char || ' '}</span>`;
        }
        html += '\n';
    }
    container.innerHTML = `<pre style="font-family:monospace">${html}</pre>`;
}
```

**For CLI (ANSI):**
```javascript
function renderFrame(frame) {
    frame.rows.forEach(row => {
        process.stdout.write('\x1b[97m' + row + '\x1b[0m\n');
    });
}
```

---

## Web Tools & Libraries

### Terminal Emulation for Web

| Tool | Description | URL | Key Features |
|------|-------------|-----|--------------|
| **xterm.js** | Terminal frontend for web browsers | [xtermjs.org](https://xtermjs.org/) | Full terminal emulator, WebGL, addons |
| **hterm** | ChromeOS terminal emulator | [github.com/libapps/hterm](https://github.com/libapps/hterm) | SSH/WebSocket support |

### ASCII Art Generation Tools

| Tool | Description | URL | Key Features |
|------|-------------|-----|--------------|
| **figlet.js** | ASCII art text generator | [github.com/patorjk/js-figlet](https://github.com/patorjk/js-figlet) | 300+ fonts, browser/Node.js |
| **figlet fonts** | Font collection | [figlet.org](http://www.figlet.org/) | Standard, Slant, Big, Small |
| **jimp** | Image processing in pure JS | [npmjs.com/package/jimp](https://www.npmjs.com/package/jimp) | Resize, filter, format conversion |

### Web Terminal UI Frameworks

| Tool | Description | URL | Key Features |
|------|-------------|-----|--------------|
| **React** | JavaScript library for UIs | [react.dev](https://react.dev/) | Component-based, hooks, virtual DOM |
| **Vue.js** | Progressive framework | [vuejs.org](https://vuejs.org/) | Template-based, reactive data |
| **Svelte** | Compiler for UI components | [svelte.dev](https://svelte.dev/) | Compile-time optimization |
| **OpenTUI** | Terminal UI framework | [opentui.sh](https://opentui.sh/) | React-like, mouse tracking |

### Animation Libraries

| Tool | Description | URL | Key Features |
|------|-------------|-----|--------------|
| **GSAP** | Professional animation library | [greensock.com/gsap](https://greensock.com/gsap/) | 3500+ easing, timeline control |
| **Framer Motion** | Production-ready animations | [framer.com/motion](https://www.framer.com/motion/) | Gestures, layout animations |
| **Anime.js** | Lightweight animation library | [animejs.com](https://animejs.com/) | CSS, JS, SVG animations |
| **ora** | Terminal spinner library | [npmjs.com/package/ora](https://www.npmjs.com/package/ora) | 70+ spinners, CLI only |

### Color & Styling Libraries

| Tool | Description | URL | Key Features |
|------|-------------|-----|--------------|
| **yoctocolors** | Fastest CLI color library | [npmjs.com/package/yoctocolors](https://www.npmjs.com/package/yoctocolors) | 8M ops/sec, tree-shakeable |
| **chalk** | Popular CLI styling | [npmjs.com/package/chalk](https://www.npmjs.com/package/chalk) | Mature, 256/truecolor, nested |
| **ansi-escapes** | Terminal control codes | [npmjs.com/package/ansi-escapes](https://www.npmjs.com/package/ansi-escapes) | Cursor, screen, all escape codes |
| **tailwindcss** | Utility-first CSS | [tailwindcss.com](https://tailwindcss.com/) | Utility classes, JIT, dark mode |

#### ANSI Escape Code Quick Reference

```bash
# Cursor movement
\x1b[<n>A     # Cursor up n lines
\x1b[<n>B     # Cursor down n lines
\x1b[<n>C     # Cursor forward n columns
\x1b[<x>;<y>H  # Cursor to absolute position
\x1b[s        # Save cursor position
\x1b[u        # Restore cursor position

# Screen control
\x1b[2J       # Clear entire screen
\x1b[K        # Clear line from cursor to end
\x1b[?25l     # Hide cursor
\x1b[?25h     # Show cursor
\x1b[?1003h   # Enable mouse tracking
\x1b[?1006h   # Enable SGR mouse mode

# Colors
\x1b[30m-37m  # Black through White
\x1b[90m-97m  # Bright variants
\x1b[0m       # Reset all attributes
```

---

## Complete Working Examples

### Example 1: Web Browser Version (Vanilla JavaScript)

```html
<!DOCTYPE html>
<html>
<head>
    <title>ASCII Cursor-Following Robot</title>
    <style>
        body { margin: 0; overflow: hidden; background: #000; }
        #ascii-container {
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1;
            white-space: pre;
            position: absolute;
            top: 50%; left: 50%;
            transform: translate(-50%, -50%);
        }
    </style>
</head>
<body>
    <div id="ascii-container"></div>
    <script>
        const FRAMES = {
            straight: [
                "                @@                ",
                "              @@@@@@              ",
                "         @@@@@@@@@@@@@@@@         ",
                "      @@@@@@@@@@@@@@@@@@@@@@      ",
                "      @@@@@    @@@@    @@@@@      ",
                "    @@@@@@     *@@@     @@@@@@    ",
                "      @@@@@    @@@@.   @@@@@      ",
                "      @@@@@@@@@@@@@@@@@@@@@@      ",
            ],
            left: [
                "          @@@@@                   ",
                "          @@@@@@@@@@@+            ",
                "     +@@@@@@@@@@@@@@@@@#          ",
                "   @@@@@@@@@@@@@@@@@@@@@@         ",
                "  .@@@@@@@@@@@@@@@@@@@@@@.        ",
                "   @. @@.  @@@@@@@@@@@@@@@        ",
            ]
        };
        let cursorX = 0, cursorY = 0;
        let currentFrameIndex = 0, targetFrame = 0;

        document.addEventListener('mousemove', (e) => {
            cursorX = e.clientX; cursorY = e.clientY;
        });

        setInterval(() => {
            const container = document.getElementById('ascii-container');
            const rect = container.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const dx = cursorX - centerX;
            const normalized = Math.max(-200, Math.min(200, dx)) / 200;

            targetFrame = normalized < -0.3 ? 1 : (normalized > 0.3 ? 2 : 0);

            if (currentFrameIndex !== targetFrame) {
                const diff = targetFrame - currentFrameIndex;
                const step = Math.sign(diff) * Math.max(Math.abs(Math.round(diff * 0.5)), 1);
                currentFrameIndex += step;
                if ((diff > 0 && currentFrameIndex > targetFrame) ||
                    (diff < 0 && currentFrameIndex < targetFrame)) {
                    currentFrameIndex = targetFrame;
                }
            }

            const frameKeys = ['straight', 'left', 'straight'];
            const idx = Math.max(0, Math.min(currentFrameIndex, frameKeys.length - 1));
            container.textContent = FRAMES[frameKeys[idx]].join('\n');
        }, 12);
    </script>
</body>
</html>
```

### Example 2: React Web Version

```tsx
import React, { useState, useEffect } from 'react';

const FRAMES = { straight: ["..."], left: ["..."], right: ["..."] };

function useMousePosition() {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    useEffect(() => {
        const handler = (e) => setPos({ x: e.clientX, y: e.clientY });
        window.addEventListener('mousemove', handler);
        return () => window.removeEventListener('mousemove', handler);
    }, []);
    return pos;
}

function CursorFollowingRobot({ cursorX, cursorY, width, height }) {
    const [frameIndex, setFrameIndex] = useState(0);
    const [targetFrame, setTargetFrame] = useState(0);
    const faceX = width / 2;

    useEffect(() => {
        const dx = cursorX - faceX;
        const normalized = Math.max(-200, Math.min(200, dx)) / 200;
        if (normalized < -0.3) setTargetFrame(1);
        else if (normalized > 0.3) setTargetFrame(2);
        else setTargetFrame(0);
    }, [cursorX, faceX]);

    useEffect(() => {
        const interval = setInterval(() => {
            setFrameIndex(current => {
                if (current === targetFrame) return current;
                const diff = targetFrame - current;
                const step = Math.sign(diff) * Math.max(Math.abs(Math.round(diff * 0.5)), 1);
                return Math.abs(current + step - targetFrame) < Math.abs(diff) ? current + step : targetFrame;
            });
        }, 12);
        return () => clearInterval(interval);
    }, [targetFrame]);

    const frameKeys = ['straight', 'left', 'straight', 'right'];
    const frame = FRAMES[frameKeys[Math.max(0, Math.min(frameIndex, frameKeys.length - 1))]];

    return <pre style={{ fontFamily: 'monospace', color: '#fff' }}>{frame.join('\n')}</pre>;
}

function App() {
    const mouse = useMousePosition();
    return (
        <div style={{ width: '100vw', height: '100vh', background: '#000', overflow: 'hidden' }}>
            <CursorFollowingRobot mouse={mouse} />
        </div>
    );
}
export default App;
```

### Example 3: Node.js CLI Version

```javascript
#!/usr/bin/env node
const { stdout, stdin } = require('process');

const frames = { straight: ["..."], left: ["..."] };
const colors = { reset: '\x1b[0m', white: '\x1b[97m', hide: '\x1b[?25l', show: '\x1b[?25h' };

let cursorX = 0, cursorY = 0, currentFrame = 0, targetFrame = 0, lastUpdate = 0;

stdout.write('\x1b[?1003h\x1b[?1006h\x1b[?25l');
stdin.setRawMode(true); stdin.resume();

stdin.on('data', (data) => {
    if (data[0] === 0x1b && data[1] === '[' && data[2] === '<') {
        const m = data.toString().match(/\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
        if (m && Date.now() - lastUpdate >= 30) {
            lastUpdate = Date.now();
            cursorX = parseInt(m[2], 10); cursorY = parseInt(m[3], 10);
        }
    }
    if (data[0] === 0x03) {
        stdout.write('\x1b[?1003l\x1b[?1006l\x1b[?25h');
        process.exit(0);
    }
});

const frameKeys = ['straight', 'left'];
let lastTarget = 0;

setInterval(() => {
    if (Date.now() - lastTarget > 50) {
        const dx = cursorX - Math.floor(stdout.columns / 2);
        targetFrame = Math.max(-40, Math.min(40, dx)) / 40 < -0.33 ? 1 : 0;
        lastTarget = Date.now();
    }
    if (currentFrame !== targetFrame) {
        const diff = targetFrame - currentFrame;
        const step = Math.sign(diff) * Math.max(Math.abs(Math.round(diff * 0.5)), 1);
        currentFrame += step;
        if ((diff > 0 && currentFrame > targetFrame) || (diff < 0 && currentFrame < targetFrame)) {
            currentFrame = targetFrame;
        }
    }
    const startY = Math.floor((stdout.rows - 12) / 2);
    const startX = Math.floor((stdout.columns - 34) / 2);
    stdout.write('\x1b[2J\x1b[H');
    stdout.write(`\x1b[${startY};${startX}H`);
    const frame = frames[frameKeys[Math.max(0, Math.min(currentFrame, frameKeys.length - 1))]];
    frame.forEach(row => stdout.write(colors.white + row + colors.reset + '\n'));
}, 12);

stdout.on('resize', () => stdout.write('\x1b[2J\x1b[H'));
```

---

## Advanced Techniques

### Technique 1: Multi-Layer Animation
```javascript
// Background pattern animates independently
const bgPattern = generateGradientPattern(width, height, time);
renderLayer(bgPattern, 0, 0);
renderLayer(robotFrame, robotX, robotY);
```

### Technique 2: Text Streaming / Typewriter Effect
```javascript
class TextStreamer {
    constructor(text, speed = 30) {
        this.text = text; this.speed = speed;
        this.index = 0; this.visible = '';
    }
    next() {
        if (this.index >= this.text.length) return null;
        this.visible += this.text[this.index++];
        return this.visible;
    }
    isDone() { return this.index >= this.text.length; }
}
```

### Technique 3: Frame Compression with RLE
```javascript
function encodeColors(colorsGrid) {
    const result = [];
    let currentColor = null; let count = 0;
    for (const row of colorsGrid) {
        for (const ci of row) {
            if (ci === currentColor) count++;
            else { if (currentColor !== null) result.push(count, currentColor);
                     currentColor = ci; count = 1; }
        }
    }
    if (currentColor !== null) result.push(count, currentColor);
    return result;
}
```

### Technique 4: Cursor-Aware Targeting
```javascript
const trackedX = hasTypedInput
    ? clamp(inputStartX + inputCursor.visualCol, 0, width)
    : mouse.cursor.x;
const trackedY = hasTypedInput
    ? clamp(height - 2 + inputCursor.visualRow, 0, height)
    : mouse.cursor.y;
```

### Technique 5: Shared Frame Data Across Platforms
```javascript
function decodeFrames(encoded) {
    return encoded.frames.map(([rows, colorRuns]) => ({
        rows,
        colors: decodeRunLengthColors(colorRuns, encoded.palette, encoded.width, encoded.height)
    }));
}
```

---

## Cross-Platform Adaptation

### Platform Detection
```javascript
const isBrowser = typeof window !== 'undefined';
const isNode = typeof process !== 'undefined' && process.versions?.node;
const isElectron = isNode && process.type === 'renderer';
```

### Unified Cursor Tracking
```javascript
function createCursorTracker() {
    if (isBrowser) {
        let x = 0, y = 0;
        window.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; });
        return () => ({ x, y });
    } else if (isNode) {
        const { stdin, stdout } = process;
        let x = 0, y = 0;
        stdout.write('\x1b[?1003h\x1b[?1006h');
        stdin.setRawMode(true);
        stdin.on('data', (data) => {
            const m = data.toString().match(/\x1b\[<(\d+);(\d+);(\d+)([Mm])/);
            if (m) { x = parseInt(m[2], 10); y = parseInt(m[3], 10); }
        });
        return () => ({ x, y });
    }
}
```

---
## Resources & References

### Official Documentation
- **[OpenTUI](https://opentui.sh/)** - React-like terminal framework Cline uses
- **[xterm.js](https://xtermjs.org/)** - Terminal frontend for web browsers
- **[blessed](https://github.com/chjj/blessed)** - Curses-like terminal library for Node.js
- **[ANSI Escape Codes](https://en.wikipedia.org/wiki/ANSI_escape_code)** - Complete reference

### GitHub Repositories
- **[Cline Source Code](https://github.com/cline/cline/tree/main/apps/cli/src)** - The actual robot animation
- **[figlet.js](https://github.com/patorjk/js-figlet)** - ASCII art text generator
- **[ansi-escapes](https://github.com/sindresorhus/ansi-escapes)** - ANSI escape utilities
- **[cli-spinners](https://github.com/sindresorhus/cli-spinners)** - 70+ spinner definitions

### Online Tools
- **[ASCII Art Archive](https://www.asciiart.eu/)** - Collection of ASCII art examples
- **[FIGlet Font Database](http://www.figlet.org/fontdb.cgi)** - 300+ figlet fonts
- **[Unicode Table](https://unicode-table.com/)** - Block elements, symbols

### npm Packages Quick Install
```bash
# Terminal UI frameworks
npm install @opentui/core @opentui/react      # Cline's CLI choice
npm install xterm                            # Web terminal emulator
npm install blessed                          # Classic terminal library

# Animation libraries
npm install ora                                # CLI spinner
npm install framer-motion                      # Web animation
npm install gsap                               # Professional web animation
npm install animejs                           # Lightweight web animation

# Colors & styling
npm install yoctocolors                        # Fastest CLI colors
npm install chalk                              # Popular CLI styling
npm install ansi-escapes                       # Terminal control codes
npm install tailwindcss                        # Web utility CSS

# ASCII art generation
npm install figlet                             # Text to ASCII art
npm install sharp                              # Image processing
npm install jimp                               # Image manipulation (pure JS)
```

### Font Recommendations for ASCII Art
- **Standard**: Classic block letters for headers
- **Slant**: Diagonal-stressed letters, compact
- **Big**: Large block letters for impact
- **Small**: Compact letters for limited space
- **Banner3**: Dotted letters, subtle effect
- **Doom**: Gothic-style letters for drama

### Character Set Guide for ASCII Art
| Density | Characters | Best For |
|---------|------------|----------|
| Highest (background) | `. , '` | Gradients, shadows |
| Medium | `: o * ~` | Mid-tone areas |
| Low | `= + # @` | Foreground objects |
| Special | `* @ .` | Eyes, highlights |

### Performance Optimization Tips
1. **Throttle mouse events** to 30ms minimum (~33 FPS)
2. **Use 12ms interval** for frame interpolation (~83 FPS)
3. **Cache rendered frames** to avoid re-parsing
4. **Use RLE** for color data compression
5. **Limit frame count** to 50-130 frames
6. **Detect interactive context** before enabling
7. **Handle resize events** for responsive positioning
8. **For web**: Use `requestAnimationFrame` instead of `setInterval`
9. **For web**: Use CSS `font-family: monospace`
10. **Use `visibility: hidden`** instead of `display: none` for cached frames

---

*Guide complete. Build your own cursor-following ASCII animation for CLI, web, or any platform.*