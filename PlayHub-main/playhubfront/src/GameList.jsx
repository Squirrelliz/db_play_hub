import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from 'js-cookie';
import { Button, Table } from "react-bootstrap";

export default function GameList({ stadium_id }) {
    const [games, setGames] = useState([]);
    const userData = JSON.parse(Cookies.get('userData'));

    const fetchGameData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/game/${stadium_id}`);
            if (response.status === 200) {
                setGames(response.data);
            } else {
                console.error('Ошибка при запросе данных');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    useEffect(() => {
        fetchGameData();
    }, [stadium_id]);

    const formatDateTime = (dateTimeString) => {
        const date = new Date(dateTimeString);
        return date.toLocaleString('ru-RU', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric' });
    };

    const isGameActive = (endTime) => {
        const endDateTime = new Date(endTime);
        const currentDateTime = new Date();
        return endDateTime > currentDateTime;
    };

    const handleJoinGame = async (gameId) => {
        try {
            const playerId = userData.id;
            await axios.post(`http://localhost:8000/players/${playerId}/set_game/${gameId}`);

            // После успешного присоединения к игре
            await updateUserData(playerId);
        } catch (error) {
            console.error('Ошибка при присоединении к игре:', error);
        }
    };

    const handleDeleteGame = async (gameId) => {
        try {
            const response = await axios.delete(`http://localhost:8000/game/${gameId}`);
            if (response.status === 200) {
                await fetchGameData(); // Обновить данные после успешного удаления игры
            } else {
                console.error('Ошибка при удалении игры');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const updateUserData = async (playerId) => {
        try {
            const response = await axios.get(`http://localhost:8000/players/${playerId}`);
            if (response.status === 200) {
                const updatedUserData = response.data;
                Cookies.set('userData', JSON.stringify(updatedUserData), {expires: 1});
                await fetchGameData();
            } else {
                console.error('Ошибка при получении данных игрока');
            }
        } catch (error) {
            console.error('Ошибка при получении данных игрока:', error);
        }
    };

    return (
        <>
            {games.length > 0 ? (
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Название</th>
                        <th>Сложность</th>
                        <th>Дата начала</th>
                        <th>Дата окончания</th>
                        <th>Количество участников</th>
                        <th>Команды участники</th>
                        <th>Присоединиться к игре</th>
                        {userData && userData.role === 'moderator' && <th>Удалить игру</th>}
                    </tr>
                    </thead>
                    <tbody>
                    {games.map((game, index) => (
                        <tr key={index}>
                            <td>{index}</td>
                            <td>{game.name}</td>
                            <td>{game.difficulty}</td>
                            <td>{formatDateTime(game.start_time)}</td>
                            <td>{formatDateTime(game.end_time)}</td>
                            <td>{game.count_participant}</td>
                            <td><ul>{
                                game.teams.map((team, index) => (
                                    <li key={index}>{team}</li>
                                ))
                            }</ul></td>
                            <td>
                                {userData && userData.game_id === game.id ? (
                                    <>
                                        <Button variant="success" className="m-lg-1" disabled>
                                            Вы записаны
                                        </Button>
                                        <Button variant="danger" className="m-lg-1" onClick={() => handleJoinGame(0)}>
                                            Отписаться
                                        </Button>
                                    </>
                                ) : isGameActive(game.end_time) ? (
                                    <Button variant="primary" onClick={() => handleJoinGame(game.id)}>
                                        Присоединиться
                                    </Button>
                                ) : (
                                    <Button variant="secondary" disabled>
                                        Игра закончилась
                                    </Button>
                                )}
                            </td>
                            {userData && userData.role === 'moderator' && (
                                <td>
                                    <Button variant="danger" onClick={() => handleDeleteGame(game.id)}>
                                        Удалить
                                    </Button>
                                </td>
                            )}
                        </tr>
                    ))}
                    </tbody>
                </Table>
            ) : (
                <h2>Игры не добавлены</h2>
            )}
        </>
    );
}
