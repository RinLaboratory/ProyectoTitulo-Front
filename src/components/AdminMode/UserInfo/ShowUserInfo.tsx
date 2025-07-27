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
  FormControl,
  useToast,
} from "@chakra-ui/react";

import type { ChangeEvent, FormEvent } from "react";
import React, { useEffect, useState } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./ShowUserInfo.module";
import CustomInput from "../../CustomInputs/CustomInput";
import { white } from "~/utils/colors";
import ImportPerson from "../ImportPerson/ImportPerson";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import { EmailRegex } from "~/utils/regex";
import type { KeyedMutator } from "swr";
import { mutate as userMutate } from "swr";
import type { TSafeUser } from "~/utils/types";

interface ShowUserInfoProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "add" | "view" | "edit";
  user?: TSafeUser | undefined;
  users?: TSafeUser[] | undefined;
  mutate?: KeyedMutator<TSafeUser[]>;
}

export default function ShowUserInfo({
  isOpen,
  onClose,
  modalMode = "add",
  user,
  users,
  mutate,
}: ShowUserInfoProps) {
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

  const [mode, setMode] = useState(modalMode);

  const [data, setData] = useState<
    (TSafeUser & { password: string; confirmPassword: string }) | undefined
  >(undefined);

  const [showImportPerson, setShowImportPerson] = useState(false);
  const handleShowImportPerson = () => setShowImportPerson(!showImportPerson);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!data?.email.match(EmailRegex)) {
      toast({
        title: "Error",
        description: "El correo no es válido.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (data.password === data.confirmPassword) {
      if (mode === "add") {
        const response = await post(`${URL}/register`, data);
        if (response.status === "success") {
          toast({
            title: "Usuario agregado.",
            description: "El usuario se ha agregado exitosamente al sistema.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          await userMutate(`${URL}/getusers?username=${""}`);
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
        const response = await post<TSafeUser>(`${URL}/editUser`, data);
        if (response.status === "success") {
          toast({
            title: "Usuario editado.",
            description: "El usuario se ha editado exitosamente en el sistema.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          const backup: TSafeUser[] = [];
          users?.forEach((element) => {
            if (element._id === data._id) {
              backup.push(response.data);
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
    } else {
      toast({
        title: "Error",
        description: "Las contraseñas introducidas no coinciden.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (mode !== "view" && data) {
      setData({
        ...data,
        [event.target.name]: event.target.value,
      });
    }
  };

  useEffect(() => {
    if (!isOpen) {
      setMode(modalMode);
      setData(undefined);
    } else {
      if (user?._id) {
        setData({
          ...user,
          password: "",
          confirmPassword: "",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="3xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[mode].header} USUARIO</ModalHeader>
        <ModalCloseButton />
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <Flex sx={styles.MainContainer}>
              <Flex w="1254px" flexDirection="column" ml="5" mr="5">
                <Flex flexDirection="row" mt="3">
                  <Flex sx={styles.ProfilePicture}>
                    <Flex bgColor="#D9D9D9">
                      <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                        <IoPersonSharp />
                      </Icon>
                    </Flex>
                  </Flex>
                  <Flex flexDirection="column">
                    <Flex sx={styles.CustomInput}>
                      <FormControl isRequired>
                        <CustomInput
                          label="NOMBRE DE USUARIO"
                          value={data?.username}
                          name="username"
                          height="47"
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                    <Flex sx={styles.CustomInput}>
                      <FormControl isRequired>
                        <CustomInput
                          label="CORREO ELECTRÓNICO"
                          value={data?.email}
                          name="email"
                          height="47"
                          onChange={handleInputChange}
                        />
                      </FormControl>
                    </Flex>
                    <Flex sx={styles.CustomInput}>
                      <CustomInput
                        label="CONTRASEÑA"
                        value={data?.password}
                        name="password"
                        type="password"
                        height="47"
                        onChange={handleInputChange}
                      />
                    </Flex>
                    <Flex sx={styles.CustomInput}>
                      <CustomInput
                        label="CONFIRMAR CONTRASEÑA"
                        value={data?.confirmPassword}
                        name="confirmPassword"
                        type="password"
                        height="47"
                        onChange={handleInputChange}
                      />
                    </Flex>
                  </Flex>
                </Flex>
              </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            {mode !== "view" && (
              <Button
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
          listMode={"add"}
        />
      </ModalContent>
    </Modal>
  );
}
