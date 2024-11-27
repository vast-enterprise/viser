import * as React from "react";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { GuiNumberMessage } from "../WebsocketMessages";
import { ViserInputComponent } from "./common";
import { NumberInput, Text, CloseButton } from "@mantine/core";
import { IconDice3 } from '@tabler/icons-react';

export default function NumberInputComponent({
  uuid,
  value,
  props: { visible, label, hint, disabled, precision, min, max, step },
}: GuiNumberMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;

  const setRandomValue = () => {
    // Early return if disabled
    if (disabled) return;

    // Set default values if not provided
    const minValue = min ?? 0;
    const maxValue = max ?? 100;
    const stepValue = step ?? 1;
    const precisionValue = precision ?? 0;

    // Calculate the number of possible steps
    const range = maxValue - minValue;
    const steps = Math.floor(range / stepValue);
    
    // Generate random number of steps and calculate the actual value
    const randomSteps = Math.floor(Math.random() * (steps + 1));
    let randomValue = minValue + (randomSteps * stepValue);
    
    // Round to the specified precision
    if (precisionValue !== undefined && precisionValue >= 0) {
      randomValue = Number(randomValue.toFixed(precisionValue));
    }

    // Ensure value is within bounds (for floating point precision safety)
    randomValue = Math.max(minValue, Math.min(maxValue, randomValue));
    
    setValue(uuid, randomValue);
  };

  if (!visible) return <></>;
  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <Text size="sm" fw={800} pl={3} mb={3}>
        { label }
      </Text>      
      <NumberInput
        id={uuid}
        value={value}
        // This was renamed in Mantine v7.
        decimalScale={precision}
        min={min ?? undefined}
        max={max ?? undefined}
        step={step}
        size="sm"
        onChange={(newValue) => {
          // Ignore empty values.
          newValue !== "" && setValue(uuid, newValue);
        }}
        disabled={disabled}
        stepHoldDelay={500}
        stepHoldInterval={(t) => Math.max(1000 / t ** 2, 25)}
        hideControls={true}
        leftSectionPointerEvents="all"
        leftSection={
          <CloseButton
            icon={<IconDice3 color="gray"/>}
            aria-label="Randomize"
            onClick={() => setRandomValue()}
            style={{
              paddingRight: "0.5rem"
            }}
          />
        }        
      />
    </ViserInputComponent>
  );
}
