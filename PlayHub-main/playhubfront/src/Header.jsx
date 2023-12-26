import {Button, Container, Image, Nav, Navbar} from "react-bootstrap";
import {useEffect, useState} from "react";
import Cookies from "js-cookie";

export default function Header() {
    const [user, setUser] = useState(null);
    useEffect(() => {
        const userData = Cookies.get('userData');
        if (userData) {
            setUser(JSON.parse(userData));
        }
    }, []);

    const handleLogout = () => {
        setUser(null);
        Cookies.remove('userData');
        window.location.href = "/";
    };

    return (
        <Navbar bg="dark" data-bs-theme="dark">
            <Container>
                <Navbar.Brand>PlayHub</Navbar.Brand>
                <Nav className="me-auto">
                    <Nav.Link href="/">Главная</Nav.Link>
                    <Nav.Link href="/profile">Профиль</Nav.Link>
                    <Nav.Link href="/award">Награды</Nav.Link>
                    {user && user.role === "moderator" ? <Nav.Link href="/moder">Модерка</Nav.Link> : ""}
                </Nav>
                <div style={{marginRight: 1 + 'em'}}>
                    <Image
                        src="https://sneg.top/uploads/posts/2023-04/1681210481_sneg-top-p-seraya-kartinka-vkontakte-17.jpg"
                        roundedCircle
                        height={30}
                        style={{marginRight: 0.3 + 'em'}}/>
                    <Navbar.Text>
                        {user ? user.name + "[" + user.role + "]" : "Default"}
                    </Navbar.Text>
                </div>
                <Button onClick={handleLogout} className="ml-4">Выйти</Button>
            </Container>
        </Navbar>
    )
}