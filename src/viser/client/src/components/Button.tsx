import { GuiButtonMessage } from "../WebsocketMessages";
import { GuiComponentContext } from "../ControlPanel/GuiComponentContext";
import { Box } from "@mantine/core";

import { Button } from "@mantine/core";
import React from "react";
import { htmlIconWrapper } from "./ComponentStyles.css";
import { IconDice3 } from '@tabler/icons-react';

export default function ButtonComponent({
  uuid,
  props: { visible, disabled, label, color, _icon_html: icon_html },
}: GuiButtonMessage) {
  const { messageSender } = React.useContext(GuiComponentContext)!;
  if (!(visible ?? true)) return <></>;

  return (
    <Box mx="xs" mb="3" mt="3">
      <Button
        id={uuid}
        fullWidth
        color={"#F0D240"}
        onClick={() =>
          messageSender({
            type: "GuiUpdateMessage",
            uuid: uuid,
            updates: { value: true },
          })
        }
        disabled={disabled ?? false}
        size="xl"
        radius="md"
        leftSection={<IconDice3 color="#222222" />}
      >
        {label}
      </Button>
    </Box>
  );
}
