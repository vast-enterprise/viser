import * as React from "react";
import { TextInput } from "@mantine/core";
import { IconTextRecognition } from '@tabler/icons-react';
import { ViserInputComponent } from "./common";
import { GuiTextMessage } from "../WebsocketMessages";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { IconX } from '@tabler/icons-react';
import { ActionIcon } from '@mantine/core';

export default function TextInputComponent({
  uuid,
  value,
  props: { hint, label, disabled, visible },

}: GuiTextMessage) {
  const { setValue } = React.useContext(GuiComponentContext)!;
  if (!visible) return <></>;
  const icon = <IconTextRecognition color="gray" size="2rem"/>;
  return (
    <ViserInputComponent {...{ uuid, hint }}>
      <TextInput
        value={value}
        size="xl"
        leftSection={icon}
        onChange={(value) => {
          setValue(uuid, value.target.value);
        }}
        styles={{
          input: {fontSize: "1.5rem"}
        }}
        disabled={disabled}
        mt="3"
        mb="3"
        autoFocus
        onBlur={(e) => e.target.focus()}
        rightSection={
          <ActionIcon onClick={() => setValue(uuid, "")} variant="subtle" color="gray" radius="xl">
            <IconX size="2rem" />
          </ActionIcon>
        }                
      />
    </ViserInputComponent>
  );
}
