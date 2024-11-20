import * as React from "react";
import { ReactSketchCanvas } from "react-sketch-canvas";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { ViserInputComponent } from "./common";
import { GuiRgbaMessage } from "../WebsocketMessages";

export default function RgbaComponent({
  uuid,
  value,
  props: { label, hint, disabled, visible },
}: GuiRgbaMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  const canvasRef = React.useRef<ReactSketchCanvas>(null);
  
  if (!visible) return <></>;

  const styles = {
    border: "0.0625rem solid #9c9c9c",
    borderRadius: "0.25rem",
  };

  const handleChange = async () => {
    if (canvasRef.current) {
      try {
        const data = await canvasRef.current.exportImage("png");
        setValue(uuid, data);
        console.log(data);
      } catch (e) {
        console.error("Failed to export canvas:", e);
      }
    }
  };  

  const handleUndo = () => {
    canvasRef.current?.undo();
    // We need to update the value after undo
    handleChange();
  };

  const handleClear = () => {
    canvasRef.current?.clearCanvas();
    // We need to update the value after clear
    handleChange();
  };  

  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <div style={{ width: "100%" }}>
        <ReactSketchCanvas
          ref={canvasRef}
          style={styles}
          width="100%"
          height="256px"
          strokeWidth={4}
          strokeColor="black"
          onStroke={handleChange}
          allowOnlyPointerType="all"
          preserveBackgroundImageAspectRatio="none"
          withTimestamp={false}
        />
        {!disabled && (
          <div style={{ marginTop: "8px", display: "flex", gap: "8px", justifyContent: "center" }}>
            <button
              onClick={handleUndo}
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer"
              }}
            >
              Undo
            </button>
            <button
              onClick={handleClear}
              style={{
                padding: "4px 8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                backgroundColor: "#f5f5f5",
                cursor: "pointer"
              }}
            >
              Clear
            </button>
          </div>
        )}        
      </div>
    </ViserInputComponent>
  );
}