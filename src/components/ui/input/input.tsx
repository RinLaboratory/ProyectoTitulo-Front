import React from "react";

import type { InputProps } from "@chakra-ui/react";
import { Text, Box, Input, Flex, Image } from "@chakra-ui/react";

import { styles } from "./input.module";

interface CustomInputProps extends InputProps {
  label?: string;
  name?: string;
  value?: string | number | undefined;
  height?: string | number;
  onChange?: React.ChangeEventHandler<HTMLInputElement> | undefined;
  isEditable?: boolean;
  isInvalid?: boolean;
  handleClick?: () => void;
  readOnly?: boolean;
  defaultValue?: string | number | undefined;
  type?: React.HTMLInputTypeAttribute | undefined;
}

export default function CustomInput({
  label,
  value,
  height,
  onChange,
  name,
  isEditable = false,
  isInvalid,
  handleClick,
  readOnly,
  defaultValue,
  type = "text",
  ...props
}: CustomInputProps) {
  return (
    <>
      <Text sx={styles.LabelContainer}>{label}</Text>
      <Box sx={styles.FieldContainer} h={height}>
        <Flex sx={isEditable ? styles.FieldEdit : undefined}>
          <Input
            sx={styles.TextViewer}
            value={value}
            onChange={onChange}
            name={name}
            type={type}
            readOnly={readOnly}
            isInvalid={isInvalid}
            defaultValue={defaultValue}
            {...props}
          />
          {isEditable && (
            <Flex sx={styles.TextRightContainer}>
              <Image
                alt="editar"
                src={"/assets/LapizAzul.svg"}
                sx={styles.EditImage}
                onClick={handleClick}
              />
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  );
}
