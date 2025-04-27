
# Excalidraw Overlay App

Customization of *Excalidraw* to be used as a fullscreen overlay application for presentation.

Features:

- Transparent background
- Show/hide all UI controls
- Presets
- Additional keyboard shortcuts
- Configurable laser pointer
    - Size
    - Color
    - Decay time
    - Decay length


## Build

Build the latest Excalidraw package

```bash
yarn run build:package
```

In the excalidraw-overlay-app

```bash
yarn run build:package
yarn run build
```

## Docker

Build

```bash
docker build --pull --rm -f 'excalidraw-overlay-app/Dockerfile' -t 'excalidraw-overlay-app:latest' 'excalidraw-overlay-app'
```

Run

```bash
docker run -d --name excalidraw-overlay-app -p 12347:80 --restart=always excalidraw-overlay-app:latest
```
