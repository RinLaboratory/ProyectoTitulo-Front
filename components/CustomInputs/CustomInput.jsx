import React from 'react'

import { Text, Box, Input, Flex, Image } from '@chakra-ui/react'

import { styles } from './CustomInput.module.js'

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
  type = 'text',
}) {
  return (
    <>
      <Text sx={styles.LabelContainer}>{label}</Text>
      <Box sx={styles.FieldContainer} h={height}>
        <Flex sx={isEditable && styles.FieldEdit}>
          <Input
            sx={styles.TextViewer}
            value={value}
            onChange={onChange}
            name={name}
            type={type}
            readOnly={readOnly}
            isInvalid={isInvalid}
            defaultValue={defaultValue}
          />
          {isEditable && (
            <Flex sx={styles.TextRightContainer}>
              <Image
                alt="editar"
                src={'/assets/LapizAzul.svg'}
                sx={styles.EditImage}
                onClick={handleClick}
              />
            </Flex>
          )}
        </Flex>
      </Box>
    </>
  )
}
