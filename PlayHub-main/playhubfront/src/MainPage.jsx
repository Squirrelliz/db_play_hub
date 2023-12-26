import {Button, Container, Form, Modal, Tab, Tabs} from "react-bootstrap";
import { useEffect, useState } from "react";
import axios from "axios";
import StadiumList from "./stadiumList";

export default function MainPage() {
    const [sports, setSports] = useState([]);
    const [activeTab, setActiveTab] = useState("profile");

    const [showModal, setShowModal] = useState(false);
    const [newStadium, setNewStadium] = useState({
        name: "",
        address: "",
        coordinates: "",
        sport_type_id: 0
    });

    useEffect(() => {
        const fetchSportData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/sports');
                if (response.status === 200) {
                    setSports(response.data);
                } else {
                    console.error('Ошибка при запросе данных');
                }
            } catch (error) {
                console.error('Ошибка при выполнении запроса:', error);
            }
        };

        fetchSportData();
    }, []);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleCreateGameClick = (sportId) => {
        setShowModal(true);
        setNewStadium({
            ...newStadium,
            sport_type_id: sportId,
        });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStadium({ ...newStadium, [name]: value });
    };

    const handleCreateStadium = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/stadium",
                newStadium
            );
            if (response.status === 200) {
                setNewStadium({
                    name: "",
                    address: "",
                    coordinates: "",
                    sport_type_id: 0
                });
                setShowModal(false);
                alert("Стадион успешно ушел на модерацию! Скоро он появится в списке");
            } else {
                console.error("Ошибка при создании стадиона");
            }
        } catch (error) {
            console.error("Ошибка при создании стадиона:", error);
        }
    };

    return (
        <Container>
            <h1>Виды спорта</h1>
            <Tabs
                id="uncontrolled-tab-example"
                className="mt-4 mb-4"
                activeKey={activeTab}
                onSelect={handleTabChange}
            >
                {sports.length > 0 ? (
                    sports.map((sp, id) => (
                        <Tab key={id} eventKey={sp.name} title={sp.name}>
                            <h3>{sp.description}</h3>
                            <h4>Стадионы</h4>
                            {activeTab === sp.name && <StadiumList sport_id={sp.id} />}
                            <Button
                                className="mt-4"
                                onClick={() => handleCreateGameClick(sp.id)}>
                                Добавить стадион
                            </Button>
                        </Tab>
                    ))
                ) : (
                    <h2>Sports are not added</h2>
                )}
            </Tabs>
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Добавить стадион</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="gameName">
                            <Form.Label>Название стадиона</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название стадиона"
                                name="name"
                                value={newStadium.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameAddress">
                            <Form.Label>Адрес</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите адрес стадиона"
                                name="address"
                                value={newStadium.address}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameCoordinates">
                            <Form.Label>Координаты</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите координаты стадиона (при наличии)"
                                name="coordinates"
                                value={newStadium.coordinates}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleCreateStadium}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}
