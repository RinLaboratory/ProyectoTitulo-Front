import { regular18 } from "@/styles/fonts";
import { Flex, Icon, Text, Button } from "@chakra-ui/react";

import React, { useState } from 'react'
import { IoSearch } from "react-icons/io5";
import { styles } from "./AdminMode.module";
import { white } from "@/utils/colors";
import ShowPersonInfo from "./PersonInfo/ShowPersonInfo";
import PersonList from "./PersonList/PersonList";
import ShowUserInfo from "./UserInfo/ShowUserInfo";
import UserList from "./UserList/UserList";
import Swal from "sweetalert2";
import AreaList from "./AreaList/AreaList";
import { URL } from '@/utils/consts'
import post from '@/utils/post'

export default function AdminMode() {

    const [showPersonInfo, setShowPersonInfo] = useState(false)
    const handleShowPersonInfo = () => setShowPersonInfo(!showPersonInfo)

    const [showPersonList, setShowPersonList] = useState(false)
    const handleShowPersonList = () => setShowPersonList(!showPersonList)

    const [showUserInfo, setShowUserInfo] = useState(false)
    const handleShowUserInfo = () => setShowUserInfo(!showUserInfo)

    const [showUserList, setShowUserList] = useState(false)
    const handleShowUserList = () => setShowUserList(!showUserList)

    const [showAreaList, setShowAreaList] = useState(false)
    const handleShowAreaList = () => setShowAreaList(!showAreaList)

    const [listMode, setListMode] = useState('')
    const [userListMode, setUserListMode] = useState('')

    const handleDeletePerson = () => {
        setListMode('delete')
        handleShowPersonList()
    }

    const handleEditPerson = () => {
        setListMode('edit')
        handleShowPersonList()
    }

    const handleDeleteUser = () => {
        setUserListMode('delete')
        handleShowUserList()
    }

    const handleEditUser = () => {
        setUserListMode('edit')
        handleShowUserList()
    }

    const handleNewYearButton = (oid) => {
        Swal.fire({
            title: 'ESTÁS A PUNTO DE INICIAR UN NUEVO AÑO',
            text: "TODOS LOS ESTUDIANTES PASARÁN AL SIGUIENTE AÑO EN LA ESCALA DE ENSEÑANZA (Los de IV° pasarán a ser ex-alumnos)",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'INICIAR NUEVO AÑO',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: '¿ESTAS ABSOLUTAMENTE SEGURO?',
                    text: "ESTA ACCIÓN NO SE PUEDE REVERTIR.",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'SE LO QUE HAGO Y QUIERO HACERLO',
                    cancelButtonText: 'Cancelar',
                  }).then(async (result) => {
                    if (result.isConfirmed) {
                        const response = await post(`${URL}/initNewYear`)
                        if (response.status === "success") {
                            Swal.fire(
                                '¡Se ha iniciado un nuevo año en el sistema!',
                                'Los estudiantes se han movido al siguiente año en la escala de enseñanza exitosamente.',
                                'success'
                            )
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
        })
    }

    const buttonSelector = [
        {
            id: 0,
            text: 'Administración Usuarios',
            button1: 'AÑADIR USUARIO',
            button1action: handleShowUserInfo,
            button2: 'EDITAR USUARIO',
            button2action: handleEditUser,
            button3: 'ELIMINAR USUARIO',
            button3action: handleDeleteUser,
        },
        {
            id: 1,
            text: 'Administración de Personas de la insitución',
            button1: 'AÑADIR PERSONA',
            button1action: handleShowPersonInfo,
            button2: 'EDITAR PERSONA',
            button2action: handleEditPerson,
            button3: 'ELIMINAR PERSONA',
            button3action: handleDeletePerson,
        },
        {
            id: 2,
            text: 'Administración Anual',
            button1: 'INICIO DE AÑO NUEVO',
            button1action: handleNewYearButton,
            button2: 'ADMINISTRACION\nAREA / CURSO',
            button2action: handleShowAreaList,
            button3: '',
            button3action: '',
        }
    ]

    return(
        <Flex sx={styles.MainContainer}>
            {buttonSelector.map((data, key) => (
                <Flex key={key} sx={styles.OptionContainer}>
                    <Flex sx={styles.LeftOptionContainer}>
                        <Text sx={regular18}>{data.text}</Text>
                        <Flex justifyContent='space-around'>
                            <Button
                            sx={styles.Button}
                            bg='#FF2B91'
                            color={white}
                            leftIcon={
                                <Icon fontSize="24px" mb="1px" ml="1px">
                                    <IoSearch />
                                </Icon>
                                }
                            onClick={data.button1action}
                            >
                            {data.button1}
                            </Button>
                            <Button
                            sx={styles.Button}
                            bg='#FF2B91'
                            color={white}
                            leftIcon={
                                <Icon fontSize="24px" mb="1px" ml="1px">
                                    <IoSearch />
                                </Icon>
                                }
                            onClick={data.button2action}
                            >
                            {data.button2}
                            </Button>
                            {data.button3 !== '' && 
                                <Button
                                sx={styles.Button}
                                bg='#FF2B91'
                                color={white}
                                leftIcon={
                                    <Icon fontSize="24px" mb="1px" ml="1px">
                                        <IoSearch />
                                    </Icon>
                                    }
                                onClick={data.button3action}
                                >
                                {data.button3}
                                </Button>
                            }
                        </Flex>
                    </Flex>
                </Flex>
            ))}
            <ShowPersonInfo
                isOpen={showPersonInfo}
                onClose={handleShowPersonInfo}
            />
            <PersonList
                isOpen={showPersonList}
                onClose={handleShowPersonList}
                listMode={listMode}
            />
            <ShowUserInfo
                isOpen={showUserInfo}
                onClose={handleShowUserInfo}
            />
            <UserList
                isOpen={showUserList}
                onClose={handleShowUserList}
                userListMode={userListMode}
            />
            <AreaList
                isOpen={showAreaList}
                onClose={handleShowAreaList}
            />
        </Flex>
    )
}