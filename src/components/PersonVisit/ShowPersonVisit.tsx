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
  ModalBody,
  Box,
  Text,
  Spacer,
  ModalFooter,
  Button,
  useToast,
} from "@chakra-ui/react";
import {
  HiOutlineDocumentMagnifyingGlass,
  HiOutlineDocumentMinus,
} from "react-icons/hi2";
import type { ChangeEventHandler } from "react";
import React, { useEffect, useState } from "react";
import { styles } from "./ShowPersonVisit.module";
import CustomTextArea from "../CustomInputs/CustomTextArea";
import { softBlue, white } from "~/utils/colors";
import Swal from "sweetalert2";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import type { KeyedMutator } from "swr";
import { mutate as historyMutate } from "swr";
import type { THistory, TPerson } from "~/utils/types";

interface ShowPersonVisitProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "edit" | "view" | "add";
  person: TPerson | undefined;
  document?: THistory | undefined;
  documents?: THistory[] | undefined;
  mutate?: KeyedMutator<THistory[]>;
}

export default function ShowPersonVisit({
  isOpen,
  onClose,
  modalMode = "view",
  person,
  document,
  documents,
  mutate,
}: ShowPersonVisitProps) {
  const defaultData: THistory = {
    _id: "",
    timestamp: new Date(),
    personId: person?._id ?? "",
    sintomas: "",
    tratamiento: "",
    enviado: "",
  };

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

  const toast = useToast();
  const [mode, setMode] = useState(modalMode);
  const [data, setData] = useState<THistory>(defaultData);

  const handleInputChange: ChangeEventHandler<HTMLTextAreaElement> = (
    event
  ) => {
    if (mode !== "view") {
      setData({
        ...data,
        [event.target.name]: event.target.value,
      });
    }
  };

  const handleCheckBoxChange = (place: "Clase" | "Casa" | "Urgencias") => {
    if (mode !== "view") {
      if (
        (place === "Clase" && data.enviado === "Clase") ||
        (place === "Casa" && data.enviado === "Casa") ||
        (place === "Urgencias" && data.enviado === "Urgencias")
      ) {
        setData({
          ...data,
          enviado: "",
        });
      } else {
        setData({
          ...data,
          enviado: place,
        });
      }
    }
  };

  const handleEditButton = () => {
    if (mode === "view") setMode("edit");
    else setMode("view");
  };

  const handleApplyButton = async () => {
    setMode("view");
    await post(`${URL}/editPersonHistoryInfo`, data);
    const backup: THistory[] = [];
    documents?.forEach((element) => {
      if (element._id === data._id) {
        backup.push(data);
      } else {
        backup.push(element);
      }
    });
    if (mutate) {
      await mutate(backup, false);
    }
    toast({
      title: "Visita editada.",
      description: "La visita se ha editado exitosamente en el sistema.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleAddButton = async () => {
    setMode("view");
    const constructedData = {
      ...data,
      timestamp: new Date(),
    };
    await post(`${URL}/setPersonHistoryInfo`, constructedData);
    setData(constructedData);
    await historyMutate(`${URL}/getPersonHistoryInfo?personId=${person?._id}`);
    toast({
      title: "Visita agregada.",
      description: "La visita se ha añadido exitosamente en el sistema.",
      status: "success",
      duration: 9000,
      isClosable: true,
    });
  };

  const handleDeleteButton = async () => {
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
        const response = await post(`${URL}/deletePersonHistoryInfo`, {
          _id: data._id,
        });
        if (response.status === "success") {
          await Swal.fire(
            "¡Eliminado!",
            "La visita ha sido eliminada correctamente.",
            "success"
          );
          const backup = documents?.filter(
            (element) => element._id !== data._id
          );
          if (mutate) {
            await mutate(backup, false);
          }
          onClose();
        } else {
          await Swal.fire("Error", "Algo salió mal.", "error");
        }
      }
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setMode(modalMode);
      setData(defaultData);
    } else {
      if (document?.personId) {
        setData(document);
      }
    }
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
        <ModalBody></ModalBody>
        <Flex flexDirection="column" pl="6" pr="6">
          <CustomTextArea
            label="SINTOMAS / LESIONES"
            value={data.sintomas}
            name="sintomas"
            onChange={handleInputChange}
          />
          <Box h="5" />
          <CustomTextArea
            label="TRATAMIENTO"
            value={data.tratamiento}
            name="tratamiento"
            onChange={handleInputChange}
          />
          <Flex flexDirection="row" w="100%" justifyContent="center" pt="20px">
            <Spacer />
            <Flex onClick={() => handleCheckBoxChange("Clase")}>
              <Box
                w="25px"
                h="25px"
                borderWidth="1px"
                borderColor={softBlue}
                mr="4"
                bgColor={data.enviado === "Clase" ? softBlue : ""}
              />
              <Text sx={regular12}>ENVIADO A CLASE</Text>
            </Flex>
            <Spacer />
            <Flex onClick={() => handleCheckBoxChange("Casa")}>
              <Box
                w="25px"
                h="25px"
                borderWidth="1px"
                borderColor={softBlue}
                mr="4"
                bgColor={data.enviado === "Casa" ? softBlue : ""}
              />
              <Text sx={regular12}>ENVIADO A CASA</Text>
            </Flex>
            <Spacer />
            <Flex onClick={() => handleCheckBoxChange("Urgencias")}>
              <Box
                w="25px"
                h="25px"
                borderWidth="1px"
                borderColor={softBlue}
                mr="4"
                bgColor={data.enviado === "Urgencias" ? softBlue : ""}
              />
              <Text sx={regular12}>ENVIADO A URGENCIAS</Text>
            </Flex>
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
              onClick={() => handleAddButton()}
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
              onClick={() => handleApplyButton()}
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
      </ModalContent>
    </Modal>
  );
}
