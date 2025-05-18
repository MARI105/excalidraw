import React, {
  useEffect,
  useState,
  useRef,
  Children,
  cloneElement,
} from "react";

import type * as TExcalidraw from "@excalidraw/excalidraw";
import { CaptureUpdateAction } from "@excalidraw/excalidraw";
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
  const { MainMenu } = excalidrawLib;

  const appRef = useRef<any>(null);

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

  const [laserPointerColor, setLaserPointerColor] = useState<string>(
    (window as any).LASERPOINTER_COLOR,
  );

  const [laserPointerDecayTime, setLaserPointerDecayTime] = useState<number>(
    (window as any).LASERPOINTER_DECAY_TIME,
  );

  const [laserPointerDecayLength, setLaserPointerDecayLength] =
    useState<number>((window as any).LASERPOINTER_DECAY_LENGTH);

  const [sceneDecay, setSceneDecay] = useState<boolean>(
    (window as any).SCENE_DECAY,
  );

  const [sceneDecayTime, setSceneDecayTime] = useState<number>(
    (window as any).SCENE_DECAY_TIME,
  );

  const [sceneDecayLength, setSceneDecayLength] = useState<number>(
    (window as any).SCENE_DECAY_LENGTH,
  );

  useEffect(() => {
    initSceneDecay();
    return () => {
      initSceneDecay();
    };
  }, [sceneDecay]);

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
      <>
        <MainMenu>
          <MainMenu.DefaultItems.LoadScene />
          <MainMenu.DefaultItems.Export />
          <MainMenu.DefaultItems.SaveAsImage />
          <MainMenu.DefaultItems.CommandPalette />
          <MainMenu.DefaultItems.SearchMenu />
          <MainMenu.DefaultItems.Help />
          <MainMenu.DefaultItems.ClearCanvas />
          <MainMenu.DefaultItems.ChangeCanvasBackground />
          <MainMenu.Group title="Laser pointer">
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">Color</label>
              <input
                className="main-menu-item-custom-input"
                type="color"
                value={laserPointerColor}
                onChange={(event) => {
                  (window as any).LASERPOINTER_COLOR = event.target.value;
                  setLaserPointerColor(event.target.value);
                }}
              />
            </MainMenu.ItemCustom>
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">Decay time</label>
              <input
                className="main-menu-item-custom-input"
                type="text"
                value={laserPointerDecayTime}
                onChange={(event) => {
                  (window as any).LASERPOINTER_DECAY_TIME = event.target.value;
                  setLaserPointerDecayTime(Number(event.target.value));
                }}
              />
            </MainMenu.ItemCustom>
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">
                Decay length
              </label>
              <input
                className="main-menu-item-custom-input"
                type="text"
                value={laserPointerDecayLength}
                onChange={(event) => {
                  (window as any).LASERPOINTER_DECAY_LENGTH =
                    event.target.value;
                  setLaserPointerDecayLength(Number(event.target.value));
                }}
              />
            </MainMenu.ItemCustom>
          </MainMenu.Group>
          <MainMenu.Group title="Scene decay">
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">Decay</label>
              <input
                className="main-menu-item-custom-input"
                type="checkbox"
                checked={sceneDecay}
                onChange={(event) => {
                  (window as any).SCENE_DECAY = event.target.checked;
                  setSceneDecay(event.target.checked);
                }}
              />
            </MainMenu.ItemCustom>
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">Decay time</label>
              <input
                className="main-menu-item-custom-input"
                type="text"
                value={sceneDecayTime}
                onChange={(event) => {
                  (window as any).SCENE_DECAY_TIME = Number(event.target.value);
                  setSceneDecayTime(Number(event.target.value));
                }}
              />
            </MainMenu.ItemCustom>
            <MainMenu.ItemCustom>
              <label className="main-menu-item-custom-label">Decay length</label>
              <input
                className="main-menu-item-custom-input"
                type="text"
                value={sceneDecayLength}
                onChange={(event) => {
                  (window as any).SCENE_DECAY_LENGTH = Number(event.target.value);
                  setSceneDecayLength(Number(event.target.value));
                }}
              />
            </MainMenu.ItemCustom>
          </MainMenu.Group>
        </MainMenu>
      </>,
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
(window as any).LASERPOINTER_COLOR = "#ff0000";
(window as any).LASERPOINTER_DECAY_TIME = 3000;
(window as any).LASERPOINTER_DECAY_LENGTH = 100;

(window as any).SCENE_DECAY = false;
(window as any).SCENE_DECAY_TIME = 3000;
(window as any).SCENE_DECAY_LENGTH = 100;
(window as any).SCENE_DECAY_UPDATE_INTERVAL = 50;

let sceneDecayInterval = null;
let excalidrawPreset = 1;

init();

function init() {
  setTimeout(() => {
    selectPreset1();
    initSceneDecay();
  }, 1000);
}

function emptyScene() {
  window.excalidrawAPI.updateScene({ elements: [] });
  window.excalidrawAPI.history.clear();
}

function initSceneDecay() {
  clearInterval(sceneDecayInterval);
  sceneDecayInterval = null;
  
  if ((window as any).SCENE_DECAY) {
    resetSceneDecay();
    
    sceneDecayInterval = setInterval(() => {
      updateSceneDecay();
    }, (window as any).SCENE_DECAY_UPDATE_INTERVAL);
  }
}

function resetSceneDecay() {
  const elements = window.excalidrawAPI.getSceneElements();
  for (const element of elements) {
    delete element.customData;
  }
}

function toggleSceneDecay() {
  (window as any).SCENE_DECAY = !(window as any).SCENE_DECAY;
}

function updateSceneDecay() {
  const now = Date.now();
  let updated = false;
  const opacityDecayStep =
    100 /
    (((window as any).SCENE_DECAY_LENGTH * 10) /
      (window as any).SCENE_DECAY_UPDATE_INTERVAL);
  
  const selectedElementIds = window.excalidrawAPI.getAppState().selectedElementIds;
  const elements = window.excalidrawAPI.getSceneElements();
  
  for (const element of elements) {
    if (selectedElementIds[element.id]) {
      element.customData = {
        decayStarted: now,
      };
    }
    else {
      element.customData = {
        decayStarted: Math.max(
          element?.customData?.decayStarted ?? element.updated,
          element.updated,
        ),
        // decayStarted: Math.max(
        //   element?.customData?.decayStarted ?? now,
        //   element.updated,
        // ),
      };
    }

    if ((element.customData.decayStarted + (window as any).SCENE_DECAY_TIME) < now) {
      element.opacity = Math.max(0, element.opacity - opacityDecayStep);
      updated = true;
    }
  }
  
  if (updated) {
    const decayingElements = elements.filter((e) => e.opacity > 0);
    window.excalidrawAPI.updateScene({
      elements: decayingElements,
      captureUpdate: CaptureUpdateAction.NEVER,
    });
  }
}

function showHideControls() {
  const appMenuTopElement = document.querySelector("div.App-menu.App-menu_top");
  const appMenuBottomElement = document.querySelector(
    "footer.App-menu.App-menu_bottom",
  );

  appMenuTopElement.classList.toggle("hidden");
  appMenuBottomElement.classList.toggle("hidden");
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

    // Alt + D - Scene decay
    else if (event.altKey && event.code === "KeyD") {
      toggleSceneDecay();
      initSceneDecay();

      window.excalidrawAPI.setToast({
        message: `Scene decay ${(window as any).SCENE_DECAY ? "ON" : "OFF"}`,
        duration: 1000,
      });
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
