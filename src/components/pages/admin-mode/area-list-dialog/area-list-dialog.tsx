"use client";

import { regular18 } from "~/styles/fonts";
import {
  Flex,
  Icon,
  Text,
  Button,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  Box,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./area-list.module-dialog";
import CustomInput from "../../../ui/input/input";
import Swal from "sweetalert2";
import ShowAreaInfoDialog from "../area-info-dialog/show-area-info-dialog";
import { white } from "~/utils/colors";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import type { TArea } from "~/utils/validators";

interface AreaListDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TActiveDialog = "none" | "show-area-info";

export default function AreaListDialog({
  isOpen,
  onClose,
}: AreaListDialogProps) {
  const [query, setQuery] = useState<string>("");
  const [selectedArea, setSelectedArea] = useState<TArea | undefined>(
    undefined,
  );
  const [activeDialog, setActiveDialog] = useState<TActiveDialog>("none");
  const [listMode, setListMode] = useState<"view" | "add" | "edit">("add");

  const {
    data: areas,
    isLoading: isAreasLoading,
    mutate,
  } = useSWR<TArea[]>(`${URL}/getAreas?name=${query}`, fetcher);

  const handleEditButton = (area: TArea) => {
    setListMode("edit");
    setSelectedArea(area);
    setActiveDialog("show-area-info");
  };

  const handleDeleteButton = async (area: TArea) => {
    await Swal.fire({
      title: "¿Estás seguro que quieres eliminar esta area / curso?",
      text: `Se eliminará el area / curso "${area.label}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const response = await post<TArea>(`${URL}/deleteArea`, area);
        if (response.status === "success") {
          await Swal.fire(
            "¡Eliminado!",
            "El area / curso se ha eliminado correctamente.",
            "success",
          );
          const backup = areas?.filter((element) => element._id !== area._id);
          await mutate(backup, false);
          onClose();
        } else {
          await Swal.fire("Error", `${response.msg}`, "error");
        }
      }
    });
  };

  const handleAddButton = () => {
    setListMode("add");
    setActiveDialog("show-area-info");
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const Tabs = ["NOMBRE AREA / CURSO", "", ""];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>ADMINISTRACIÓN AREA / CURSO</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex sx={styles.MainContainer}>
            <Flex w="100%" flexDirection="column" ml="5" mr="5">
              <Flex flexDirection="row" mb="30">
                <Flex flexDirection="column">
                  <CustomInput
                    label="NOMBRE DE AREA / CURSO"
                    height="47"
                    name="value"
                    value={query}
                    onChange={handleInputChange}
                  />
                </Flex>
                <Button
                  sx={styles.Button}
                  bg="#FF2B91"
                  color={white}
                  leftIcon={
                    <Icon fontSize="24px" mb="1px" ml="1px">
                      <HiOutlineDocumentAdd />
                    </Icon>
                  }
                  onClick={handleAddButton}
                >
                  AÑADIR
                </Button>
              </Flex>
              <Text sx={regular18}>RESULTADOS</Text>
              <Flex bgColor="#D9D9D9" p="3" borderRadius="12px">
                <TableContainer w="100%">
                  <Table variant="striped" w="100%">
                    <Thead>
                      <Tr>
                        {Tabs.map((data, key) => (
                          <Th
                            key={key}
                            textAlign="center"
                            sx={regular18}
                            color="#000000"
                            fontWeight="400"
                          >
                            {data}
                          </Th>
                        ))}
                      </Tr>
                    </Thead>
                    <Tbody>
                      {!isAreasLoading ? (
                        areas?.map((data, key) => (
                          <Tr key={key} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.label}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              <Box onClick={() => handleEditButton(data)}>
                                <Icon
                                  sx={styles.LogoutIcon}
                                  viewBox="3 3 17 17"
                                >
                                  <IoEyeSharp />
                                </Icon>
                              </Box>
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              <Box onClick={() => handleDeleteButton(data)}>
                                <Icon
                                  sx={styles.LogoutIcon}
                                  viewBox="3 1 21 21"
                                >
                                  <IoTrash />
                                </Icon>
                              </Box>
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </Tbody>
                  </Table>
                </TableContainer>
              </Flex>
            </Flex>
          </Flex>
          <ShowAreaInfoDialog
            area={selectedArea}
            isOpen={activeDialog === "show-area-info"}
            onClose={() => {
              setActiveDialog("none");
              setSelectedArea(undefined);
            }}
            modalMode={listMode}
            defaultValues={{
              isClass: selectedArea?.isClass ?? false,
              label: selectedArea?.label ?? "",
              nextId: selectedArea?.nextId ?? "",
              value: selectedArea?.value ?? "",
            }}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
