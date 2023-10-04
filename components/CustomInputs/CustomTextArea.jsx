import React from 'react'

import { Text, Textarea, Flex } from '@chakra-ui/react'

import { styles } from './CustomTextArea.module.js'

export default function CustomTextArea({
  label,
  value,
  height,
  onChange,
  name,
  isDisabled = false,
}) {
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
  )
}
