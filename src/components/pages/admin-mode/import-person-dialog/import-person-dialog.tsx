"use client";

import { regular18 } from "~/styles/fonts";
import {
  Flex,
  Icon,
  Image,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  ModalHeader,
  ModalContent,
  ModalOverlay,
  Modal,
  Text,
  Button,
  Input,
  useToast,
  Spacer,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { styles } from "./import-person-dialog.module";
import { HiOutlineDocumentAdd, HiOutlineDownload } from "react-icons/hi";
import Swal from "sweetalert2";
import { white } from "~/utils/colors";
import Link from "next/link";
import * as http from "~/utils/http";

interface ImportPersonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listMode: "add" | "edit";
}

export default function ImportPersonDialog({
  isOpen,
  onClose,
  listMode,
}: ImportPersonDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const toast = useToast();

  const viewMode = {
    add: {
      header: "IMPORTAR PERSONAS",
    },
    edit: {
      header: "IMPORTAR EDICIÓN MASIVA DE PERSONAS",
    },
  };

  const handleSubmit = async () => {
    if (!file) {
      toast({
        title: "Error.",
        description: "No has seleccionado ningún archivo",
        status: "warning",
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (listMode === "add") {
      await Swal.fire({
        title: "¿Estás seguro que quieres importar este archivo?",
        text: "Se crearán nuevos perfiles de personas",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await Swal.fire({
            title: "¿Estás absolutamente seguro?",
            text: "Esta acción no se puede revertir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sé lo que hago y quiero hacerlo",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await http.postFile<{ rows: number }>(
                  `/persons/import`,
                  file
                );
                await Swal.fire(
                  "Personas Importadas",
                  `Se han importado ${response.rows} personas al sistema.`,
                  "success"
                );
                onClose();
              } catch {
                await Swal.fire("Error", "Error al importar excel", "error");
              }
            }
          });
        }
      });
    }
    if (listMode === "edit") {
      await Swal.fire({
        title: "¿Estás seguro que quieres importar este archivo?",
        text: "Se editarán perfiles de personas",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Aceptar",
        cancelButtonText: "Cancelar",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await Swal.fire({
            title: "¿Estás absolutamente seguro?",
            text: "Esta acción no se puede revertir.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sé lo que hago y quiero hacerlo",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
              try {
                const response = await http.putFile<{ rows: number }>(
                  `/persons/import`,
                  file
                );
                await Swal.fire(
                  "Personas Editadas",
                  `Se han editado ${response.rows} personas en el sistema.`,
                  "success"
                );
                onClose();
              } catch {
                await Swal.fire("Error", "Error al importar excel", "error");
              }
            }
          });
        }
      });
    }
  };

  const handleFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files?.[0] ?? null;
    setFile(file);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[listMode].header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex sx={styles.MainContainer}>
            <Flex mb="25px">
              <Text sx={regular18}>
                ESTE ES EL FORMATO QUE DEBE LLEVAR EL DOCUMENTO
              </Text>
            </Flex>
            <Image src="example.png" alt="tabla de ejemplo de excel" />
            <Flex w="400px" mt="50px">
              <Input
                type="file"
                // accept=".xlsx"
                color="black"
                onChange={handleFileChange}
              />
            </Flex>
            {listMode === "edit" && (
              <>
                <Flex mb="25px" mt="25px">
                  <Text sx={regular18}>
                    Atención: Cualquier casilla vacía del excel no cambiará los
                    datos del sistema
                  </Text>
                </Flex>
                <Image src="example_edit.png" alt="tabla de ejemplo de excel" />
                <Flex mb="25px" mt="25px">
                  <Text sx={regular18}>
                    Ejemplo: Esto únicamente actualizará los datos de
                    "curso/area" de las personas en el sistema
                  </Text>
                </Flex>
              </>
            )}
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Link href={"Hoja de excel de ejemplo.xlsx"} passHref>
            <Button
              sx={styles.Button}
              bg="#FF2B91"
              color={white}
              leftIcon={
                <Icon fontSize="24px" mb="1px" ml="1px">
                  <HiOutlineDownload />
                </Icon>
              }
            >
              Descargar ejemplo
            </Button>
          </Link>
          <Spacer />
          <Button
            sx={styles.Button}
            bg="#FF2B91"
            color={white}
            leftIcon={
              <Icon fontSize="24px" mb="1px" ml="1px">
                <HiOutlineDocumentAdd />
              </Icon>
            }
            onClick={handleSubmit}
          >
            {listMode === "add" && "AÑADIR"}
            {listMode === "edit" && "APLICAR"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
