"use client";

import { regular18 } from "~/styles/fonts";
import { Flex, Icon, Text, Button, FormControl } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import type { ChangeEvent } from "react";
import React, { useState } from "react";
import Swal from "sweetalert2";
import { IoKeySharp } from "react-icons/io5";
import { styles } from "./UserLogin.module";
import CustomInput from "../CustomInputs/CustomInput";
import { white } from "~/utils/colors";
import post from "~/utils/post";

export default function UserLogin() {
  const router = useRouter();
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const handleLoginFunction = async (
    event: React.BaseSyntheticEvent<object, unknown, unknown>
  ) => {
    event.preventDefault();
    if (!data.email && !data.password) {
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
        const response = await post("/api/auth/login", data);
        if (response.status === "success") {
          localStorage.setItem("userdata", JSON.stringify(response.data));
          router.push("/");
        } else {
          await Swal.fire({
            title: "Credenciales Incorrectas",
            text: "Correo y/o contraseñas incorrectos.",
            icon: "error",
            showCancelButton: false,
            confirmButtonColor: "#3085d6",
            confirmButtonText: "Aceptar",
          });
        }
      } catch (err) {
        if (err instanceof Error) {
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
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Flex sx={styles.MainContainer}>
      <Text sx={regular18} pb="5">
        INICIO DE SESIÓN
      </Text>
      <form onSubmit={handleLoginFunction}>
        <Flex flexDirection="column" pb="5">
          <FormControl isRequired>
            <CustomInput
              label="CORREO ELECTRÓNICO"
              value={data.email}
              name="email"
              onChange={handleInput}
            />
          </FormControl>
        </Flex>
        <Flex flexDirection="column" pb="5">
          <FormControl isRequired>
            <CustomInput
              label="CONTRASEÑA"
              type="password"
              value={data.password}
              name="password"
              onChange={handleInput}
            />
          </FormControl>
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
        >
          INICIAR SESIÓN
        </Button>
      </form>
    </Flex>
  );
}
