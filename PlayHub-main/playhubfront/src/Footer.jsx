import {Container, Navbar} from "react-bootstrap";

export default function Footer() {
    return (
        <Navbar bg="dark" data-bs-theme="dark" className="position-fixed bottom-0 w-100">
            <Container>
                <Navbar.Brand>PlayHub</Navbar.Brand>
                <Navbar.Toggle />
                <Navbar.Collapse className="justify-content-end">
                    <Navbar.Text>
                        Created by Grinchenko A.S. & Samoylova E.A. PV-212 (dec 2023)
                    </Navbar.Text>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}