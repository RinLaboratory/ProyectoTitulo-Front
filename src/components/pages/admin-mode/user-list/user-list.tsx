"use client";

import { regular18 } from "~/styles/fonts";
import {
  Flex,
  Icon,
  Text,
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
import React, { useEffect, useState } from "react";
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { styles } from "./user-list.module";
import CustomInput from "../../../ui/input/input";
import Swal from "sweetalert2";
import ShowUserInfo from "../user-info/show-user-info";
import { URL } from "~/utils/consts";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import post from "~/utils/post";
import type { TSafeUser } from "~/utils/types";

interface UserListProps {
  isOpen: boolean;
  onClose: () => void;
  userListMode: "delete" | "edit";
}

export default function UserList({
  isOpen,
  onClose,
  userListMode,
}: UserListProps) {
  const [data, setData] = useState({
    username: "",
  });

  const {
    data: users,
    isLoading: isProjectLoading,
    mutate,
  } = useSWR<TSafeUser[]>(`${URL}/getusers?username=${data.username}`, fetcher);

  const viewMode = {
    "": {
      header: "",
    },
    delete: {
      header: "ELIMINAR",
    },
    edit: {
      header: "EDITAR",
    },
  };

  const [showPersonInfo, setShowPersonInfo] = useState(false);
  const handleShowPersonInfo = () => setShowPersonInfo(!showPersonInfo);

  const Tabs = ["NOMBRE DE USUARIO", "CORREO ELECTRÓNICO", ""];
  const TabsOn850 = ["USUARIO", "CORREO"];

  const [selectedUser, setSelectedUser] = useState<TSafeUser | undefined>(
    undefined
  );

  const handleEditButton = (e: TSafeUser) => {
    setSelectedUser(e);
    handleShowPersonInfo();
  };

  const handleDeleteButton = async (e: TSafeUser) => {
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
        const response = await post<TSafeUser>(`${URL}/deleteUser`, e);
        if (response.status === "success") {
          await Swal.fire(
            "¡Eliminado!",
            "El usuario ha sido eliminado correctamente.",
            "success"
          );
          const backup = users?.filter((element) => element._id !== e._id);
          await mutate(backup, false);
          onClose();
        } else {
          await Swal.fire("Error", "No puedes eliminar este usuario.", "error");
        }
      }
    });
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setSelectedUser(undefined);
      setData({ username: "" });
    }
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[userListMode].header} USUARIO</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex sx={styles.MainContainer}>
            <Flex w="100%" flexDirection="column" ml="5" mr="5">
              <Flex flexDirection="row" mb="30">
                <Flex flexDirection="column">
                  <CustomInput
                    label="NOMBRE DE USUARIO / CORREO ELECTRÓNICO"
                    height="47"
                    name="username"
                    value={data.username}
                    onChange={handleInputChange}
                  />
                </Flex>
              </Flex>
              <Text sx={regular18}>RESULTADOS</Text>
              <Flex bgColor="#D9D9D9" p="3" borderRadius="12px">
                <TableContainer w="100%">
                  <Table variant="striped" w="100%">
                    <Thead>
                      <Tr sx={styles.HideOn850px}>
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
                      <Tr sx={styles.ShowOn850px}>
                        {TabsOn850.map((data, key) => (
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
                    <Tbody sx={styles.ShowOn850px}>
                      {!isProjectLoading ? (
                        users?.map((data, key) => (
                          <Tr key={key} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={styles.TableTextURL}
                              color="#000000"
                            >
                              {userListMode === "edit" && (
                                <Box onClick={() => handleEditButton(data)}>
                                  {data.username}
                                </Box>
                              )}
                              {userListMode === "delete" && (
                                <Box onClick={() => handleDeleteButton(data)}>
                                  {data.username}
                                </Box>
                              )}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.email}
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </Tbody>
                    <Tbody sx={styles.HideOn850px}>
                      {!isProjectLoading ? (
                        users?.map((data, key) => (
                          <Tr key={key} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.username}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.email}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {userListMode === "edit" && (
                                <Box onClick={() => handleEditButton(data)}>
                                  <Icon
                                    sx={styles.LogoutIcon}
                                    viewBox="3 3 17 17"
                                  >
                                    <IoEyeSharp />
                                  </Icon>
                                </Box>
                              )}
                              {userListMode === "delete" && (
                                <Box onClick={() => handleDeleteButton(data)}>
                                  <Icon
                                    sx={styles.LogoutIcon}
                                    viewBox="3 1 21 21"
                                  >
                                    <IoTrash />
                                  </Icon>
                                </Box>
                              )}
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
          <ShowUserInfo
            isOpen={showPersonInfo}
            onClose={handleShowPersonInfo}
            user={selectedUser}
            modalMode={"edit"}
            users={users}
            mutate={mutate}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
