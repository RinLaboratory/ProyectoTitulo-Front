"use client";

import {
  Flex,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
  FormControl,
} from "@chakra-ui/react";
import { HiDocumentAdd } from "react-icons/hi";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import { styles } from "./change-password.module";
import CustomInput from "../../ui/input/input";
import { white } from "~/utils/colors";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import type { TSafeUser } from "~/utils/validators";

interface ChangePasswordProps {
  isOpen: boolean;
  onClose: () => void;
  user: TSafeUser | undefined;
}

export default function ChangePassword({
  isOpen,
  onClose,
  user,
}: ChangePasswordProps) {
  const defaultData = {
    password: "",
    confirmPassword: "",
  };

  const toast = useToast();
  const [data, setData] = useState(defaultData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangePassword = async (
    e: React.BaseSyntheticEvent<object, unknown, unknown>
  ) => {
    e.preventDefault();

    if (data.password !== data.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden.",
        description: "Las contraseñas ingresadas no coinciden.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const constructedData = {
        ...data,
        passwordId: user?.password_id,
      };
      const response = await post(`${URL}/changePassword`, constructedData);
      if (response.status === "success") {
        toast({
          title: "Contraseña actualizada.",
          description: "Has actualizado tu contraseña correctamente.",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
        onClose();
      } else {
        toast({
          title: "Error.",
          description: "Algo salió mal.",
          status: "warning",
          duration: 9000,
          isClosable: true,
        });
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>CAMBIAR CONTRASEÑA</ModalHeader>
        <ModalCloseButton />
        <ModalBody></ModalBody>
        <form onSubmit={handleChangePassword}>
          <Flex p="3" m="3" mt="0" flexDirection="column">
            <Flex flexDirection="row" mb="30">
              <Flex flexDirection="column" w="417px">
                <FormControl isRequired>
                  <CustomInput
                    label="CONTRASEÑA"
                    height="47"
                    type="password"
                    value={data.password}
                    name="password"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Flex>
            </Flex>
            <Flex flexDirection="row">
              <Flex flexDirection="column" w="417px">
                <FormControl isRequired>
                  <CustomInput
                    label="CONFIRMAR CONTRASEÑA"
                    height="47"
                    type="password"
                    value={data.confirmPassword}
                    name="confirmPassword"
                    onChange={handleInputChange}
                  />
                </FormControl>
              </Flex>
            </Flex>
          </Flex>
          <ModalFooter>
            <Button
              bg="#FF2B91"
              color={white}
              iconSpacing="16px"
              sx={styles.Button}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <HiDocumentAdd />
                </Icon>
              }
              mr="1"
              type="submit"
            >
              APLICAR
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
}
