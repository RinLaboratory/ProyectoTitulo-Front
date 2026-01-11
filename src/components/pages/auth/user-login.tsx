"use client";

import { regular18 } from "~/styles/fonts";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import React from "react";
import Swal from "sweetalert2";
import { IoKeySharp } from "react-icons/io5";
import { styles } from "./user-login.module";
import CustomInput from "../../ui/input/input";
import { white } from "~/utils/colors";
import login from "~/app/(auth)/actions";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";
import type { TLogin } from "~/utils/validators";
import { LoginSchema } from "~/utils/validators";

export default function UserLogin() {
  const router = useRouter();
  const form = useForm({
    schema: LoginSchema,
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLoginFunction = async (values: TLogin) => {
    if (!values.email && !values.password) {
      await Swal.fire({
        title: "Credenciales Incompletas",
        text: "Complete las casillas de inicio de sesión e inténtelo nuevamente.",
        icon: "info",
        showCancelButton: false,
        confirmButtonColor: "#3085d6",
        confirmButtonText: "Aceptar",
      });
    } else {
      try {
        const response = await login(values);
        if (response) {
          router.push("/");
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes("invalid credentials")) {
            await Swal.fire({
              title: "Credenciales Incorrectas",
              text: "Correo y/o contraseñas incorrectos.",
              icon: "error",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
            });
          } else {
            await Swal.fire({
              title: "Error 500",
              text: `Algo salió mal. \n${err}`,
              icon: "warning",
              showCancelButton: false,
              confirmButtonColor: "#3085d6",
              confirmButtonText: "Aceptar",
            });
          }
        }
      }
    }
  };

  return (
    <FormProvider {...form}>
      <Flex sx={styles.MainContainer}>
        <Text sx={regular18} pb="5">
          INICIO DE SESIÓN
        </Text>
        <>
          <Flex flexDirection="column" pb="5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput label="CORREO ELECTRÓNICO" {...field} />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <CustomInput
                      label="CONTRASEÑA"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
          </Flex>
          <Button
            sx={styles.Button}
            bg="#FF2B91"
            color={white}
            leftIcon={
              <Icon fontSize="24px" mb="1px" ml="1px">
                <IoKeySharp />
              </Icon>
            }
            type="submit"
            onClick={form.handleSubmit(handleLoginFunction)}
          >
            INICIAR SESIÓN
          </Button>
        </>
      </Flex>
    </FormProvider>
  );
}
