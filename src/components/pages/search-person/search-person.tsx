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
import type { ChangeEvent } from "react";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { styles } from "./search-person.module";
import { URL } from "~/utils/consts";
import { fetcher } from "~/utils/fetcher";
import useSWR from "swr";
import type { TArea, TPerson } from "~/utils/validators";
import CustomSelect from "~/components/ui/select/select";
import CustomInput from "~/components/ui/input/input";

export default function SearchPerson() {
  const [data, setData] = useState({
    name: "",
    area: "default",
  });
  const { data: persons, isLoading: isProjectLoading } = useSWR<TPerson[]>(
    `${URL}/getPersons?name=${data.name}&area=${data.area}`,
    fetcher
  );

  const { data: areas, isLoading: isAreasLoading } = useSWR<TArea[]>(
    `${URL}/getAreas?name=${""}`,
    fetcher
  );

  const [areasOptions, setAreasOptions] = useState<Record<string, string>>({});

  const updateAreasOptions = () => {
    if (areas) {
      const obj: Record<string, string> = {};

      for (const item of areas) {
        obj[item._id] = item.label;
      }

      setAreasOptions(obj);
    }
  };

  const Tabs = ["NOMBRE Y APELLIDO", "CURSO / AREA", "RUT", ""];

  const Tabs850px = ["NOMBRES", "CURSO"];

  const handleInputChange = (
    e:
      | ChangeEvent<HTMLInputElement>
      | { target: { value: string; name: string } }
  ) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    if (!isAreasLoading) {
      updateAreasOptions();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas]);

  return (
    <Flex sx={styles.MainContainer}>
      <Text sx={styles.HeaderText}>Buscar paciente</Text>
      <Flex sx={styles.HeaderTextContainer}>
        <Flex sx={styles.NameContainer}>
          <CustomInput
            label="NOMBRE / APELLIDO"
            height="47"
            name="name"
            value={data.name}
            onChange={handleInputChange}
          />
        </Flex>
        <Flex sx={styles.AreaContainer}>
          <CustomSelect
            label="CURSO / AREA"
            name="area"
            value={areasOptions[data.area]}
            options={
              isAreasLoading
                ? [{ label: "default", value: "Ninguno", _id: "" }]
                : areas
            }
            onChange={(value, name) =>
              handleInputChange({
                target: {
                  name: name,
                  value: value,
                },
              })
            }
          />
        </Flex>
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
              {!isProjectLoading ? (
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
              {!isProjectLoading ? (
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
