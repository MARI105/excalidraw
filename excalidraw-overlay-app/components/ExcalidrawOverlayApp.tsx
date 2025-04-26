import React, {
  useEffect,
  useState,
  useRef,
  Children,
  cloneElement,
} from "react";

import type * as TExcalidraw from "@excalidraw/excalidraw";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";

import "./ExcalidrawOverlayApp.scss";

export interface AppProps {
  useCustom: (api: ExcalidrawImperativeAPI | null, customArgs?: any[]) => void;
  customArgs?: any[];
  children: React.ReactNode;
  excalidrawLib: typeof TExcalidraw;
}

export default function ExcalidrawOverlayApp({
  useCustom,
  customArgs,
  children,
  excalidrawLib,
}: AppProps) {
  const appRef = useRef<any>(null);

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  useEffect(() => {
    (window as any).excalidrawAPI = excalidrawAPI;
    return () => {
      (window as any).excalidrawAPI = null;
    };
  }, [excalidrawAPI]);

  useCustom(excalidrawAPI, customArgs);

  const renderExcalidraw = (children: React.ReactNode) => {
    const Excalidraw: any = Children.toArray(children).find(
      (child) =>
        React.isValidElement(child) &&
        typeof child.type !== "string" &&
        //@ts-ignore
        child.type.displayName === "Excalidraw",
    );
    if (!Excalidraw) {
      return;
    }
    const newElement = cloneElement(
      Excalidraw,
      {
        excalidrawAPI: (api: ExcalidrawImperativeAPI) => setExcalidrawAPI(api),
        // Defaults
        initialData: {
          appState: { viewBackgroundColor: "transparent" },
        },
        handleKeyboardGlobally: true,
        autoFocus: true,
      },
      <></>,
    );
    return newElement;
  };

  return (
    <div className="App" ref={appRef}>
      <div className="excalidraw-wrapper">{renderExcalidraw(children)}</div>
    </div>
  );
}

// Defaults
(window as any).LASERPOINTER_SIZE = 3;
(window as any).LASERPOINTER_DECAY_TIME = 3000;
(window as any).LASERPOINTER_DECAY_LENGTH = 100;
(window as any).LASERPOINTER_COLOR = "red";

let excalidrawPreset = 1;

setTimeout(() => {
  selectPreset1();
}, 1000);

function showHideControls() {
  const appMenuTopElement = document.querySelector("div.App-menu.App-menu_top");
  const appMenuBottomElement = document.querySelector(
    "footer.App-menu.App-menu_bottom",
  );

  appMenuTopElement.classList.toggle("hidden");
  appMenuBottomElement.classList.toggle("hidden");
}

function emptyScene() {
  window.excalidrawAPI.updateScene({ elements: [] });
  window.excalidrawAPI.history.clear();
}

function selectPreset1() {
  const defaultAppState = {
    currentItemRoundness: "sharp",
    currentItemRoughness: 0,
    currentItemStrokeWidth: 4,
    viewBackgroundColor: "transparent",
  };

  const restoredAppState = window.ExcalidrawLib.restoreAppState(defaultAppState);

  window.excalidrawAPI.updateScene({ appState: restoredAppState });

  window.excalidrawAPI.setActiveTool({ type: "laser", locked: true });

  excalidrawPreset = 1;
}

function selectPreset2() {
  const defaultAppState = {
    currentItemRoundness: "sharp",
    currentItemRoughness: 0,
    currentItemStrokeWidth: 4,
    viewBackgroundColor: "transparent",
    currentItemStrokeColor: "#1e1e1e",
    currentItemBackgroundColor: "#1e1e1e",
    currentItemOpacity: 30,
  };

  const restoredAppState = window.ExcalidrawLib.restoreAppState(defaultAppState);

  window.excalidrawAPI.updateScene({ appState: restoredAppState });

  window.excalidrawAPI.setActiveTool({ type: "rectangle", locked: true });

  excalidrawPreset = 2;
}

function selectColor(strokeColor, backgroundColor) {
  const modifiedAppState = window.excalidrawAPI.getAppState();

  if (excalidrawPreset === 1) {
    modifiedAppState.currentItemStrokeColor = strokeColor;
  } else if (excalidrawPreset === 2) {
    modifiedAppState.currentItemStrokeColor = strokeColor;
    modifiedAppState.currentItemBackgroundColor = backgroundColor;
  }

  window.excalidrawAPI.updateScene({ appState: modifiedAppState });
}

document.addEventListener(
  "keydown",
  (event) => {

    // Alt + Q - Restore app state - Preset 1
    if (event.altKey && event.code === "KeyQ") {
      selectPreset1();
    }

    // Alt + W - Restore app state - Preset 2
    else if (event.altKey && event.code === "KeyW") {
      selectPreset2();
    }

    // Alt + E - Empty scene
    else if (event.altKey && event.code === "KeyE") {
      emptyScene();
    }

    // Alt + F - Show/Hide controls
    else if (event.altKey && event.code === "KeyF") {
      showHideControls();
    }

    // Alt + 0 - Select stroke color - Black
    else if (event.altKey && event.code === "IntlBackslash") {
      selectColor("#1e1e1e", "#1e1e1e");
    }

    // Alt + 1 - Select stroke color - Blue
    else if (event.altKey && event.code === "Digit1") {
      selectColor("#1971c2", "#a5d8ff");
    }

    // Alt + 2 - Select stroke color - Red
    else if (event.altKey && event.code === "Digit2") {
      selectColor("#e03131", "#ffc9c9");
    }

    // Alt + 3 - Select stroke color - Green
    else if (event.altKey && event.code === "Digit3") {
      selectColor("#2f9e44", "#b2f2bb");
    }

    // Alt + 4 - Select stroke color - Yellow
    else if (event.altKey && event.code === "Digit4") {
      selectColor("#ffd43b", "#ffec99");
    }
  },
  false,
);
