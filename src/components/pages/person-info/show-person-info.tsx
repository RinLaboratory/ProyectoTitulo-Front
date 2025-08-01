"use client";

import { regular18 } from "~/styles/fonts";
import { white } from "~/utils/colors";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import React, { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IoPersonSharp, IoDocumentTextOutline } from "react-icons/io5";
import { HiDocumentAdd } from "react-icons/hi";
import { styles } from "./show-person-info.module";
import ShowPersonHistoryDialog from "../person-history-dialog/show-person-history-dialog";
import useSWR from "swr";
import ShowPersonVisitDialog from "../person-visit-dialog/show-person-visit-dialog";
import type { TArea, TPerson } from "~/utils/validators";
import CustomInput from "~/components/ui/input/input";
import CustomSelect from "~/components/ui/select/select";
import { areasOptionsParser } from "~/utils/areas-options-parser";
import * as http from "~/utils/http";

type TActiveDialog = "history-table" | "insert-history" | "none";

export default function ShowPersonInfo() {
  const searchParams = useSearchParams();
  const person = searchParams.get("person") as unknown as string;
  const [activeDialog, setActiveDialog] = useState<TActiveDialog>("none");

  const { data: areas, isLoading: isAreasLoading } = useSWR<TArea[]>(
    `/areas?name=`,
    http.get
  );

  const { data: persons, isLoading: isPersonsLoading } = useSWR<TPerson>(
    `/persons/${person}`,
    http.get
  );

  const areasOptions: Record<string, string> | undefined = useMemo(() => {
    return areasOptionsParser(areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAreasLoading, areas]);

  if (isPersonsLoading || isAreasLoading) {
    return <></>;
  }

  return (
    <Flex sx={styles.MainContainer}>
      <Flex flexDirection="column" ml="5" mr="5">
        <Text sx={regular18}>Información paciente</Text>
        <Flex sx={styles.ChangePos}>
          <Flex
            flexDirection="column"
            mr="5"
            alignItems="center"
            alignContent="center"
          >
            <Flex bgColor="#D9D9D9">
              <Icon sx={styles.LogoutIcon} viewBox="-1 -1 17 17">
                <IoPersonSharp />
              </Icon>
            </Flex>
            <Text sx={regular18} textAlign="center">
              {persons?.rut}
            </Text>
            <Flex flexDirection="column" w="200px">
              <Button
                bg="#FF2B91"
                color={white}
                iconSpacing="16px"
                sx={styles.Button}
                leftIcon={
                  <Icon fontSize="24px" mb="1px" ml="1px">
                    <IoDocumentTextOutline />
                  </Icon>
                }
                mr="1"
                onClick={() => setActiveDialog("history-table")}
              >
                VER HISTORIAL
              </Button>
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
                onClick={() => setActiveDialog("insert-history")}
              >
                AÑADIR VISITA
              </Button>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="NOMBRES"
                  height="47"
                  defaultValue={persons?.name}
                  readOnly
                />
              </Flex>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="APELLIDOS"
                  height="47"
                  defaultValue={persons?.lastname}
                  readOnly
                />
              </Flex>
            </Flex>
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="TELEFONO CASA"
                  height="47"
                  defaultValue={persons?.phone}
                  readOnly
                />
              </Flex>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="SEGURO MÉDICO"
                  height="47"
                  defaultValue={persons?.insurance}
                  readOnly
                />
              </Flex>
            </Flex>
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputLarge}>
                <CustomInput
                  label="DIRECCIÓN CASA"
                  height="47"
                  defaultValue={persons?.address}
                  readOnly
                />
              </Flex>
            </Flex>
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="GRUPO SANGUÍNEO"
                  height="47"
                  defaultValue={persons?.bloodType}
                  readOnly
                />
              </Flex>
              <Flex sx={styles.InputContainer}>
                <CustomSelect
                  label="CURSO / AREA"
                  name="areaId"
                  value={persons ? areasOptions[persons.areaId] : undefined}
                  options={areas}
                  isReadOnly
                />
              </Flex>
            </Flex>
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="NOMBRE APODERADO"
                  height="47"
                  defaultValue={persons?.Rname}
                  readOnly
                />
              </Flex>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="APELLIDO APODERADO"
                  height="47"
                  defaultValue={persons?.Rlastname}
                  readOnly
                />
              </Flex>
            </Flex>
            <Flex sx={styles.InputSection}>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="TELEFONO APODERADO"
                  height="47"
                  defaultValue={persons?.Rphone}
                  readOnly
                />
              </Flex>
              <Flex sx={styles.InputContainer}>
                <CustomInput
                  label="CONTACTO EMERGENCIA"
                  height="47"
                  defaultValue={persons?.EmergencyContact}
                  readOnly
                />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
      <ShowPersonHistoryDialog
        person={persons}
        isOpen={activeDialog === "history-table"}
        onClose={() => setActiveDialog("none")}
      />
      <ShowPersonVisitDialog
        person={persons}
        modalMode="add"
        isOpen={activeDialog === "insert-history"}
        onClose={() => setActiveDialog("none")}
      />
    </Flex>
  );
}
