"use client";

import {
  Flex,
  Icon,
  Text,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { styles } from "./search-person.module";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import { SearchPersonSchema } from "~/utils/validators";
import type { TArea, TPerson } from "~/utils/validators";
import CustomSelect from "~/components/ui/select/select";
import CustomInput from "~/components/ui/input/input";
import {
  FormControl,
  FormField,
  FormFieldMessage,
  FormItem,
  FormProvider,
  useForm,
} from "~/components/ui/form/form";
import { areasOptionsParser } from "~/utils/areas-options-parser";

export default function SearchPerson() {
  const form = useForm({
    schema: SearchPersonSchema,
    defaultValues: {
      name: "",
      area: "default",
    },
  });
  const searchQuery = form.watch();

  const { data: persons, isLoading: isPersonsLoading } = useSWR<TPerson[]>(
    `/getPersons?name=${searchQuery.name}&area=${searchQuery.area}`,
    fetcher,
  );

  const { data: areas, isLoading: isAreasLoading } = useSWR<TArea[]>(
    `/getAreas?name=${""}`,
    fetcher,
  );

  const areasOptions: Record<string, string> = useMemo(() => {
    return areasOptionsParser(areas);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, isAreasLoading]);

  const Tabs = ["NOMBRE Y APELLIDO", "CURSO / AREA", "RUT", ""];
  const Tabs850px = ["NOMBRES", "CURSO"];

  return (
    <Flex sx={styles.MainContainer}>
      <Text sx={styles.HeaderText}>Buscar paciente</Text>
      <Flex sx={styles.HeaderTextContainer}>
        <FormProvider {...form}>
          <Flex sx={styles.NameContainer}>
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
          <Flex sx={styles.AreaContainer}>
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
                          ? [{ label: "default", value: "Ninguno", _id: "" }]
                          : areas
                      }
                      value={areasOptions[searchQuery.area]}
                    />
                  </FormControl>
                  <FormFieldMessage />
                </FormItem>
              )}
            />
          </Flex>
        </FormProvider>
      </Flex>
      <Text sx={styles.ResultText}>RESULTADOS</Text>
      <Flex sx={styles.TableContainer}>
        <TableContainer w="100%">
          <Table variant="striped">
            <Thead>
              <Tr sx={styles.HideOn850px}>
                {Tabs.map((data, key) => (
                  <Th
                    key={key}
                    textAlign="center"
                    sx={styles.TableText}
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
                    sx={styles.TableText}
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
                persons?.map((data, key) => (
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
              {!isPersonsLoading ? (
                persons?.map((data, key) => (
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
                        <Icon sx={styles.LogoutIcon} viewBox="3 3 17 17">
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
  );
}
