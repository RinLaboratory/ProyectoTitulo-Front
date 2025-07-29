import type { ChangeEventHandler } from "react";
import React from "react";

import type { TextareaProps } from "@chakra-ui/react";
import { Text, Textarea, Flex } from "@chakra-ui/react";

import { styles } from "./text-area.module";

interface CustomTextAreaProps extends TextareaProps {
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
  ...props
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
          {...props}
        />
      </Flex>
    </Flex>
  );
}
