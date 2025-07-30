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
  Spacer,
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

import React, { useEffect, useMemo, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./show-person-info-dialog.module";
import CustomInput from "../../../ui/input/input";
import { white } from "~/utils/colors";
import ImportPersonDialog from "../import-person-dialog/import-person-dialog";
import post from "~/utils/post";
import { fetcher } from "~/utils/fetcher";
import type { KeyedMutator } from "swr";
import useSWR from "swr";
import CustomSelect from "~/components/ui/select/select";
import { mutate as personMutate } from "swr";
import { InsertPersonSchema } from "~/utils/validators";
import type { TArea, TPerson, TInsertPerson } from "~/utils/validators";
import { areasOptionsParser } from "~/utils/areas-options-parser";

interface ShowPersonInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "add" | "view" | "edit";
  mutate?: KeyedMutator<TPerson[]>;
  persons?: TPerson[] | undefined;
  person?: TPerson | undefined;
  defaultValues?: TInsertPerson | undefined;
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

type TActiveDialog = "none" | "import-excel";

export default function ShowPersonInfoDialog({
  isOpen,
  onClose,
  modalMode = "add",
  mutate,
  persons,
  person,
  defaultValues,
}: ShowPersonInfoDialogProps) {
  const toast = useToast();
  const [listMode, setListMode] = useState<"add" | "edit">("add");
  const [activeDialog, setActiveDialog] = useState<TActiveDialog>("none");

  const form = useForm({
    schema: InsertPersonSchema,
    defaultValues,
  });

  const { data: areas, isLoading: isAreasLoading } = useSWR<TArea[]>(
    `/getAreas?name=`,
    fetcher
  );

  const areasOptions: Record<string, string> = useMemo(() => {
    return areasOptionsParser(areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, isAreasLoading]);

  const handleSubmit = async (value: TInsertPerson) => {
    if (modalMode === "add") {
      const response = await post(`/addPersons`, value);
      if (response.status === "success") {
        toast({
          title: "Persona agregada.",
          description: "Se ha agregado exitosamente la persona al sistema.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await personMutate(`/getPersons?name=${""}&area=${""}`);
        onClose();
      } else {
        toast({
          title: "Error.",
          description: response.msg || "algo salió mal.",
          status: response.msg ? "error" : "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
    if (modalMode === "edit") {
      const constructedData: TPerson = {
        ...value,
        _id: person?._id ?? "",
        nameE: person?.nameE ?? "",
        lastnameE: person?.lastnameE ?? "",
      };

      const response = await post(`/editPersons`, constructedData);
      if (response.status === "success") {
        toast({
          title: "Persona editada.",
          description: "Se ha editado exitosamente la persona en el sistema.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        const backup: TPerson[] = [];
        persons?.forEach((element) => {
          if (element._id === constructedData._id) {
            backup.push(constructedData);
          } else {
            backup.push(element);
          }
        });
        if (mutate) {
          await mutate(backup, false);
        }
        onClose();
      } else {
        toast({
          title: "Error.",
          description: response.msg || "algo salió mal.",
          status: response.msg ? "error" : "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  const handleImportButton = () => {
    if (modalMode === "add") {
      setListMode("add");
      setActiveDialog("import-excel");
    }
    if (modalMode === "edit") {
      setListMode("edit");
      setActiveDialog("import-excel");
    }
  };

  useEffect(() => {
    // Reset the form when modal closes or opens
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[modalMode].header} PERSONA</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <ModalBody>
            <Flex sx={styles.MainContainer}>
              <Flex w="1254px" flexDirection="column" ml="5" mr="5">
                <Flex sx={styles.asd}>
                  <Flex sx={styles.rutProfile}>
                    <Flex sx={styles.ProfilePic}>
                      <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                        <IoPersonSharp />
                      </Icon>
                    </Flex>
                    <FormField
                      control={form.control}
                      name="rut"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomInput label="RUT" height="47" {...field} />
                          </FormControl>
                          <FormFieldMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>
                  <Flex flexDirection="column">
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="NOMBRES"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormField
                          control={form.control}
                          name="lastname"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="APELLIDOS"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="TELEFONO CASA"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormField
                          control={form.control}
                          name="insurance"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="SEGURO MÉDICO"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputHouse}>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="DIRECCIÓN CASA"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormField
                          control={form.control}
                          name="bloodType"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="GRUPO SANGUÍNEO"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormField
                          control={form.control}
                          name="areaId"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomSelect
                                  {...field}
                                  label="CURSO / AREA"
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
                                  value={areasOptions[field.value]}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormField
                          control={form.control}
                          name="Rname"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="NOMBRE APODERADO"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormField
                          control={form.control}
                          name="Rlastname"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="APELLIDO APODERADO"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormField
                          control={form.control}
                          name="Rphone"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="TELEFONO APODERADO"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormField
                          control={form.control}
                          name="EmergencyContact"
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <CustomInput
                                  label="CONTACTO EMERGENCIA"
                                  height="47"
                                  {...field}
                                />
                              </FormControl>
                              <FormFieldMessage />
                            </FormItem>
                          )}
                        />
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {modalMode !== "edit" && (
              <>
                <Button
                  sx={styles.Button}
                  bg="#FF2B91"
                  color={white}
                  leftIcon={
                    <Icon fontSize="24px" mb="1px" ml="1px">
                      <HiOutlineDocumentAdd />
                    </Icon>
                  }
                  onClick={handleImportButton}
                >
                  IMPORTAR
                </Button>
                <Spacer />
              </>
            )}
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
        <ImportPersonDialog
          isOpen={activeDialog === "import-excel"}
          onClose={() => setActiveDialog("none")}
          listMode={listMode}
        />
      </ModalContent>
    </Modal>
  );
}
