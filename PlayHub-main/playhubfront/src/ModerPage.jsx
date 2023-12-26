import {Container, Tab, Tabs} from "react-bootstrap";
import Player from "./Moderator/Player";
import Awards from "./Moderator/Awards";
import Sports from "./Moderator/Sports";
import Stadium from "./Moderator/Stadium";

export default function ModerPage() {
    return (
        <Container>
            <Tabs
                defaultActiveKey="profile"
                id="fill-tab-example"
                className="mb-3 mt-3"
                fill
            >
                <Tab eventKey="player" title="Игроки">
                    <Player />
                </Tab>
                <Tab eventKey="award" title="Награды">
                    <Awards />
                </Tab>
                <Tab eventKey="sport_type" title="Виды спорта">
                    <Sports />
                </Tab>
                <Tab eventKey="stadium" title="Стадионы">
                    <Stadium />
                </Tab>
            </Tabs>
        </Container>
    )
}