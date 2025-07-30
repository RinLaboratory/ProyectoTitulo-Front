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
} from "@chakra-ui/react";

import React, { useEffect } from "react";
import { IoPersonSharp } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./show-user-info-dialog.module";
import CustomInput from "../../../ui/input/input";
import { white } from "~/utils/colors";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import type { KeyedMutator } from "swr";
import { mutate as userMutate } from "swr";
import type { TInsertUser, TSafeUser } from "~/utils/validators";
import { InsertUserSchema } from "~/utils/validators";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";

interface ShowUserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  modalMode?: "add" | "view" | "edit";
  user?: TSafeUser | undefined;
  users?: TSafeUser[] | undefined;
  mutate?: KeyedMutator<TSafeUser[]>;
  defaultValues?: TInsertUser;
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

export default function ShowUserInfoDialog({
  isOpen,
  onClose,
  modalMode = "add",
  user,
  users,
  mutate,
  defaultValues,
}: ShowUserInfoDialogProps) {
  const toast = useToast();

  const form = useForm({
    schema: InsertUserSchema,
    defaultValues,
  });

  const handleSubmit = async (values: TInsertUser) => {
    if (values.password === values.confirmPassword) {
      if (modalMode === "add") {
        const response = await post(`${URL}/register`, values);
        if (response.status === "success") {
          toast({
            title: "Usuario agregado.",
            description: "El usuario se ha agregado exitosamente al sistema.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          await userMutate(`${URL}/getusers?username=${""}`);
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
        const constructedData = {
          ...user,
          ...values,
        };

        const response = await post<TSafeUser>(
          `${URL}/editUser`,
          constructedData
        );
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
            if (element._id === constructedData._id) {
              backup.push(response.data);
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

  useEffect(() => {
    // Reset the form when modal closes or opens
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[modalMode].header} USUARIO</ModalHeader>
        <ModalCloseButton />
        <FormProvider {...form}>
          <ModalBody>
            <Flex
              sx={styles.MainContainer}
              flexDirection="row"
              alignItems="center"
            >
              <Flex sx={styles.ProfilePicture}>
                <Flex bgColor="#D9D9D9">
                  <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                    <IoPersonSharp />
                  </Icon>
                </Flex>
              </Flex>
              <Flex flexDirection="column">
                <Flex sx={styles.CustomInput}>
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            label="NOMBRE DE USUARIO"
                            height="47"
                            {...field}
                          />
                        </FormControl>
                        <FormFieldMessage />
                      </FormItem>
                    )}
                  />
                </Flex>
                <Flex sx={styles.CustomInput}>
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            label="CORREO ELECTRÓNICO"
                            height="47"
                            {...field}
                          />
                        </FormControl>
                        <FormFieldMessage />
                      </FormItem>
                    )}
                  />
                </Flex>
                <Flex sx={styles.CustomInput}>
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            label="CONTRASEÑA"
                            height="47"
                            type="password"
                            {...field}
                          />
                        </FormControl>
                        <FormFieldMessage />
                      </FormItem>
                    )}
                  />
                </Flex>
                <Flex sx={styles.CustomInput}>
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CustomInput
                            label="CONFIRMAR CONTRASEÑA"
                            height="47"
                            type="password"
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
          </ModalBody>
          <ModalFooter>
            {modalMode !== "view" && (
              <Button
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
