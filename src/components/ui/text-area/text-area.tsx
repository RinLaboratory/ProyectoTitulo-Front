import type { ChangeEventHandler } from "react";
import React from "react";

import { Text, Textarea, Flex } from "@chakra-ui/react";

import { styles } from "./text-area.module";

interface CustomTextAreaProps {
  label?: string;
  value?: string | number | undefined;
  height?: number | string;
  onChange?: ChangeEventHandler<HTMLTextAreaElement>;
  name?: string;
  isDisabled?: boolean;
}

export default function CustomTextArea({
  label,
  value,
  height,
  onChange,
  name,
  isDisabled = false,
}: CustomTextAreaProps) {
  return (
    <Flex sx={styles.CustomTextAreaContainer}>
      <Text sx={styles.LabelContainer}>{label}</Text>
      <Flex sx={styles.FieldContainer} minH={height}>
        <Textarea
          sx={styles.TextViewer}
          value={value}
          onChange={onChange}
          name={name}
          isDisabled={isDisabled}
        />
      </Flex>
    </Flex>
  );
}
