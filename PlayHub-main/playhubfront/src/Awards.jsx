import { useEffect, useState } from "react";
import axios from "axios";
import { Table, Pagination, Container, DropdownButton, Dropdown, ButtonGroup } from "react-bootstrap";

const Awards = () => {
    const [awards, setAwards] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(2);

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/awards/?limit=${limit}&offset=${(page - 1) * limit}`);
            if (response.status === 200) {
                const data = response.data[0];
                const total = response.data[1];
                setAwards(data);
                setTotalPages(Math.ceil(total / limit));
                setLoading(false);
            } else {
                console.error('Ошибка при запросе данных о наградах');
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

    return (
        <Container>
            <h1>Все награды</h1>
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <>
                    <DropdownButton as={ButtonGroup} title={"Количество элементов - " + limit} id="dropdown-primary" className="mb-3">
                        <Dropdown.Item onClick={() => handleLimitChange(2)}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(5)}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(10)}>10</Dropdown.Item>
                    </DropdownButton>

                    <Table striped bordered hover>
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Название</th>
                            <th>Описание</th>
                            <th>Очки опыта</th>
                        </tr>
                        </thead>
                        <tbody>
                        {awards.map((award, index) => (
                            <tr key={award.id}>
                                <td>{index + 1}</td>
                                <td>{award.name}</td>
                                <td>{award.description}</td>
                                <td>{award.experience_points}</td>
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
                </>
            )}
        </Container>
    );
};

export default Awards;
