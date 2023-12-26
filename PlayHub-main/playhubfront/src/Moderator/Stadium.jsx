import {useEffect, useState} from "react";
import axios from "axios";
import {
    Table,
    Button,
    Dropdown,
    Modal,
    Form,
    Container, DropdownButton, ButtonGroup, Pagination
} from "react-bootstrap";
import DownloadFile from "./downloadFile";

const Stadiums = () => {
    const [stadiums, setStadiums] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(2);
    const [showModal, setShowModal] = useState(false);
    const [selectedStadium, setSelectedStadium] = useState({
        name: '',
        address: '',
        coordinates: ''
    });

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/stadium/?limit=${limit}&offset=${(page - 1) * limit}`);
            if (response.status === 200) {
                const data = response.data[0];
                const total = response.data[1];
                setStadiums(data);
                setTotalPages(Math.ceil(total / limit));
                setLoading(false);
            } else {
                console.error('Ошибка при запросе данных о стадионах');
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

    const handleUpdateStadium = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/stadium/${selectedStadium.id}`, selectedStadium);
            if (response.status === 200) {
                setShowModal(false);
                fetchData();
            } else {
                console.error('Ошибка при обновлении стадиона');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleDeleteStadium = async (stadiumId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/stadium/${stadiumId}`);
            if (response.status === 200) {
                fetchData();
            } else {
                console.error('Ошибка при удалении стадиона');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleApproval = async (stadiumId, isApproved) => {
        try {
            const response = await axios.put(`http://localhost:8000/stadium/${stadiumId}/approved`, {}, {
                params: {
                    approve: isApproved
                }
            });
            if (response.status === 200) {
                fetchData();
            } else {
                console.error('Ошибка при подтверждении стадиона');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleShowModal = (stadium) => {
        setSelectedStadium(stadium);
        setShowModal(true);
    };

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setSelectedStadium({...selectedStadium, [name]: value});
    };

    return (
        <Container>
            <h1>Все стадионы</h1>
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <>
                    <DropdownButton as={ButtonGroup} title={"Количество элементов - " + limit} id="dropdown-primary"
                                    className="mb-3 m-lg-2">
                        <Dropdown.Item onClick={() => handleLimitChange(2)}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(5)}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(10)}>10</Dropdown.Item>
                    </DropdownButton>
                    <DownloadFile curUrl={"stadium"}/>
                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>Имя</th>
                            <th>Адресс</th>
                            <th>Координаты</th>
                            <th>Редактировать</th>
                            <th>Подтвердить</th>
                            <th>Удалить</th>
                        </tr>
                        </thead>
                        <tbody>
                        {stadiums.map((stadium) => (
                            <tr key={stadium.id}>
                                <td>{stadium.name}</td>
                                <td>{stadium.address}</td>
                                <td>{stadium.coordinates}</td>
                                <td>
                                    <Button variant="primary"
                                            onClick={() => handleShowModal(stadium)}>Редактировать</Button>
                                </td>
                                <td>
                                    {stadium.approved ? (
                                        <Button variant="success" disabled>Подтверждено</Button>
                                    ) : (
                                        <Button variant="danger"
                                                onClick={() => handleApproval(stadium.id, true)}>Подтвердить</Button>
                                    )}
                                </td>
                                <td>
                                    <Button variant="danger"
                                            onClick={() => handleDeleteStadium(stadium.id)}>Удалить</Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </Table>
                    <Pagination>
                        {Array.from({length: totalPages}, (_, index) => (
                            <Pagination.Item key={index + 1} active={index + 1 === page}
                                             onClick={() => handlePageChange(index + 1)}>
                                {index + 1}
                            </Pagination.Item>
                        ))}
                    </Pagination>
                </>
            )}

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Редактировать стадион</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group controlId="formName">
                            <Form.Label>Имя</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите имя"
                                name="name"
                                value={selectedStadium.name}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formAddress">
                            <Form.Label>Адресс</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите адресс"
                                name="address"
                                value={selectedStadium.address}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                        <Form.Group controlId="formCoordinates">
                            <Form.Label>Координаты</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Введите координаты"
                                name="coordinates"
                                value={selectedStadium.coordinates}
                                onChange={handleInputChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="primary" onClick={handleUpdateStadium}>
                        Сохранить изменения
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default Stadiums;
