import * as React from "react";
import { ActionIcon } from '@mantine/core';
import { IconArrowBackUp, IconArrowForwardUp, IconTrash } from '@tabler/icons-react';
import { ReactSketchCanvas, ReactSketchCanvasRef } from "react-sketch-canvas";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { ViserInputComponent } from "./common";
import { GuiRgbaMessage } from "../WebsocketMessages";

export default function RgbaComponent({
  uuid,
  value,
  props: { label, hint, disabled, visible },
}: GuiRgbaMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  const canvasRef = React.useRef<ReactSketchCanvasRef>(null);
  
  if (!visible) return <></>;

  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
    position: "absolute" as const,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  };

  const handleChange = async (stroke: { paths: any[]; } | null) => {
    if (stroke && stroke.paths.length <= 1) {
      return;
    }
    if (canvasRef.current) {
      try {
        const data = await canvasRef.current.exportImage("png");
        setValue(uuid, data);
      } catch (e) {
        console.error("Failed to export canvas:", e);
      }
    }
  };  

  const handleUndo = () => {
    canvasRef.current?.undo();
    // We need to update the value after undo
    handleChange(null);
  };

  const handleRedo = () => {
    canvasRef.current?.redo();
    // We need to update the value after redo
    handleChange(null);
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    // We need to update the value after clear
    handleChange(null);
  };  

  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <div style={{ width: "100%" }}>
          {!disabled && (
            <div style={{ margin: "0.5rem 0 0.5rem 0", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
              <ActionIcon variant="filled" aria-label="ArrowBack" color="#F0D240" size="lg" radius="xl" onClick={handleUndo}>
                <IconArrowBackUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="filled" aria-label="Settings" color="#F0D240" size="lg" radius="xl" onClick={handleRedo}>
                <IconArrowForwardUp style={{ width: '70%', height: '70%' }} stroke={1.5} />
              </ActionIcon>
              <ActionIcon variant="filled" aria-label="Settings" color="#F0D240" size="lg" radius="xl" onClick={handleClear}>
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