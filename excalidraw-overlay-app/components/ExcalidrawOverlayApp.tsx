import React, { useState, useRef, Children, cloneElement } from "react";

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
}: AppProps) {
  const appRef = useRef<any>(null);

  const [excalidrawAPI, setExcalidrawAPI] =
    useState<ExcalidrawImperativeAPI | null>(null);

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
