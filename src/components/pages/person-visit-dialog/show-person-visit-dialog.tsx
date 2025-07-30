"use client";

import { regular12 } from "~/styles/fonts";
import {
  Flex,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Box,
  Text,
  Spacer,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";
import {
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineDocumentMinus,
} from "react-icons/hi2";
import React, { useEffect, useState } from "react";
import { styles } from "./show-person-visit-dialog.module";
import { softBlue, white } from "~/utils/colors";
import Swal from "sweetalert2";
import post from "~/utils/post";
import type { KeyedMutator } from "swr";
import { mutate as historyMutate } from "swr";
import { InsertHistorySchema } from "~/utils/validators";
import type { THistory, TInsertHistory, TPerson } from "~/utils/validators";
import CustomTextArea from "~/components/ui/text-area/text-area";

interface ShowPersonVisitDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "edit" | "view" | "add";
  person: TPerson | undefined;
  history?: THistory | undefined;
  historiesData?: THistory[] | undefined;
  defaultValues?: TInsertHistory | undefined;
  mutate?: KeyedMutator<THistory[]>;
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

export default function ShowPersonVisitDialog({
  isOpen,
  onClose,
  modalMode = "view",
  person,
  history,
  historiesData,
  mutate,
  defaultValues,
}: ShowPersonVisitDialogProps) {
  const toast = useToast();
  const [mode, setMode] = useState(modalMode);

  const form = useForm({
    schema: InsertHistorySchema,
    defaultValues,
  });

  const handleEditButton = () => {
    if (mode === "view") setMode("edit");
    else setMode("view");
  };

  // Edit
  const handleApplyButton = async (values: TInsertHistory) => {
    if (!history?._id || !history.personId || !mutate) return;

    setMode("view");
    const constructedData: THistory = {
      ...values,
      _id: history._id,
      personId: history.personId,
      timestamp: new Date(),
    };
    await post(`/editPersonHistoryInfo`, constructedData);
    const backup: THistory[] = [];
    historiesData?.forEach((element) => {
      if (element._id === constructedData._id) {
        backup.push(constructedData);
      } else {
        backup.push(element);
      }
    });
    await mutate(backup, false);
    toast({
      title: "Visita editada.",
      description: "La visita se ha editado exitosamente en el sistema.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  // Add
  const handleAddButton = async (values: TInsertHistory) => {
    setMode("view");
    const constructedData: Partial<THistory> = {
      ...values,
      personId: person?._id,
      timestamp: new Date(),
    };
    await post(`/setPersonHistoryInfo`, constructedData);
    await historyMutate(`/getPersonHistoryInfo?personId=${person?._id}`);
    toast({
      title: "Visita agregada.",
      description: "La visita se ha añadido exitosamente en el sistema.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  // delete
  const handleDeleteButton = async () => {
    if (!history?._id || !mutate) return;

    await Swal.fire({
      title: "¿Estás seguro que quieres hacer esto?",
      text: "Esta acción no se puede revertir",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await post(`/deletePersonHistoryInfo`, {
          _id: history._id,
        });
        if (response.status === "success") {
          await Swal.fire(
            "¡Eliminado!",
            "La visita ha sido eliminada correctamente.",
            "success",
          );
          const backup = historiesData?.filter(
            (element) => element._id !== history._id,
          );
          await mutate(backup, false);
          onClose();
        } else {
          await Swal.fire("Error", "Algo salió mal.", "error");
        }
      }
    });
  };

  useEffect(() => {
    // Reset the form when modal closes or opens
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {viewMode[mode].header} VISITA {person?.name.toUpperCase()}{" "}
          {person?.lastname.toUpperCase()}
        </ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <Flex flexDirection="column" pl="6" pr="6" gap="2">
            <FormField
              control={form.control}
              name="sintomas"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomTextArea
                      label="SINTOMAS / LESIONES"
                      isReadOnly={mode === "view"}
                      {...field}
                    />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tratamiento"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomTextArea
                      label="TRATAMIENTO"
                      isReadOnly={mode === "view"}
                      {...field}
                    />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <Flex
              flexDirection="row"
              w="100%"
              justifyContent="center"
              pt="20px"
            >
              <Spacer />
              <FormField
                control={form.control}
                name="enviado"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Flex
                        onClick={() =>
                          mode !== "view" && form.setValue("enviado", "Clase")
                        }
                        {...field}
                      >
                        <Box
                          w="25px"
                          h="25px"
                          borderWidth="1px"
                          borderColor={softBlue}
                          mr="4"
                          bgColor={field.value === "Clase" ? softBlue : ""}
                        />
                        <Text sx={regular12} userSelect="none">
                          ENVIADO A CLASE
                        </Text>
                      </Flex>
                    </FormControl>
                    <FormFieldMessage />
                  </FormItem>
                )}
              />
              <Spacer />
              <FormField
                control={form.control}
                name="enviado"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Flex
                        onClick={() =>
                          mode !== "view" && form.setValue("enviado", "Casa")
                        }
                        {...field}
                      >
                        <Box
                          w="25px"
                          h="25px"
                          borderWidth="1px"
                          borderColor={softBlue}
                          mr="4"
                          bgColor={field.value === "Casa" ? softBlue : ""}
                        />
                        <Text sx={regular12} userSelect="none">
                          ENVIADO A CASA
                        </Text>
                      </Flex>
                    </FormControl>
                    <FormFieldMessage />
                  </FormItem>
                )}
              />
              <Spacer />
              <FormField
                control={form.control}
                name="enviado"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Flex
                        onClick={() =>
                          mode !== "view" &&
                          form.setValue("enviado", "Urgencias")
                        }
                        {...field}
                      >
                        <Box
                          w="25px"
                          h="25px"
                          borderWidth="1px"
                          borderColor={softBlue}
                          mr="4"
                          bgColor={field.value === "Urgencias" ? softBlue : ""}
                        />
                        <Text sx={regular12} userSelect="none">
                          ENVIADO A URGENCIAS
                        </Text>
                      </Flex>
                    </FormControl>
                    <FormFieldMessage />
                  </FormItem>
                )}
              />
              <Spacer />
            </Flex>
          </Flex>
          <ModalFooter>
            {mode === "add" && (
              <Button
                bg="#FF2B91"
                color={white}
                iconSpacing="16px"
                sx={styles.Button}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <HiOutlineDocumentMinus />
                  </Icon>
                }
                mr="1"
                onClick={form.handleSubmit(handleAddButton)}
              >
                GUARDAR CAMBIOS
              </Button>
            )}
            {mode === "edit" && (
              <Button
                bg="#FF2B91"
                color={white}
                iconSpacing="16px"
                sx={styles.Button}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <HiOutlineDocumentMinus />
                  </Icon>
                }
                mr="1"
                onClick={form.handleSubmit(handleApplyButton)}
              >
                APLICAR CAMBIOS
              </Button>
            )}
            {mode === "view" && (
              <>
                <Button
                  bg="#FF2B91"
                  color={white}
                  iconSpacing="16px"
                  sx={styles.Button}
                  leftIcon={
                    <Icon fontSize="24px" mb="1px" ml="1px">
                      <HiOutlineDocumentMinus />
                    </Icon>
                  }
                  mr="1"
                  onClick={() => handleDeleteButton()}
                >
                  ELIMINAR
                </Button>
                <Button
                  bg="#FF2B91"
                  color={white}
                  iconSpacing="16px"
                  sx={styles.Button}
                  leftIcon={
                    <Icon fontSize="24px" mb="1px" ml="1px">
                      <HiOutlineDocumentMagnifyingGlass />
                    </Icon>
                  }
                  mr="1"
                  onClick={() => handleEditButton()}
                >
                  EDITAR
                </Button>
              </>
            )}
          </ModalFooter>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
