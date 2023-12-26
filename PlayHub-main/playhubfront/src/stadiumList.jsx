import { Accordion, Button, Modal, Form } from "react-bootstrap";
import { useState, useEffect } from "react";
import axios from "axios";
import GameList from "./GameList";

export default function StadiumList({ sport_id }) {
    const [stadium, setStadium] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newGame, setNewGame] = useState({
        name: "",
        difficulty: "",
        start_time: "",
        end_time: "",
        stadium_id: 0,
    });

    const fetchSportData = async () => {
        try {
            const response = await axios.get(
                `http://localhost:8000/stadium_from_sport/${sport_id}`
            );
            if (response.status === 200) {
                const approvedStadiums = response.data.filter(
                    (sp) => sp.approved === true
                );
                setStadium(approvedStadiums);
            } else {
                console.error("Ошибка при запросе данных");
            }
        } catch (error) {
            console.error("Ошибка при выполнении запроса:", error);
        }
    };

    useEffect(() => {
        fetchSportData();
    }, [sport_id]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewGame({ ...newGame, [name]: value });
    };

    const handleCreateGame = async () => {
        try {
            const response = await axios.post(
                "http://localhost:8000/game",
                newGame
            );
            if (response.status === 200) {
                setNewGame({
                    name: "",
                    difficulty: "",
                    start_time: "",
                    end_time: "",
                    stadium_id: newGame.stadium_id,
                });
                setShowModal(false);
                window.location.reload();
            } else {
                console.error("Ошибка при создании игры");
            }
        } catch (error) {
            console.error("Ошибка при создании игры:", error);
            alert("На это время уже есть игра. Присоединяйтесь!")
        }
    };

    const handleCreateGameClick = (stadiumId) => {
        setShowModal(true);
        setNewGame({
            ...newGame,
            stadium_id: stadiumId,
        });
    };

    return (
        <>
            <Accordion alwaysOpen>
                {stadium.length > 0 ? (
                    stadium.map((sp, id) => (
                        <Accordion.Item eventKey={id + ""} key={id}>
                            <Accordion.Header>
                                <h4 className="me-auto">{sp.name}</h4>
                                {sp.address}
                            </Accordion.Header>
                            <Accordion.Body>
                                <h4>Игры</h4>
                                <GameList stadium_id={sp.id} />
                                <Button onClick={() => handleCreateGameClick(sp.id)}>
                                    Создать игру
                                </Button>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))
                ) : (
                    <h2>Стадионы не добавлены</h2>
                )}
            </Accordion>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Создать игру</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3" controlId="gameName">
                            <Form.Label>Название игры</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите название игры"
                                name="name"
                                value={newGame.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameDifficulty">
                            <Form.Label>Сложность</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите сложность игры"
                                name="difficulty"
                                value={newGame.difficulty}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameStartTime">
                            <Form.Label>Дата начала</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="start_time"
                                value={newGame.start_time}
                                onChange={handleInputChange}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="gameEndTime">
                            <Form.Label>Дата окончания</Form.Label>
                            <Form.Control
                                type="datetime-local"
                                name="end_time"
                                value={newGame.end_time}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleCreateGame}>
                        Создать
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}
