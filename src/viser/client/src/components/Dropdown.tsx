import * as React from "react";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { ViserInputComponent } from "./common";
import { GuiDropdownMessage } from "../WebsocketMessages";
import { SegmentedControl, Text } from "@mantine/core";

export default function DropdownComponent({
  uuid,
  value,
  props: { hint, label, disabled, visible, options },
}: GuiDropdownMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  
  if (!visible) return <></>;

  // Convert options array to SegmentedControl data format
  const segmentedData = options.map(option => ({
    value: option,
    label: option
  }));

  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <Text size="lg" fw={800} pl={3} mb={3} mt={3}>
        { label }
      </Text>
      <SegmentedControl
        id={uuid}
        value={value}
        data={segmentedData}
        onChange={(value) => setValue(uuid, value)}
        disabled={disabled}
        size="xl"
        radius="sm"
        fullWidth
      />
    </ViserInputComponent>
  );
}