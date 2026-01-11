"use client";

import { regular18 } from "~/styles/fonts";
import {
  Flex,
  Icon,
  Text,
  Button,
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
import React, { useEffect, useMemo, useState } from "react";
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./person-list-dialog.module";
import CustomInput from "../../../ui/input/input";
import CustomSelect from "../../../ui/select/select";
import ShowPersonInfoDialog from "../person-info-dialog/show-person-info-dialog";
import Swal from "sweetalert2";
import useSWR from "swr";
import ImportPersonDialog from "../import-person-dialog/import-person-dialog";
import { white } from "~/utils/colors";
import { SearchPersonSchema } from "~/utils/validators";
import type { TArea, TPerson } from "~/utils/validators";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";
import { areasOptionsParser } from "~/utils/areas-options-parser";
import * as http from "~/utils/http";

interface PersonListDialogProps {
  isOpen: boolean;
  onClose: () => void;
  listMode: "delete" | "edit";
}

const viewMode = {
  delete: {
    header: "ELIMINAR",
  },
  edit: {
    header: "EDITAR",
  },
};

const defaultValues = {
  name: "",
  area: "",
};

type TActiveDialog = "none" | "show-person-info" | "import-excel";

export default function PersonListDialog({
  isOpen,
  onClose,
  listMode,
}: PersonListDialogProps) {
  const form = useForm({
    schema: SearchPersonSchema,
    defaultValues,
  });
  const formValues = form.watch();
  const [selectedPerson, setSelectedPerson] = useState<TPerson | undefined>(
    undefined,
  );
  const [listModeImport, setListModeImport] = useState<"edit" | "add">("add");
  const [activeDialog, setActiveDialog] = useState<TActiveDialog>("none");

  const { data: areas, isLoading: isAreasLoading } = useSWR<TArea[]>(
    `/areas?name=`,
    http.get,
  );

  const {
    data: persons,
    isLoading: isPersonsLoading,
    mutate,
  } = useSWR<TPerson[]>(
    `/persons?name=${formValues.name}&areaId=${formValues.area}`,
    http.get,
  );

  const areasOptions: Record<string, string> = useMemo(() => {
    return areasOptionsParser(areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, isAreasLoading]);

  const handleEditButton = (e: TPerson) => {
    setSelectedPerson(e);
    setActiveDialog("show-person-info");
  };

  const handleImportButton = () => {
    setListModeImport("edit");
    setActiveDialog("import-excel");
  };

  const handleDeleteButton = async (e: TPerson) => {
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
        try {
          await http.del(`/persons`, e);
          await Swal.fire(
            "¡Eliminado!",
            "La persona ha sido eliminada correctamente.",
            "success",
          );
          const backup = persons?.filter((element) => element._id !== e._id);
          await mutate(backup, false);
          onClose();
        } catch {
          await Swal.fire(
            "Error",
            "No puedes eliminar a esta persona.",
            "error",
          );
        }
      }
    });
  };

  useEffect(() => {
    // Reset the form when modal closes or opens
    form.reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const Tabs = ["NOMBRES", "APELLIDO", "RUT", ""];
  const TabsOn850 = ["NOMBRES", "RUT"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[listMode].header} PERSONA</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex sx={styles.MainContainer}>
            <Flex w="100%" flexDirection="column" ml="5" mr="5">
              <Flex flexDirection="row" mb="30">
                <FormProvider {...form}>
                  <Flex flexDirection="column">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomInput
                              label="NOMBRE / APELLIDO"
                              height="47"
                              {...field}
                            />
                          </FormControl>
                          <FormFieldMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>
                  <Flex flexDirection="column" ml="50">
                    <FormField
                      control={form.control}
                      name="area"
                      render={({ field }) => (
                        <FormItem>
                          <FormControl>
                            <CustomSelect
                              {...field}
                              label="CURSO / AREA"
                              options={
                                isAreasLoading
                                  ? [
                                      {
                                        label: "Ninguno",
                                        value: "default",
                                        _id: "",
                                      },
                                    ]
                                  : areas
                              }
                              value={areasOptions[field.value]}
                            />
                          </FormControl>
                          <FormFieldMessage />
                        </FormItem>
                      )}
                    />
                  </Flex>
                </FormProvider>
                {listMode === "edit" && (
                  <Button
                    sx={styles.Button}
                    bg="#FF2B91"
                    color={white}
                    leftIcon={
                      <Icon fontSize="24px" mb="1px" ml="1px">
                        <HiOutlineDocumentAdd />
                      </Icon>
                    }
                    onClick={handleImportButton}
                  >
                    <Text sx={styles.Import}>IMPORTAR</Text>
                  </Button>
                )}
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
                      {!isPersonsLoading ? (
                        persons?.map((data) => (
                          <Tr key={data._id} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={styles.TableTextURL}
                              color="#000000"
                            >
                              {listMode === "edit" && (
                                <Box onClick={() => handleEditButton(data)}>
                                  {data.name} {data.lastname}
                                </Box>
                              )}
                              {listMode === "delete" && (
                                <Box onClick={() => handleDeleteButton(data)}>
                                  {data.name} {data.lastname}
                                </Box>
                              )}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.rut}
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </Tbody>
                    <Tbody sx={styles.HideOn850px}>
                      {!isPersonsLoading ? (
                        persons?.map((data) => (
                          <Tr key={data._id} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.name}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.lastname}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {data.rut}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={regular18}
                              color="#000000"
                            >
                              {listMode === "edit" && (
                                <Box onClick={() => handleEditButton(data)}>
                                  <Icon
                                    sx={styles.LogoutIcon}
                                    viewBox="3 3 17 17"
                                  >
                                    <IoEyeSharp />
                                  </Icon>
                                </Box>
                              )}
                              {listMode === "delete" && (
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
          <ShowPersonInfoDialog
            isOpen={activeDialog === "show-person-info"}
            onClose={() => setActiveDialog("none")}
            person={selectedPerson}
            modalMode={"edit"}
            persons={persons}
            mutate={mutate}
            defaultValues={{
              rut: selectedPerson?.rut ?? "",
              areaId: selectedPerson?.areaId ?? "",
              bloodType: selectedPerson?.bloodType ?? "",
              EmergencyContact: selectedPerson?.EmergencyContact ?? "",
              insurance: selectedPerson?.insurance ?? "",
              lastname: selectedPerson?.lastname ?? "",
              name: selectedPerson?.name ?? "",
              phone: selectedPerson?.phone ?? "",
              address: selectedPerson?.address ?? "",
              Rlastname: selectedPerson?.Rlastname ?? "",
              Rname: selectedPerson?.Rname ?? "",
              Rphone: selectedPerson?.Rphone ?? "",
            }}
          />
          <ImportPersonDialog
            isOpen={activeDialog === "import-excel"}
            onClose={() => setActiveDialog("none")}
            listMode={listModeImport}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
