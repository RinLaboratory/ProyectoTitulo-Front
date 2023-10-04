import { regular18 } from "@/styles/fonts";
import { Flex, Icon, Text, Button, Table, TableContainer, Tbody, Td, Th, Thead, Tr, ModalFooter, ModalBody, ModalCloseButton, ModalHeader, ModalContent, ModalOverlay, Modal, Box } from "@chakra-ui/react";
import React, { useEffect, useState } from 'react'
import { IoEyeSharp, IoTrash } from "react-icons/io5";
import { HiOutlineDocumentAdd } from "react-icons/hi";
import { styles } from "./resting.module";
import CustomInput from "../../CustomInputs/CustomInput";
import Swal from "sweetalert2";
import { white } from "@/utils/colors";
import Link from "next/link";

export default function Resting({ isOpen, onClose, mode, data, isLoading = false }) {

    const viewMode = {
        '': {
            header: "",
        },
        reposo: {
            header: "PERSONAS EN REPOSO",
        },
        retirado: {
            header: "PERSONAS RETIRADAS",
        },
        atendido: {
            header: "PERSONAS ATENDIDAS",
        }
    }

    const [displayData, setDisplayData] = useState([{_id: ''}])

    const [areasOptions, setAreasOptions] = useState({})
    
    const updateAreasOptions = () => {
        const obj = {};

        for (const item of data.areas) {
        obj[item._id] = item.label;
        }

        setAreasOptions(obj)
    }

    const Tabs = ["NOMBRE Y APELLIDO", "NOMBRE AREA / CURSO", "RUT", ""]

    useEffect(()=>{
        if(data){
            updateAreasOptions()
            if(mode === 'reposo') {
                setDisplayData(data.reposo)
            }
            if(mode === 'retirado') {
                setDisplayData(data.retirado)
            }
            if(mode === 'atendido') {
                setDisplayData(data.atendido)
            }
        } else {
            setDisplayData([{_id: ''}])
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[isOpen])

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{viewMode[mode].header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex sx={styles.MainContainer}>
                <Flex w='100%' flexDirection='column' ml='5' mr='5'>
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
                                    {!isLoading ? displayData.map((data, key) => (
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
                                    )) : <></>}
                                </Tbody>
                            </Table>
                        </TableContainer>
                    </Flex>
                </Flex>
            </Flex>
          </ModalBody>
          <ModalFooter>
            </ModalFooter>
        </ModalContent>
      </Modal>
    )
}