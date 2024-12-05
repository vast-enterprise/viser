import * as React from "react";
import { CSSProperties } from 'react';
import { ActionIcon } from '@mantine/core';
import { IconArrowBackUp, IconArrowForwardUp, IconTrash, IconEraser } from '@tabler/icons-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { ViserInputComponent } from "./common";
import { GuiRgbaMessage } from "../WebsocketMessages";

const cursorSize = 8; // Adjust this to change cursor size
const drawCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${cursorSize*2}" width="${cursorSize*2}" viewBox="0 0 ${cursorSize*2} ${cursorSize*2}"><circle cx="${cursorSize}" cy="${cursorSize}" r="${cursorSize}" fill="black"/></svg>') ${cursorSize} ${cursorSize}, auto`;
const eraseCursor = `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="${cursorSize*2}" width="${cursorSize*2}" viewBox="0 0 ${cursorSize*2} ${cursorSize*2}"><circle cx="${cursorSize}" cy="${cursorSize}" r="${cursorSize}" fill="white" stroke="black" stroke-width="1"/></svg>') ${cursorSize} ${cursorSize}, auto`;

export default function RgbaComponent({
  uuid,
  value,
  props: { label, hint, disabled, visible },
}: GuiRgbaMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  const [isEraserMode, setIsEraserMode] = React.useState(false);
  
  const styles: CSSProperties = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    userSelect: "none",
  };

  const wrapperStyles: CSSProperties = {
    width: "100%",
    userSelect: "none",
  };

  const buttonGroupStyles: React.CSSProperties = {
    position: "absolute",
    top: "1rem",
    right: "1rem",
    zIndex: 1,
    display: "flex",
    gap: "0.5rem",
  };

  const handleChange = async (stroke: { paths: any[]; } | null) => {
    if (stroke && stroke.paths.length <= 1) return;
    if (canvasRef.current) {
      try {
        const data = await canvasRef.current.exportImage("png");
        setValue(uuid, data);
      } catch (e) {
        console.error("Failed to export canvas:", e);
      }
    }
  };  

  const toggleEraser = () => {
    const newMode = !isEraserMode;
    setIsEraserMode(newMode);
    canvasRef.current?.eraseMode(newMode);
  };

  const handleUndo = () => {
    canvasRef.current?.undo();
    handleChange(null);
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
    handleChange(null);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    handleChange(null);
  };  

  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <div style={wrapperStyles}>
          {!disabled && (
            <div style={buttonGroupStyles}>
              <ActionIcon 
                variant="filled"
                color={isEraserMode ? "#333333" : "#F0D240"}
                size="xl" 
                radius="sm" 
                onClick={toggleEraser}
              >
                <IconEraser style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="filled" color="#F0D240" size="xl" radius="sm" onClick={handleClear}>
                <IconTrash style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>            
            </div>
          )}        
        <div style={{ position: "relative", width: "100%", paddingBottom: "100%" }}>
          <ReactSketchCanvas
            ref={canvasRef}
            style={styles}
            width="100%"
            height="100%"
            strokeWidth={4}
            eraserWidth={48}
            strokeColor="black"
            onStroke={handleChange}
            allowOnlyPointerType="all"
            preserveBackgroundImageAspectRatio="none"
            withTimestamp={false}
          />
        </div>
      </div>
    </ViserInputComponent>
  );
}