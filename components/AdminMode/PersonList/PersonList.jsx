import { regular12, regular18 } from "@/styles/fonts";
import { Flex, Icon, Text, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalContent, ModalOverlay, Modal, Box, list } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react'
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./PersonList.module";
import CustomInput from "../../CustomInputs/CustomInput";
import CustomSelect from "../../CustomInputs/CustomSelect";
import ShowPersonInfo from "../PersonInfo/ShowPersonInfo";
import Swal from "sweetalert2";
import { URL } from '@/utils/consts'
import post from '@/utils/post'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'
import ImportPerson from "../ImportPerson/ImportPerson";
import { white } from "@/utils/colors";

export default function PersonList({ isOpen, onClose, listMode }) {

    const viewMode = {
        '': {
            header: "",
        },
        delete: {
            header: "ELIMINAR",
        },
        edit: {
            header: "EDITAR",
        }
    }

    const { data: areas, isLoading: isAreaLoading } = useSWR(
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

    const [showPersonInfo, setShowPersonInfo] = useState(false)
    const handleShowPersonInfo = () => setShowPersonInfo(!showPersonInfo)

    const[data, setData] = useState({
        name: '',
        area: 'default',
    })

    const { data: persons, isLoading: isProjectLoading, mutate } = useSWR(
        `${URL}/getPersons?name=${data.name}&area=${data.area}`,
        fetcher,
      )

    const Tabs = ["NOMBRES", "APELLIDO", "RUT", ""]
    const TabsOn850 = ["NOMBRES", "RUT"]

    const [document, setDocument] = useState()

    const handleEditButton = (e) => {
        setDocument(e)
        handleShowPersonInfo()
    }

    const [listModeImport, setListModeImport] = useState('add')

    const [showImportPerson, setShowImportPerson] = useState(false)
    const handleShowImportPerson = () => setShowImportPerson(!showImportPerson)

    const handleImportButton = () => {
        setListModeImport('edit')
        handleShowImportPerson()
    }

    const handleDeleteButton = (e) => {
        Swal.fire({
            title: '¿Estás seguro que quieres hacer esto?',
            text: "Esta acción no se puede revertir",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
          }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await post(`${URL}/deletePersons`, e)
                if (response.status === 'success') {
                    Swal.fire(
                        '¡Eliminado!',
                        'La persona ha sido eliminada correctamente.',
                        'success'
                      )
                    const backup = persons.filter(element => element._id !== e._id)
                    mutate(backup,false)
                    onClose()
                } else {
                    Swal.fire(
                        'Error',
                        `No puedes eliminar a esta persona. ${response.msg}`,
                        'error'
                      )
                }
            }
        })
    }

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value
        })
    }

    useEffect(() => {
        if(!isOpen) {
            setData({
                name: '',
                area: 'default',
            })
        }
    },[isOpen])

    useEffect(()=> {
        if(!isAreaLoading) {
            updateAreasOptions()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[areas])

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{viewMode[listMode].header} PERSONA</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex sx={styles.MainContainer}>
                <Flex w='100%' flexDirection='column' ml='5' mr='5'>
                    <Flex flexDirection='row' mb='30'>
                        <Flex flexDirection='column'>
                            <CustomInput label='NOMBRE / APELLIDO' height='47' value={data.name} name="name" onChange={handleInputChange}/>
                        </Flex>
                        <Flex flexDirection='column' ml='50'>
                            {!isAreaLoading &&
                            <CustomSelect
                            label='CURSO / AREA'
                            name="area"
                            value={areasOptions[data.area]}
                            options={areas}
                            onChange={(value, name) =>
                            handleInputChange({
                            target: {
                                name: name,
                                value: value,
                            },
                            })
                            }
                        />}
                            
                        </Flex>
                        {listMode === "edit" &&
                        <Button
                        sx={styles.Button}
                        bg='#FF2B91'
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
                        }
                    </Flex>
                    <Text sx={regular18}>RESULTADOS</Text>
                    <Flex bgColor="#D9D9D9" p='3' borderRadius='12px'>
                        <TableContainer w="100%">
                            <Table variant='striped' w="100%">
                                <Thead>
                                <Tr sx={styles.HideOn850px}>
                                    {Tabs.map((data, key) => (
                                        <Th key={key} textAlign="center" sx={regular18} color="#000000" fontWeight='400'>{data}</Th>
                                    ))}
                                </Tr>
                                <Tr sx={styles.ShowOn850px}>
                                    {TabsOn850.map((data, key) => (
                                        <Th key={key} textAlign="center" sx={regular18} color="#000000" fontWeight='400'>{data}</Th>
                                    ))}
                                </Tr>
                                </Thead>
                                <Tbody sx={styles.ShowOn850px}>
                                    {!isProjectLoading ? (persons && persons.map((data, key) => (
                                        <Tr key={key} textAlign="center">
                                            <Td textAlign="center" sx={styles.TableTextURL} color="#000000">
                                                {listMode === 'edit' && 
                                                <Box onClick={() => handleEditButton(data)}>
                                                    {data.name} {data.lastname}
                                                </Box>
                                                }
                                                {listMode === 'delete' && 
                                                <Box onClick={() => handleDeleteButton(data)}>
                                                    {data.name} {data.lastname}
                                                </Box>
                                                }
                                            </Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.rut}</Td>
                                        </Tr>
                                    ))) : <></>}
                                </Tbody>
                                <Tbody sx={styles.HideOn850px}>
                                    {!isProjectLoading ? (persons && persons.map((data, key) => (
                                        <Tr key={key} textAlign="center">
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.name}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.lastname}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.rut}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">
                                                {listMode === 'edit' && 
                                                <Box onClick={() => handleEditButton(data)}>
                                                    <Icon sx={styles.LogoutIcon} viewBox='3 3 17 17'>
                                                        <IoEyeSharp />
                                                    </Icon>
                                                </Box>
                                                }
                                                {listMode === 'delete' && 
                                                <Box onClick={() => handleDeleteButton(data)}>
                                                    <Icon sx={styles.LogoutIcon} viewBox='3 1 21 21'>
                                                        <IoTrash />
                                                    </Icon>
                                                </Box>
                                                }
                                            </Td>
                                        </Tr>
                                    ))) : <></>}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
                </Flex>
            </Flex>
            <ShowPersonInfo
                isOpen={showPersonInfo}
                onClose={handleShowPersonInfo}
                document={document}
                modalMode={'edit'}
                persons={persons}
                mutate={mutate}
            />
            <ImportPerson
                isOpen={showImportPerson}
                onClose={handleShowImportPerson}
                listMode={listModeImport}
                mutate={mutate}
            />
          </ModalBody>
        <ModalFooter>
        </ModalFooter>
        </ModalContent>
      </Modal>
    )
}