import {Form, Button, Stack} from 'react-bootstrap';
import {useState} from "react";

const AuthForm = ({ type, onSubmit, onRegister }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            {type === 'register' && (
                <>
                    <Form.Group controlId="formName">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите ваше имя"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="Введите ваш email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </>
            )}
            {type === 'login' && (
                <>
                    <Form.Group controlId="formName">
                        <Form.Label>Имя</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Введите ваше имя"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="formPassword">
                        <Form.Label>Пароль</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Введите пароль"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                </>
            )}
            <Stack direction="horizontal" gap={4} className="mt-4">
                <Button variant="primary" type="submit">
                    {type === 'register' ? 'Зарегистрироваться' : 'Войти'}
                </Button>

                <Button variant="outline-info" className="ms-auto" onClick={onRegister}>
                    {type === 'register' ? 'Уже есть аккаунт' : 'Еще нет аккаунта'}
                </Button>
            </Stack>
        </Form>
    );
};

export default AuthForm;
