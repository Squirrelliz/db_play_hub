import { useEffect, useState } from "react";
import axios from "axios";
import {Table, Pagination, Container, DropdownButton, Dropdown, ButtonGroup, Button} from "react-bootstrap";
import DownloadFile from "./downloadFile";

const Player = () => {
    const [players, setPlayers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPlayer, setTotalPlayer] = useState(0);
    const [loading, setLoading] = useState(true);
    const [limit, setLimit] = useState(2);

    useEffect(() => {
        fetchData();
    }, [page, limit]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`http://localhost:8000/players/?limit=${limit}&offset=${(page - 1) * limit}`);
            if (response.status === 200) {
                setPlayers(response.data.data);
                setTotalPlayer(response.data.total);
                setTotalPages(Math.ceil(response.data.total / limit));
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
            <h1>Все пользователи</h1>
            {loading ? (
                <h3>Loading...</h3>
            ) : (
                <>
                    <DropdownButton as={ButtonGroup} title={"Количество элементов - " + limit} id="dropdown-primary" className="m-lg-2">
                        <Dropdown.Item onClick={() => handleLimitChange(2)}>2</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(5)}>5</Dropdown.Item>
                        <Dropdown.Item onClick={() => handleLimitChange(10)}>10</Dropdown.Item>
                    </DropdownButton>
                    <DownloadFile curUrl={"players"}/>

                    <h1>Список игроков</h1>
                    <h5>Всего игроков: {totalPlayer}</h5>
                    <Table striped bordered hover id="my-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Имя</th>
                            <th>Почта</th>
                            <th>Опыт</th>
                            <th>Роль</th>
                            <th>ID Команды</th>
                            <th>ID Игры</th>
                        </tr>
                        </thead>
                        <tbody>
                        {players.map((player, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{player.name}</td>
                                <td>{player.email}</td>
                                <td>{player.experience}</td>
                                <td>{player.role}</td>
                                <td>{player.team_id}</td>
                                <td>{player.game_id}</td>
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

export default Player;
