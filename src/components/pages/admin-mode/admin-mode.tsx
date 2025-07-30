"use client";

import { regular18 } from "~/styles/fonts";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoSearch } from "react-icons/io5";
import { styles } from "./admin-mode.module";
import { white } from "~/utils/colors";
import ShowPersonInfoDialog from "./person-info-dialog/show-person-info-dialog";
import PersonListDialog from "./person-list-dialog/person-list-dialog";
import ShowUserInfoDialog from "./user-info-dialog/show-user-info-dialog";
import UserListDialog from "./user-list-dialog/user-list-dialog";
import Swal from "sweetalert2";
import AreaListDialog from "./area-list-dialog/area-list-dialog";
import { URL } from "~/utils/consts";
import post from "~/utils/post";

export type TActiveDialog =
  | "none"
  | "show-person-info"
  | "show-person-list"
  | "show-user-info"
  | "show-user-list"
  | "show-area-list";

export default function AdminMode() {
  const [activeDialog, setActiveDialog] = useState<TActiveDialog>("none");
  const [action, setAction] = useState<"edit" | "delete">("edit");

  const handleDeletePerson = () => {
    setAction("delete");
    setActiveDialog("show-person-list");
  };

  const handleEditPerson = () => {
    setAction("edit");
    setActiveDialog("show-person-list");
  };

  const handleDeleteUser = () => {
    setAction("delete");
    setActiveDialog("show-user-list");
  };

  const handleEditUser = () => {
    setAction("edit");
    setActiveDialog("show-user-list");
  };

  const handleNewYearButton = async () => {
    await Swal.fire({
      title: "ESTÁS A PUNTO DE INICIAR UN NUEVO AÑO",
      text: "TODOS LOS ESTUDIANTES PASARÁN AL SIGUIENTE AÑO EN LA ESCALA DE ENSEÑANZA (Los de IV° pasarán a ser ex-alumnos)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "INICIAR NUEVO AÑO",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await Swal.fire({
          title: "¿ESTAS ABSOLUTAMENTE SEGURO?",
          text: "ESTA ACCIÓN NO SE PUEDE REVERTIR.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonColor: "#3085d6",
          cancelButtonColor: "#d33",
          confirmButtonText: "SE LO QUE HAGO Y QUIERO HACERLO",
          cancelButtonText: "Cancelar",
        }).then(async (result) => {
          if (result.isConfirmed) {
            const response = await post(`${URL}/initNewYear`);
            if (response.status === "success") {
              await Swal.fire(
                "¡Se ha iniciado un nuevo año en el sistema!",
                "Los estudiantes se han movido al siguiente año en la escala de enseñanza exitosamente.",
                "success"
              );
            } else {
              await Swal.fire("Error", `${response.msg}`, "error");
            }
          }
        });
      }
    });
  };

  const buttonSelector = [
    {
      id: 0,
      text: "Administración Usuarios",
      button1: "AÑADIR USUARIO",
      button1action: () => setActiveDialog("show-user-info"),
      button2: "EDITAR USUARIO",
      button2action: handleEditUser,
      button3: "ELIMINAR USUARIO",
      button3action: handleDeleteUser,
    },
    {
      id: 1,
      text: "Administración de Personas de la insitución",
      button1: "AÑADIR PERSONA",
      button1action: () => setActiveDialog("show-person-info"),
      button2: "EDITAR PERSONA",
      button2action: handleEditPerson,
      button3: "ELIMINAR PERSONA",
      button3action: handleDeletePerson,
    },
    {
      id: 2,
      text: "Administración Anual",
      button1: "INICIO DE AÑO NUEVO",
      button1action: handleNewYearButton,
      button2: "ADMINISTRACION\nAREA / CURSO",
      button2action: () => setActiveDialog("show-area-list"),
      button3: "",
      button3action: () => {
        return undefined;
      },
    },
  ];

  return (
    <Flex sx={styles.MainContainer}>
      {buttonSelector.map((data, key) => (
        <Flex key={key} sx={styles.OptionContainer}>
          <Flex sx={styles.LeftOptionContainer}>
            <Text sx={regular18}>{data.text}</Text>
            <Flex sx={styles.Buttons}>
              <Button
                sx={styles.Button}
                bg="#FF2B91"
                color={white}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <IoSearch />
                  </Icon>
                }
                onClick={data.button1action}
              >
                {data.button1}
              </Button>
              <Button
                sx={styles.Button}
                bg="#FF2B91"
                color={white}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <IoSearch />
                  </Icon>
                }
                onClick={data.button2action}
              >
                {data.button2}
              </Button>
              {data.button3 !== "" && (
                <Button
                  sx={styles.Button}
                  bg="#FF2B91"
                  color={white}
                  leftIcon={
                    <Icon fontSize="24px" mb="1px" ml="1px">
                      <IoSearch />
                    </Icon>
                  }
                  onClick={data.button3action}
                >
                  {data.button3}
                </Button>
              )}
            </Flex>
          </Flex>
        </Flex>
      ))}
      <ShowPersonInfoDialog
        isOpen={activeDialog === "show-person-info"}
        onClose={() => setActiveDialog("none")}
      />
      <PersonListDialog
        isOpen={activeDialog === "show-person-list"}
        onClose={() => setActiveDialog("none")}
        listMode={action}
      />
      <ShowUserInfoDialog
        isOpen={activeDialog === "show-user-info"}
        onClose={() => setActiveDialog("none")}
      />
      <UserListDialog
        isOpen={activeDialog === "show-user-list"}
        onClose={() => setActiveDialog("none")}
        userListMode={action}
      />
      <AreaListDialog
        isOpen={activeDialog === "show-area-list"}
        onClose={() => setActiveDialog("none")}
      />
    </Flex>
  );
}
