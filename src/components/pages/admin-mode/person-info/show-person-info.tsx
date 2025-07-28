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
  FormControl,
  useToast,
} from "@chakra-ui/react";

import type { ChangeEvent, FormEvent } from "react";
import React, { useEffect, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./show-person-info.module";
import CustomInput from "../../../ui/input/input";
import { white } from "~/utils/colors";
import ImportPerson from "../import-person/import-person";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import { fetcher } from "~/utils/fetcher";
import type { KeyedMutator } from "swr";
import useSWR from "swr";
import CustomSelect from "~/components/ui/select/select";
import { mutate as personMutate } from "swr";
import type { TArea, TPerson } from "~/utils/types";

interface ShowPersonInfoProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "add" | "view" | "edit";
  mutate?: KeyedMutator<TPerson[]>;
  persons?: TPerson[] | undefined;
  person?: TPerson | undefined;
}

export default function ShowPersonInfo({
  isOpen,
  onClose,
  modalMode = "add",
  mutate,
  persons,
  person,
}: ShowPersonInfoProps) {
  const toast = useToast();

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

  const { data: areas, isLoading: isProjectLoading } = useSWR<TArea[]>(
    `${URL}/getAreas?name=${""}`,
    fetcher
  );

  const [areasOptions, setAreasOptions] = useState<Record<string, string>>({});

  const updateAreasOptions = () => {
    if (areas) {
      const obj: Record<string, string> = {};

      for (const item of areas) {
        obj[item._id] = item.label;
      }

      setAreasOptions(obj);
    }
  };

  const [mode, setMode] = useState(modalMode);

  const [listMode, setListMode] = useState<"add" | "edit">("add");

  const [data, setData] = useState<TPerson | undefined>(undefined);

  const [showImportPerson, setShowImportPerson] = useState(false);
  const handleShowImportPerson = () => setShowImportPerson(!showImportPerson);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (mode === "add") {
      const response = await post(`${URL}/addPersons`, data);
      if (response.status === "success") {
        toast({
          title: "Persona agregada.",
          description: "Se ha agregado exitosamente la persona al sistema.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        await personMutate(`${URL}/getPersons?name=${""}&area=${""}`);
        setData(undefined);
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
    if (mode === "edit") {
      const response = await post(`${URL}/editPersons`, data);
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
          if (element._id === data?._id) {
            backup.push(data);
          } else {
            backup.push(element);
          }
        });
        if (mutate) {
          await mutate(backup, false);
        }
        setData(undefined);
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

  const handleInputChange = (
    event:
      | ChangeEvent<HTMLInputElement>
      | { target: { value: string; name: string } }
  ) => {
    if (mode !== "view" && data) {
      setData({
        ...data,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleImportButton = () => {
    if (modalMode === "add") {
      setListMode("add");
      handleShowImportPerson();
    }
    if (modalMode === "edit") {
      setListMode("edit");
      handleShowImportPerson();
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMode(modalMode);
      setData(undefined);
    } else {
      if (person?._id) {
        setData({
          ...person,
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (!isProjectLoading) {
      updateAreasOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[mode].header} PERSONA</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
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
                    <FormControl isRequired>
                      <CustomInput
                        label="RUT"
                        value={data?.rut}
                        name="rut"
                        height="47"
                        onChange={handleInputChange}
                      />
                    </FormControl>
                  </Flex>
                  <Flex flexDirection="column">
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormControl isRequired>
                          <CustomInput
                            label="NOMBRES"
                            value={data?.name}
                            name="name"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormControl isRequired>
                          <CustomInput
                            label="APELLIDOS"
                            value={data?.lastname}
                            name="lastname"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormControl isRequired>
                          <CustomInput
                            label="TELEFONO CASA"
                            value={data?.phone}
                            name="phone"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormControl isRequired>
                          <CustomInput
                            label="SEGURO MÉDICO"
                            value={data?.insurance}
                            name="insurance"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputHouse}>
                        <FormControl isRequired>
                          <CustomInput
                            label="DIRECCIÓN CASA"
                            value={data?.address}
                            name="address"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormControl isRequired>
                          <CustomInput
                            label="GRUPO SANGUÍNEO"
                            value={data?.bloodType}
                            name="bloodType"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        {!isProjectLoading && (
                          <FormControl isRequired>
                            <CustomSelect
                              label="CURSO / AREA"
                              name="areaId"
                              value={
                                data ? areasOptions[data.areaId] : undefined
                              }
                              options={areas}
                              onChange={(value, name) =>
                                handleInputChange({
                                  target: {
                                    name: name,
                                    value: value,
                                  },
                                })
                              }
                            />
                          </FormControl>
                        )}
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormControl isRequired>
                          <CustomInput
                            label="NOMBRE APODERADO"
                            value={data?.Rname}
                            name="Rname"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormControl isRequired>
                          <CustomInput
                            label="APELLIDO APODERADO"
                            value={data?.Rlastname}
                            name="Rlastname"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                    </Flex>
                    <Flex sx={styles.BothInputs}>
                      <Flex sx={styles.InputContainer}>
                        <FormControl isRequired>
                          <CustomInput
                            label="TELEFONO APODERADO"
                            value={data?.Rphone}
                            name="Rphone"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                      <Flex sx={styles.InputContainerLeft}>
                        <FormControl isRequired>
                          <CustomInput
                            label="CONTACTO EMERGENCIA"
                            value={data?.EmergencyContact}
                            name="EmergencyContact"
                            height="47"
                            onChange={handleInputChange}
                          />
                        </FormControl>
                      </Flex>
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {mode !== "edit" && (
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
            {mode !== "view" && (
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
              >
                {mode === "add" && "AÑADIR"}
                {mode === "edit" && "APLICAR"}
              </Button>
            )}
          </ModalFooter>
        </form>
        <ImportPerson
          isOpen={showImportPerson}
          onClose={handleShowImportPerson}
          listMode={listMode}
        />
      </ModalContent>
    </Modal>
  );
}
