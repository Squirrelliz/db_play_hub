import { useEffect, useState } from "react";
import axios from "axios";
import {
    Table,
    Pagination,
    Container,
    DropdownButton,
    Dropdown,
    ButtonGroup,
    Button,
    Modal,
    Form
} from "react-bootstrap";
import DownloadFile from "./downloadFile";

const Sports = () => {
    const [awards, setAwards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(2);
    const [showModal, setShowModal] = useState(false);
    const [newAwardData, setNewAwardData] = useState({
        name: '',
        description: ''
    });

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/sportsWithLimit/?limit=${limit}&offset=${(page - 1) * limit}`);
            if (response.status === 200) {
                const data = response.data[0];
                const total = response.data[1];
                setAwards(data);
                setTotalPages(Math.ceil(total / limit));
                setLoading(false);
            } else {
                console.error('Ошибка при запросе данных о спорте');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleLimitChange = (selectedLimit) => {
        setLimit(selectedLimit);
        setPage(1);
    };

    const handleDeleteAward = async (awardId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/sports/${awardId}`);
            if (response.status === 200) {
                fetchData(); // Запросить обновленные данные после успешного удаления награды
            } else {
                console.error('Ошибка при удалении спорта');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };


    const handleCreateAward = async () => {
        try {
            const response = await axios.post('http://localhost:8000/sports/', newAwardData);
            if (response.status === 200) {
                setShowModal(false); // Закрыть модальное окно после успешного создания награды
                fetchData(); // Запросить обновленные данные после успешного создания награды
            } else {
                console.error('Ошибка при создании награды');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAwardData({ ...newAwardData, [name]: value });
    };

    return (
        <Container>
            <h1>Все виды спорта</h1>
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <>
                    <DropdownButton as={ButtonGroup} title={"Количество элементов - " + limit} id="dropdown-primary" className="mb-3 m-lg-2">
                        <Dropdown.Item onClick={() => handleLimitChange(2)}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(5)}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(10)}>10</Dropdown.Item>
                    </DropdownButton>
                    <Button variant="primary" onClick={() => setShowModal(true)} className="mb-3 m-lg-2">Добавить спорт</Button>
                    <DownloadFile curUrl={"sports"}/>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Удалить</th>
                        </tr>
                        </thead>
                        <tbody>
                        {awards.map((award, index) => (
                            <tr key={award.id}>
                                <td>{index + 1}</td>
                                <td>{award.name}</td>
                                <td>{award.description}</td>
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteAward(award.id)}>Удалить</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === page} onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>

                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Добавить спорт</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="formName">
                                    <Form.Label>Название</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Введите название"
                                        name="name"
                                        value={newAwardData.name}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formDescription">
                                    <Form.Label>Описание</Form.Label>
                                    <Form.Control
                                        as="textarea"
                                        rows={3}
                                        placeholder="Введите описание"
                                        name="description"
                                        value={newAwardData.description}
                                        onChange={handleInputChange}
                                    />
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Отмена
                            </Button>
                            <Button variant="primary" onClick={handleCreateAward}>
                                Добавить
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>
            )}
        </Container>
    );
};

export default Sports;
