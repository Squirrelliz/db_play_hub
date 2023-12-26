import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import {Button, Container, Form, Modal, Table, ListGroup, Accordion} from "react-bootstrap";

export default function Profile() {
    const [userData, setUserData] = useState(JSON.parse(Cookies.get('userData')));
    const [userDataLoaded, setUserDataLoaded] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [newName, setNewName] = useState(userData.name);
    const [newEmail, setNewEmail] = useState(userData.email);
    const [teamMembers, setTeamMembers] = useState([]);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const [teams, setTeams] = useState([]);
    const [showChangeTeamModal, setShowChangeTeamModal] = useState(false);

    const fetchPlayerData = async () => {
        try {
            const storedUserData = JSON.parse(Cookies.get('userData'));
            const playerId = storedUserData ? storedUserData.id : null;

            if (playerId) {
                const response = await axios.get(`http://localhost:8000/players/${playerId}`);
                if (response.status === 200) {
                    const playerData = response.data;
                    setUserData(playerData);
                    Cookies.set('userData', JSON.stringify(playerData), {expires: 1});
                    setUserDataLoaded(true);

                    if (playerData.team_id) {
                        const teamResponse = await axios.get(`http://localhost:8000/team/${playerData.team_id}`);
                        if (teamResponse.status === 200) {
                            setTeamMembers(teamResponse.data);
                        }
                    }
                } else {
                    console.error('Ошибка при запросе данных пользователя');
                }
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    useEffect(() => {
        fetchPlayerData();
    }, []);

    const handleEditProfile = () => {
        setNewName(userData.name);
        setNewEmail(userData.email);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleEditSubmit = async () => {
        try {
            const playerId = userData.id;
            const updatedData = {
                name: newName,
                email: newEmail
            };
            const response = await axios.put(`http://localhost:8000/players/${playerId}`, updatedData);
            if (response.status === 200) {
                setShowEditModal(false);
                fetchPlayerData();
            } else {
                console.error('Ошибка при обновлении профиля');
            }
        } catch (error) {
            console.error('Ошибка при обновлении профиля:', error);
        }
    };

    const handleDeleteProfile = async () => {
        try {
            const playerId = userData.id;
            const response = await axios.delete(`http://localhost:8000/players/${playerId}`);
            if (response.status === 200) {
                Cookies.remove('userData');
                setUserData({});
                window.location.href = "/";
            } else {
                console.error('Ошибка при удалении профиля');
            }
        } catch (error) {
            console.error('Ошибка при удалении профиля:', error);
        }
    };

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    };

    const handleJoinTeam = async (teamId) => {
        try {
            const playerId = userData.id;
            const response = await axios.post(`http://localhost:8000/players/${playerId}/set_team/${teamId}`);
            if (response.status === 200) {
                window.location.reload(); // Обновить страницу после успешной операции
            } else {
                console.error('Ошибка при присоединении к команде');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const toggleAccordion = () => {
        setIsAccordionOpen(!isAccordionOpen);
    };

    const fetchTeams = async () => {
        try {
            const response = await axios.get('http://localhost:8000/team');
            if (response.status === 200) {
                setTeams(response.data);
            } else {
                console.error('Ошибка при получении списка команд');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleShowChangeTeamModal = () => {
        setShowChangeTeamModal(true);
    };

    const handleCloseChangeTeamModal = () => {
        setShowChangeTeamModal(false);
    };


    const [newTeamName, setNewTeamName] = useState('');
    const [showTeamModal, setShowTeamModal] = useState(false);

    const handleShowTeamModal = () => {
        setShowTeamModal(true);
    };

    const handleCloseTeamModal = () => {
        setShowTeamModal(false);
    };

    const handleUpdateTeamName = async (teamId) => {
        try {
            const updatedData = {
                name: newTeamName
            };
            const response = await axios.put(`http://localhost:8000/team/${teamId}`, updatedData);
            if (response.status === 200) {
                window.location.reload(); // Обновить страницу после успешного обновления
            } else {
                console.error('Ошибка при обновлении имени команды');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleDeleteTeam = async () => {
        try {
            const response = await axios.delete(`http://localhost:8000/team/${userData.team_id}`);
            if (response.status === 200) {
                window.location.reload(); // Перезагрузка страницы после успешного удаления команды
            } else {
                console.error('Ошибка при удалении команды');
            }
        } catch (error) {
            console.error('Ошибка при удалении команды:', error);
        }
    };

    const handleCreateTeam = async () => {
        try {
            const teamName = prompt('Введите название команды:');
            if (teamName) {
                const response = await axios.post('http://localhost:8000/team', { name: teamName });
                if (response.status === 200) {
                    const newTeamId = response.data.id; // Получаем ID новой команды из ответа сервера
                    const playerId = userData.id;

                    // Присоединяем игрока к новой команде
                    const joinTeamResponse = await axios.post(`http://localhost:8000/players/${playerId}/set_team/${newTeamId}`);
                    if (joinTeamResponse.status === 200) {
                        window.location.reload(); // Перезагружаем страницу после успешного присоединения
                    } else {
                        console.error('Ошибка при присоединении к команде');
                    }
                } else {
                    console.error('Ошибка при создании команды');
                }
            }
        } catch (error) {
            console.error('Ошибка при создании команды:', error);
        }
    };

    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');

    const handleUpdatePassword = async () => {
        try {
            const playerId = userData.id;
            const updateData = {
                password: password
            };
            const response = await axios.put(`http://localhost:8000/set_role/${playerId}`, updateData);
            if (response.status === 200) {

            } else {

                console.error('Ошибка при обновлении пароля');
            }
            window.location.reload();
        } catch (error) {
            console.error('Ошибка при обновлении пароля:', error);
            window.location.reload();
        }
    };

// Функции для открытия и закрытия модального окна
    const handleShowPasswordModal = () => {
        setShowPasswordModal(true);
    };

    const handleClosePasswordModal = () => {
        setShowPasswordModal(false);
    };

    return (
        <>
            {userDataLoaded ? (
                <Container>
                    <h1>Профиль</h1>
                    <div>
                        <h3><b>Имя</b>: {userData.name}</h3>
                        <h3><b>Email</b>: {userData.email}</h3>
                        <h3><b>Опыт</b>: {userData.experience}</h3>
                        <h3><b>Команда</b>: {userData.team_id ? userData.team.name : "Нет команды"}</h3>
                        {userData.team_id ? (
                            <>
                                <Accordion className="mb-2">
                                    <Accordion.Item eventKey="0">
                                        <Accordion.Header onClick={toggleAccordion}>
                                            {isAccordionOpen ? 'Скрыть участников команды' : 'Показать участников команды'}
                                        </Accordion.Header>
                                        <Accordion.Body>
                                            <ul>
                                                {teamMembers.map((member, index) => (
                                                    <li key={index}>{member.name}</li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Accordion>
                                <Button onClick={handleShowTeamModal} className="mt-2 m-lg-1" variant="success">Изменить название</Button>
                                <Button onClick={handleShowChangeTeamModal} className="mt-2 m-lg-1">Поменять команду</Button>
                                <Button onClick={() => handleJoinTeam(0)} className="mt-2 m-lg-1" variant="danger">Покинуть</Button>
                                {userData.role === "moderator"
                                    ? <Button onClick={handleDeleteTeam} variant="danger" className="mt-2 m-lg-1">Удалить команду</Button>
                                : ""}
                            </>
                        ) : (
                            <>
                                <Button onClick={handleShowChangeTeamModal} className="mt-2 m-lg-1">Присоединиться к команде</Button>
                                <Button onClick={handleCreateTeam} className="mt-2 m-lg-1" variant="success">Создать команду</Button>
                            </>
                        )}
                        <h3><b>Мои награды</b></h3>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>#</th>
                                <th>Название</th>
                                <th>Описание</th>
                                <th>Дата получения</th>
                            </tr>
                            </thead>
                            <tbody>
                            {userData.awards.map((award, id) => (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{award.award.name}</td>
                                    <td>{award.award.description}</td>
                                    <td>{formatDateTime(award.date_created)}</td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                    </div>
                    <Button onClick={handleEditProfile} variant="success" className="mt-2 m-lg-1">Редактировать профиль</Button>
                    <Button onClick={handleDeleteProfile} variant="danger" className="mt-2 m-lg-1">Удалить профиль</Button>
                    {userData.role !== "moderator"
                    ? <Button onClick={handleShowPasswordModal} variant="outline-danger" className="mt-2 m-lg-1">Стать модератором</Button>
                    : ""}
                </Container>
            ) : (
                <Container>
                    <h1>Loading...</h1>
                </Container>
            )}
            <Modal show={showEditModal} onHide={handleCloseEditModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать профиль</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Новое имя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите новое имя"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                            />
                        </Form.Group>
                        <Form.Group controlId="formEmail">
                            <Form.Label>Новый email</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Введите новый email"
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseEditModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleEditSubmit}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Модальное окно для изменения команды */}
            <Modal show={showChangeTeamModal} onHide={handleCloseChangeTeamModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Выберите новую команду</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Название</th>
                            <th>Количество участников</th>
                            <th>Присоединиться</th>
                        </tr>
                        </thead>
                        <tbody>
                        {teams.map((team, index) => {
                            if (team.id !== userData.team_id) {
                                return (
                                    <tr key={index}>
                                        <td>{team.name}</td>
                                        <td>{team.count_participant}</td>
                                        <td>
                                            <Button onClick={() => handleJoinTeam(team.id)}>Присоединиться</Button>
                                        </td>
                                    </tr>
                                )
                            }
                        })}
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal>

            <Modal show={showTeamModal} onHide={handleCloseTeamModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Изменить имя команды</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formTeamName">
                            <Form.Label>Новое имя команды</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите новое имя команды"
                                value={newTeamName}
                                onChange={(e) => setNewTeamName(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseTeamModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={() => handleUpdateTeamName(userData.team_id)}>
                        Обновить имя команды
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showPasswordModal} onHide={handleClosePasswordModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Введите пароль модератора</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formPassword">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                placeholder="Введите пароль модератора"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClosePasswordModal}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleUpdatePassword}>
                        Стать модератором
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}