import { regular18 } from "@/styles/fonts";
import 
    { 
        Flex,
        Icon,
        Modal,
        ModalOverlay,
        ModalContent,
        ModalHeader,
        ModalCloseButton,
        ModalBody,
        TableContainer,
        Table,
        Thead,
        Tr,
        Th,
        Tbody,
        Td,
        Box
    } from "@chakra-ui/react";
import { IoEyeSharp } from "react-icons/io5";
import React, { useState } from 'react'
import { styles } from "./ShowPersonHistory.module";
import ShowPersonVisit from "../PersonVisit/ShowPersonVisit";
import { URL } from '@/utils/consts'
import { fetcher } from '@/utils/fetcher'
import useSWR from 'swr'

export default function ShowPersonHistory({ isOpen, onClose, person }) {

    const [showPersonVisit, setShowPersonVisit] = useState(false)
    const handleShowPersonVisit = () => setShowPersonVisit(!showPersonVisit)
    const [document, setDocument] = useState('')

    const handleViewClick = (e) => {
        handleShowPersonVisit()
        setDocument(e)
    }

    const { data: documents, isLoading: isProjectLoading, mutate } = useSWR(
        `${URL}/getPersonHistoryInfo?personId=${person._id}`,
        fetcher,
      )

    const Tabs = ["FECHA", "SINTOMAS / LESIONES", "", "ENVIADO A"]

    return(
        <Modal isOpen={isOpen} onClose={onClose} size="4xl" >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>HISTORIAL DE {person?.name.toUpperCase()} {person?.lastname.toUpperCase()}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
          </ModalBody>
            <Flex p='3' m='3' mt='0'>
                <TableContainer w="100%">
                    <Table variant='unstyled' w="100%" h="30vh">
                        <Thead>
                        <Tr>
                            {Tabs.map((data, key) => (
                                <Th key={key} textAlign="center" sx={regular18} fontWeight='400' color="#000000">{data}</Th>
                            ))}
                        </Tr>
                        </Thead>
                        <Tbody>
                            {!isProjectLoading ? documents.map((data, key) => (
                                <Tr key={key} textAlign="center">
                                    <Td textAlign="center" sx={regular18} color="#000000" borderWidth='1px' borderColor='black'>{new Date(data.timestamp).toLocaleDateString('es-CL', { day: 'numeric', month: 'numeric', year: 'numeric', })}</Td>
                                    <Td textAlign="center" sx={regular18} color="#000000" overflow='hidden' textOverflow= 'ellipsis' maxW='370px' borderTopWidth='1px' borderBottomWidth='1px' borderColor='black' >{data.sintomas}</Td>
                                    <Td textAlign="center" sx={regular18} color="#000000" borderTopWidth='1px' borderBottomWidth='1px' borderColor='black'>
                                        <Box onClick={()=> handleViewClick(data)}>
                                            <Icon sx={styles.LogoutIcon} viewBox='3 3 17 17'>
                                                <IoEyeSharp />
                                            </Icon>
                                        </Box>
                                    </Td>
                                    <Td textAlign="center" sx={regular18} color="#000000" borderWidth='1px' borderColor='black' borderRightWidth='0'>{data.enviado}</Td>
                                </Tr>
                            )) : <></>}
                        </Tbody>
                    </Table>
                </TableContainer>
            </Flex>
            <ShowPersonVisit
                person={person}
                document={document}
                isOpen={showPersonVisit}
                onClose={handleShowPersonVisit}
                documents={documents}
                mutate={mutate}
            />
        </ModalContent>
      </Modal>
    )
}