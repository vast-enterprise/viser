import * as React from "react";
import { TextInput } from "@mantine/core";
import { IconTextRecognition } from '@tabler/icons-react';
import { ViserInputComponent } from "./common";
import { GuiTextMessage } from "../WebsocketMessages";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";

export default function TextInputComponent({
  uuid,
  value,
  props: { hint, label, disabled, visible },

}: GuiTextMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  if (!visible) return <></>;
  const icon = <IconTextRecognition color="gray" />;
  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <TextInput
        value={value}
        size="lg"
        leftSection={icon}
        onChange={(value) => {
          setValue(uuid, value.target.value);
        }}
        styles={{
          input: {

          },
        }}
        disabled={disabled}
        mt="3"
        mb="3"
      />
    </ViserInputComponent>
  );
}
