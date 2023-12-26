import React, {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Modal, Button} from 'react-bootstrap';
import Cookies from 'js-cookie';
import AuthForm from "./AutoForm";

const App = () => {
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isRegister, setIsRegister] = useState(true);

    useEffect(() => {
        const userData = Cookies.get('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        } else {
            setShowModal(true);
        }
    }, []);

    const handleRegister = async (formData) => {
        try {
            const response = await fetch('http://localhost:8000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const userData = await response.json();
                // Действия при успешной регистрации (например, запись в куки)
                console.log('Пользователь успешно зарегистрирован:', userData);
                setUser(userData);
                Cookies.set('userData', JSON.stringify(userData), {expires: 1}); // 2 минуты = 1 / 720 дня
                setShowModal(false);
                window.location.reload();
            } else {
                // Обработка ошибок
                console.error('Ошибка при регистрации');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    const handleLogin = async (formData) => {
        try {
            const response = await fetch('http://localhost:8000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const userData = await response.json();
                // Действия при успешной регистрации (например, запись в куки)
                console.log('Пользователь успешно вошел:', userData);
                setUser(userData);
                Cookies.set('userData', JSON.stringify(userData), {expires: 1}); // 2 минуты = 1 / 720 дня
                setShowModal(false);
                window.location.reload();
            } else {
                // Обработка ошибок
                console.error('Ошибка при регистрации');
            }
        } catch (error) {
            console.error('Ошибка при выполнении запроса:', error);
        }
    };

    // Функция для регистрации/логина, которая отправляет запросы на сервер и вызывает handleLogin при успехе

    return (
        <Modal show={showModal}>
            <Modal.Header>
                <Modal.Title>{isRegister ? 'Вход' : 'Регистрация'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {isRegister
                    ? <AuthForm type="login" onSubmit={handleLogin} onRegister={() => setIsRegister(!isRegister)}/>
                    :
                    <AuthForm type="register" onSubmit={handleRegister} onRegister={() => setIsRegister(!isRegister)}/>
                }
            </Modal.Body>
        </Modal>
    );
};

export default App;
