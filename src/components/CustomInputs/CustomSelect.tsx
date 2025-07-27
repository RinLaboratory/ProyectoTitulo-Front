import React from "react";

import { FormControl, FormLabel, InputGroup, Text } from "@chakra-ui/react";
import {
  AutoComplete,
  AutoCompleteInput,
  AutoCompleteItem,
  AutoCompleteList,
} from "@choc-ui/chakra-autocomplete";

import { styles } from "./CustomSelect.module";

interface CustomSelectProps {
  name: string;
  label: string;
  placeholder?: string;
  options?: {
    _id: string;
    value: string;
    label: string;
  }[];
  value: string | number | undefined;
  defaultValue?: string | number | undefined;
  onChange?: (value: string, name: string) => void | undefined;
  error?: boolean;
}

export default function CustomSelect({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  error = false,
}: CustomSelectProps) {
  return (
    <FormControl isInvalid={error}>
      <FormLabel sx={styles.MainContainer}>{label}</FormLabel>
      <AutoComplete
        openOnFocus
        emptyState={false}
        suggestWhenEmpty={true}
        listAllValuesOnFocus={true}
        defaultValue={value}
        onSelectOption={(selectedOption: { item: { value: string } }) => {
          if (onChange) {
            onChange(selectedOption.item.value, name);
          }
        }}
      >
        {() => (
          <>
            <InputGroup position="relative">
              <AutoCompleteInput
                name={name}
                placeholder={placeholder}
                value={value}
                sx={styles.SelectContainer}
              />
            </InputGroup>
            <AutoCompleteList>
              {options?.map((opt) => (
                <AutoCompleteItem
                  key={`option-${opt.value}`}
                  value={opt._id}
                  textTransform="capitalize"
                >
                  <Text ml="4" sx={styles.List}>
                    {opt.label}
                  </Text>
                </AutoCompleteItem>
              ))}
            </AutoCompleteList>
          </>
        )}
      </AutoComplete>
      {/* {error && <FormErrorMessage m="1">{error.message}</FormErrorMessage>} */}
    </FormControl>
  );
}
