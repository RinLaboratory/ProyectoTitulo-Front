import { regular18 } from "@/styles/fonts";
import { Flex, Icon, Text, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalContent, ModalOverlay, Modal, Box } from "@chakra-ui/react";
import React, { useState } from 'react'
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./AreaList.module";
import CustomInput from "../../CustomInputs/CustomInput";
import Swal from "sweetalert2";
import ShowAreaInfo from "../AreaInfo/ShowAreaInfo";
import { white } from "@/utils/colors";
import { URL } from '@/utils/consts'
import post from '@/utils/post'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export default function AreaList({ isOpen, onClose }) {
    const [data, setData] = useState({
        name: ''
    })

    const { data: areas, isLoading: isProjectLoading, mutate } = useSWR(
        `${URL}/getAreas?name=${data.name}`,
        fetcher,
      )

    const [showPersonInfo, setShowPersonInfo] = useState(false)
    const handleShowPersonInfo = () => setShowPersonInfo(!showPersonInfo)

    const Tabs = ["NOMBRE AREA / CURSO", "", ""]

    const [listMode, setListMode] = useState('add')

    const [document, setDocument] = useState()

    const handleEditButton = (e) => {
        setDocument(e)
        setListMode('edit')
        handleShowPersonInfo()
    }

    const handleDeleteButton = (e) => {
        Swal.fire({
            title: '¿Estás seguro que quieres eliminar esta area / curso?',
            text: `Se eliminará el area / curso "${e.label}"`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Eliminar',
            cancelButtonText: 'Cancelar',
          }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await post(`${URL}/deleteArea`, e)
                if (response.status === 'success') {
                    Swal.fire(
                        '¡Eliminado!',
                        'El area / curso se ha eliminado correctamente.',
                        'success'
                      )
                    const backup = areas.filter(element => element._id !== e._id)
                    mutate(backup,false)
                    onClose()
                } else {
                    Swal.fire(
                        'Error',
                        `${response.msg}`,
                        'error'
                      )
                }
            }
        })
    }

    const handleAddButton = () => {
        setDocument({})
        setListMode('add')
        handleShowPersonInfo()
    }

    const handleInputChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        })
    }

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>ADMINISTRACIÓN AREA / CURSO</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex sx={styles.MainContainer}>
                <Flex w='100%' flexDirection='column' ml='5' mr='5'>
                    <Flex flexDirection='row' mb='30'>
                        <Flex flexDirection='column'>
                            <CustomInput label='NOMBRE DE AREA / CURSO' height='47' name="name" value={data.name} onChange={handleInputChange}/>
                        </Flex>
                        <Button
                        sx={styles.Button}
                        bg='#FF2B91'
                        color={white}
                        leftIcon={
                            <Icon fontSize="24px" mb="1px" ml="1px">
                                <HiOutlineDocumentAdd />
                            </Icon>
                            }
                            onClick={handleAddButton}
                        >
                            AÑADIR
                        </Button>
                    </Flex>
                    <Text sx={regular18}>RESULTADOS</Text>
                    <Flex bgColor="#D9D9D9" p='3' borderRadius='12px'>
                        <TableContainer w="100%">
                            <Table variant='striped' w="100%" h="30vh">
                                <Thead>
                                <Tr>
                                    {Tabs.map((data, key) => (
                                        <Th key={key} textAlign="center" sx={regular18} color="#000000" fontWeight='400'>{data}</Th>
                                    ))}
                                </Tr>
                                </Thead>
                                <Tbody>
                                    {!isProjectLoading ? areas.map((data, key) => (
                                        <Tr key={key} textAlign="center">
                                            <Td textAlign="center" sx={regular18} color="#000000">{data.label}</Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">
                                                <Box onClick={() => handleEditButton(data)}>
                                                    <Icon sx={styles.LogoutIcon} viewBox='3 3 17 17'>
                                                        <IoEyeSharp />
                                                    </Icon>
                                                </Box>
                                            </Td>
                                            <Td textAlign="center" sx={regular18} color="#000000">
                                                <Box onClick={() => handleDeleteButton(data)}>
                                                    <Icon sx={styles.LogoutIcon} viewBox='3 1 21 21'>
                                                        <IoTrash />
                                                    </Icon>
                                                </Box>
                                            </Td>
                                        </Tr>
                                    )) : <></>}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
                </Flex>
            </Flex>
            <ShowAreaInfo
                isOpen={showPersonInfo}
                onClose={handleShowPersonInfo}
                document={document}
                modalMode={listMode}
            />
          </ModalBody>
          <ModalFooter>
            </ModalFooter>
        </ModalContent>
      </Modal>
    )
}