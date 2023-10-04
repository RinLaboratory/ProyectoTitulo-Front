import { regular18 } from "@/styles/fonts";
import { white } from "@/utils/colors";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { IoPersonSharp, IoDocumentTextOutline } from "react-icons/io5";
import { HiDocumentAdd } from "react-icons/hi";
import { styles } from "./ShowPersonInfo.module";
import CustomInput from "../CustomInputs/CustomInput";
import CustomSelect from "../CustomInputs/CustomSelect";
import ShowPersonHistory from "../PersonHistory/ShowPersonHistory";
import { URL } from '@/utils/consts'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import ShowPersonVisit from "../PersonVisit/ShowPersonVisit";


export default function ShowPersonInfo() {
    const router = useRouter()
    const { person } = router.query

    const { data: areas, isLoading: isAreasLoading } = useSWR(
        `${URL}/getAreas?name=${''}`,
        fetcher,
    )

    const [areasOptions, setAreasOptions] = useState({})

    const [areaValue, setAreaValue] = useState('')
    
    const updateAreasOptions = () => {
        const obj = {};

        for (const item of areas) {
        obj[item._id] = item.label;
        }

        console.log(obj)
        setAreasOptions(obj)
        
    }

    const [showPersonHistory, setShowPersonHistory] = useState(false)
    const handleShowPersonHistory = () => setShowPersonHistory(!showPersonHistory)

    const [showPersonVisit, setShowPersonVisit] = useState(false)
    const handleShowPersonVisit = () => setShowPersonVisit(!showPersonVisit)

    const { data: persons, isLoading: isProjectLoading } = useSWR(
        `${URL}/getPersonInfo?person=${person}`,
        fetcher,
      )

    useEffect(()=> {
        if(areas) {
            updateAreasOptions()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isAreasLoading])
    
    // useEffect(()=> {
    //     if(!isProjectLoading) {
    //         setAreaValue()
    //     }
    // // eslint-disable-next-line react-hooks/exhaustive-deps
    // },[areasOptions])

    if (isProjectLoading) {
        return <></>
    }

    return(
        <Flex sx={styles.MainContainer}>
            <Flex w='1254px' flexDirection='column' ml='5' mr='5'>
                <Text sx={regular18}>Información paciente</Text>
                <Flex flexDirection='row' mt='8'>
                    <Flex flexDirection='column' mr='5' alignItems='center' alignContent='center'>
                        <Flex bgColor='#D9D9D9'>
                            <Icon sx={styles.LogoutIcon} viewBox='-1 -1 17 17'>
                                <IoPersonSharp />
                            </Icon>
                        </Flex>
                        <Text sx={regular18} textAlign='center'>{persons.rut}</Text>
                        <Flex flexDirection='column' w='200px'>
                            <Button
                                bg='#FF2B91'
                                color={white}
                                iconSpacing='16px'
                                sx={styles.Button}
                                leftIcon={
                                    <Icon fontSize="24px" mb="1px" ml="1px">
                                    <IoDocumentTextOutline />
                                    </Icon>
                                }
                                mr="1"
                                onClick={handleShowPersonHistory}
                                >
                                VER HISTORIAL
                            </Button>
                            <Button
                                bg='#FF2B91'
                                color={white}
                                iconSpacing='16px'
                                sx={styles.Button}
                                leftIcon={
                                    <Icon fontSize="24px" mb="1px" ml="1px">
                                    <HiDocumentAdd />
                                    </Icon>
                                }
                                mr="1"
                                onClick={handleShowPersonVisit}
                                >
                                AÑADIR VISITA
                            </Button>
                        </Flex>
                    </Flex>
                    <Flex flexDirection='column'>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='417px'>
                                <CustomInput label='NOMBRES' height='47' defaultValue={persons.name}/>
                            </Flex>
                            <Flex flexDirection='column' ml='50' w='417px'>
                                <CustomInput label='APELLIDOS' height='47' defaultValue={persons.lastname}/>
                            </Flex>
                        </Flex>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='417px'>
                                <CustomInput label='TELEFONO CASA' height='47' defaultValue={persons.phone}/>
                            </Flex>
                            <Flex flexDirection='column' ml='50' w='417px'>
                                <CustomInput label='SEGURO MÉDICO' height='47' defaultValue={persons.insurance}/>
                            </Flex>
                        </Flex>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='884px'>
                                <CustomInput label='DIRECCIÓN CASA' height='47' defaultValue={persons.address}/>
                            </Flex>
                        </Flex>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='417px'>
                                <CustomInput label='GRUPO SANGUÍNEO' height='47' defaultValue={persons.bloodType}/>
                            </Flex>
                            <Flex flexDirection='column' ml='50' w='417px'>
                                {!isAreasLoading &&
                                <CustomSelect
                                    label='CURSO / AREA'
                                    name="areaId"
                                    value={areasOptions[persons.areaId]}
                                    options={areas}
                                />}
                            </Flex>
                        </Flex>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='417px'>
                                <CustomInput label='NOMBRE APODERADO' height='47' defaultValue={persons.Rname}/>
                            </Flex>
                            <Flex flexDirection='column' ml='50' w='417px'>
                                <CustomInput label='APELLIDO APODERADO' height='47' defaultValue={persons.Rlastname}/>
                            </Flex>
                        </Flex>
                        <Flex flexDirection='row' mb='30'>
                            <Flex flexDirection='column' w='417px'>
                                <CustomInput label='TELEFONO APODERADO' height='47' defaultValue={persons.Rphone}/>
                            </Flex>
                            <Flex flexDirection='column' ml='50' w='417px'>
                                <CustomInput label='CONTACTO EMERGENCIA' height='47' defaultValue={persons.EmergencyContact}/>
                            </Flex>
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <ShowPersonHistory
                person={persons}
                isOpen={showPersonHistory}
                onClose={handleShowPersonHistory}
            />
            <ShowPersonVisit
                person={persons}
                modalMode='add'
                isOpen={showPersonVisit}
                onClose={handleShowPersonVisit}
            />
        </Flex>
    )
}