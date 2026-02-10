import { Flex } from "antd";
import {LoginForm} from "../components/LoginForm.tsx";

export function LoginPage() {
    return (
        <Flex
            align="center"
            justify="center"
            style={{ minHeight: "100vh" }}
        >
            <LoginForm />
        </Flex>
    );
}

export default LoginPage;
