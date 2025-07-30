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
import React from "react";
import { styles } from "./change-password-dialog.module";
import CustomInput from "../../ui/input/input";
import { white } from "~/utils/colors";
import { URL } from "~/utils/consts";
import post from "~/utils/post";
import type { TUpdatePassword } from "~/utils/validators";
import { UpdatePasswordSchema } from "~/utils/validators";
import type { TSafeUser } from "~/utils/validators";
import {
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";

interface ChangePasswordDialogProps {
  isOpen: boolean;
  onClose: () => void;
  user: TSafeUser | undefined;
}

export default function ChangePasswordDialog({
  isOpen,
  onClose,
  user,
}: ChangePasswordDialogProps) {
  const toast = useToast();
  const form = useForm({
    schema: UpdatePasswordSchema,
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const handleChangePassword = async (values: TUpdatePassword) => {
    if (values.password !== values.confirmPassword) {
      toast({
        title: "Las contraseñas no coinciden.",
        description: "Las contraseñas ingresadas no coinciden.",
        status: "error",
        duration: 9000,
        isClosable: true,
      });
    } else {
      const constructedData = {
        ...values,
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
        <FormProvider {...form}>
          <Flex p="3" m="3" mt="0" flexDirection="column" w="417px" gap="2">
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
              onClick={form.handleSubmit(handleChangePassword)}
            >
              APLICAR
            </Button>
          </ModalFooter>
        </FormProvider>
      </ModalContent>
    </Modal>
  );
}
