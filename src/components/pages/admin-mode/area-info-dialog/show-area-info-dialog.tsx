"use client";

import {
  Flex,
  Icon,
  ModalFooter,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Button,
  useToast,
  Box,
  Text,
} from "@chakra-ui/react";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";

import React, { useEffect, useMemo } from "react";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./show-area-info-dialog.module";
import CustomInput from "../../../ui/input/input";
import { softBlue, white } from "~/utils/colors";
import post from "~/utils/post";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import CustomSelect from "~/components/ui/select/select";
import { regular12 } from "~/styles/fonts";
import type { TInsertArea, TArea } from "~/utils/validators";
import { InsertAreaSchema } from "~/utils/validators";
import { areasOptionsParser } from "~/utils/areas-options-parser";

interface ShowAreaInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode: "add" | "edit" | "view";
  area: TArea | undefined;
  defaultValues?: TInsertArea | undefined;
}

const viewMode = {
  edit: {
    header: "EDITAR",
  },
  view: {
    header: "VER",
  },
  add: {
    header: "AÑADIR",
  },
};

export default function ShowAreaInfoDialog({
  isOpen,
  onClose,
  modalMode,
  area,
  defaultValues,
}: ShowAreaInfoDialogProps) {
  const toast = useToast();

  const form = useForm({
    schema: InsertAreaSchema,
    defaultValues,
  });

  const {
    data: areas,
    isLoading: isAreasLoading,
    mutate,
  } = useSWR<TArea[]>(`/getAreas?name=`, fetcher);

  const areasOptions: Record<string, string> = useMemo(() => {
    return areasOptionsParser(areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, isAreasLoading]);

  const handleSubmit = async (values: TInsertArea) => {
    if (modalMode === "add") {
      const response = await post<TArea>(`/addArea`, values);
      if (response.status === "success") {
        toast({
          title: "Curso / Area agregado.",
          description: `El Curso / Area "${values.label}" se ha agregado exitosamente al sistema.`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        if (areas) {
          const backup: TArea[] = [...areas];
          backup.unshift(response.data);
          await mutate(backup, false);
        }
        onClose();
      } else {
        toast({
          title: "Error",
          description: `${response.msg}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
    if (modalMode === "edit") {
      const constructedData: TArea = {
        ...values,
        _id: area?._id ?? "",
      };

      const response = await post<TArea>(`/editArea`, values);
      if (response.status === "success") {
        toast({
          title: "Curso / Area editado.",
          description: `El Curso / Area "${values.label}" se ha editado exitosamente en el sistema.`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        const backup: TArea[] = [];
        areas?.forEach((element) => {
          if (element._id === constructedData._id) {
            backup.push(response.data);
          } else {
            backup.push(element);
          }
        });
        await mutate(backup, false);
        onClose();
      } else {
        toast({
          title: "Error",
          description: `${response.msg}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    // Reset the form when modal closes or opens
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[modalMode].header} AREA / CURSO</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <ModalBody>
            <Flex sx={styles.MainContainer}>
              <Flex
                flexDirection="column"
                mb="30"
                mt="3"
                w="1254px"
                ml="5"
                mr="5"
                gap="2"
              >
                <FormField
                  control={form.control}
                  name="label"
                  render={({ field }) => (
                    <FormItem w="400px">
                      <FormControl>
                        <CustomInput
                          label="NOMBRE DE CURSO / AREA"
                          {...field}
                        />
                      </FormControl>
                      <FormFieldMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nextId"
                  render={({ field }) => (
                    <FormItem w="400px">
                      <FormControl>
                        <CustomSelect
                          {...field}
                          label="CURSO / AREA SIGUIENTE"
                          options={
                            isAreasLoading
                              ? [
                                  {
                                    label: "default",
                                    value: "Ninguno",
                                    _id: "",
                                  },
                                ]
                              : areas
                          }
                          value={
                            field.value ? areasOptions[field.value] : undefined
                          }
                        />
                      </FormControl>
                      <FormFieldMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="isClass"
                  render={({ field }) => (
                    <FormItem w="400px">
                      <FormControl>
                        <Flex
                          onClick={() =>
                            modalMode !== "view" &&
                            form.setValue("isClass", !field.value)
                          }
                          {...field}
                        >
                          <Box
                            w="25px"
                            h="25px"
                            borderWidth="1px"
                            borderColor={softBlue}
                            mr="4"
                            bgColor={field.value === true ? softBlue : ""}
                          />
                          <Text sx={regular12}>ES SALÓN DE CLASES</Text>
                        </Flex>
                      </FormControl>
                      <FormFieldMessage />
                    </FormItem>
                  )}
                />
                <Flex flexDirection="column" w="400px"></Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {modalMode !== "view" && (
              <Button
                sx={styles.Button}
                bg="#FF2B91"
                color={white}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <HiOutlineDocumentAdd />
                  </Icon>
                }
                type="submit"
                onClick={form.handleSubmit(handleSubmit)}
              >
                {modalMode === "add" && "AÑADIR"}
                {modalMode === "edit" && "APLICAR"}
              </Button>
            )}
          </ModalFooter>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
