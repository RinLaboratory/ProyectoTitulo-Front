"use client";

import {
  Flex,
  Icon,
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
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IoEyeSharp } from "react-icons/io5";
import Link from "next/link";
import { regular18 } from "~/styles/fonts";
import { styles } from "./resting-dialog.module";
import type { TIndexData, TPerson, TPersonState } from "~/utils/validators";
import { areasOptionsParser } from "~/utils/areas-options-parser";

interface RestingDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: TPersonState;
  indexData: TIndexData | undefined;
  isLoading: boolean;
}

const viewMode = {
  reposo: {
    header: "PERSONAS EN REPOSO",
  },
  retirado: {
    header: "PERSONAS RETIRADAS",
  },
  atendido: {
    header: "PERSONAS ATENDIDAS",
  },
};

export default function RestingDialog({
  isOpen,
  onClose,
  mode,
  indexData,
  isLoading = false,
}: RestingDialogProps) {
  const displayData: TPerson[] | undefined = useMemo(() => {
    if (!indexData) return;

    if (mode === "reposo") {
      return indexData.reposo;
    }
    if (mode === "retirado") {
      return indexData.retirado;
    } else {
      return indexData.atendido;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, indexData]);

  const areasOptions: Record<string, string> | undefined = useMemo(() => {
    return areasOptionsParser(indexData?.areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, indexData]);

  const Tabs = ["NOMBRE Y APELLIDO", "NOMBRE AREA / CURSO", "RUT", ""];
  const Tabs850px = ["NOMBRES", "CURSO"];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>{viewMode[mode].header}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex sx={styles.MainContainer}>
            <Flex w="100%" flexDirection="column" ml="5" mr="5">
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
                        {Tabs850px.map((data, key) => (
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
                      {!isLoading ? (
                        displayData?.map((data, key) => (
                          <Tr key={key} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={styles.TableTextURL}
                              color="#000000"
                            >
                              <Link
                                href={{
                                  pathname: "/person-info",
                                  query: {
                                    person: data._id,
                                  },
                                }}
                                passHref
                              >
                                {data.name} {data.lastname}
                              </Link>
                            </Td>
                            <Td
                              textAlign="center"
                              sx={styles.TableText}
                              color="#000000"
                            >
                              {areasOptions[data.areaId]}
                            </Td>
                          </Tr>
                        ))
                      ) : (
                        <></>
                      )}
                    </Tbody>
                    <Tbody sx={styles.HideOn850px}>
                      {!isLoading ? (
                        displayData?.map((data, key) => (
                          <Tr key={key} textAlign="center">
                            <Td
                              textAlign="center"
                              sx={styles.TableText}
                              color="#000000"
                            >
                              {data.name} {data.lastname}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={styles.TableText}
                              color="#000000"
                            >
                              {areasOptions[data.areaId]}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={styles.TableText}
                              color="#000000"
                            >
                              {data.rut}
                            </Td>
                            <Td
                              textAlign="center"
                              sx={styles.TableText}
                              color="#000000"
                            >
                              <Link
                                href={{
                                  pathname: "/person-info",
                                  query: {
                                    person: data._id,
                                  },
                                }}
                                passHref
                              >
                                <Icon
                                  sx={styles.LogoutIcon}
                                  viewBox="3 3 17 17"
                                >
                                  <IoEyeSharp />
                                </Icon>
                              </Link>
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
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
}
