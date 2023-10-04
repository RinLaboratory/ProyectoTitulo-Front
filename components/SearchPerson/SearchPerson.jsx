import { regular12, regular18 } from "@/styles/fonts";
import { Flex, Icon, Text, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { IoEyeSharp } from "react-icons/io5";
import { styles } from "./SearchPerson.module";
import CustomInput from "../CustomInputs/CustomInput";
import CustomSelect from "../CustomInputs/CustomSelect";
import { URL } from '@/utils/consts'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export default function SearchPerson() {
    const[data, setData] = useState({
        name: '',
        area: 'default',
    })
    const { data: persons, isLoading: isProjectLoading } = useSWR(
        `${URL}/getPersons?name=${data.name}&area=${data.area}`,
        fetcher,
      )

    const { data: areas, isLoading: isAreasLoading } = useSWR(
        `${URL}/getAreas?name=${''}`,
        fetcher,
    )

    const [areasOptions, setAreasOptions] = useState({})
    
    const updateAreasOptions = () => {
        const obj = {};

        for (const item of areas) {
        obj[item._id] = item.label;
        }

        setAreasOptions(obj)
    }

    const Tabs = ["NOMBRE Y APELLIDO", "CURSO / AREA", "RUT", ""]

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    useEffect(()=> {
        if(!isAreasLoading){
            updateAreasOptions()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[areas])

    return(
        <Flex sx={styles.MainContainer}>
            <Flex w='1254px' flexDirection='column' ml='5' mr='5'>
                <Text sx={regular18}>Buscar paciente</Text>
                <Flex flexDirection='row' mb='30'>
                    <Flex flexDirection='column'>
                        <CustomInput label='NOMBRE / APELLIDO' height='47' name="name" value={data.name} onChange={handleInputChange}/>
                    </Flex>
                    <Flex flexDirection='column' ml='50'>
                        <CustomSelect
                        label='CURSO / AREA'
                        name="area"
                        value={areasOptions[data.area]}
                        options={isAreasLoading ? ([{label: 'default', value: 'Ninguno', _id: ''}]) : (areas)}
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
                <Text sx={regular12}>RESULTADOS</Text>
                    <Flex bgColor="#D9D9D9" p='3' borderRadius='12px'>
                        <TableContainer w="100%">
                            <Table variant='striped' w="100%">
                                <Thead>
                                <Tr>
                                    {Tabs.map((data, key) => (
                                        <Th key={key} textAlign="center" sx={regular18} color="#000000" fontWeight='400'>{data}</Th>
                                    ))}
                                </Tr>
                                </Thead>
                                <Tbody>
                                    {!isProjectLoading ? (persons && persons.map((data, key) => (
                                        <Tr key={key} textAlign="center">
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.name} {data.lastname}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">{areasOptions[data.areaId]}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.rut}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">
                                                <Link href={{
                                                        pathname: "/personInfo",
                                                        query: {
                                                            person: data._id,
                                                        },
                                                    }} 
                                                    passHref>
                                                    <Icon sx={styles.LogoutIcon} viewBox='3 3 17 17'>
                                                        <IoEyeSharp />
                                                    </Icon>
                                                </Link>
                                            </Td>
                                        </Tr>
                                    ))) : <></>}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
            </Flex>
        </Flex>
    )
}