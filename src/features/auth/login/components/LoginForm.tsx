import { Card, Button, Typography, Space } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema, LoginFormValues } from "../schemas/login.schema";
import { useLogin } from "../hooks/useLogin";
import { LoginFields } from "./LoginFields";

const { Title, Text, Link } = Typography;

export function LoginForm() {
    const { login, isLoading, error, contextHolder } = useLogin();

    const {
        handleSubmit,
        register,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        await login(data);
    };

    return (
        <>
            {contextHolder}

            <Card style={{ width: 400 }} bordered={false}>
                <Space direction="vertical" size="large" style={{ width: "100%" }}>
                    <Title level={3}>Connexion</Title>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <LoginFields register={register} errors={errors} />

                        {error && <Text type="danger">{error}</Text>}

                        <Space direction="vertical" style={{ width: "100%" }}>
                            <Link href="/forgot-password">
                                Mot de passe oublié ?
                            </Link>

                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                            >
                                Se connecter
                            </Button>
                        </Space>
                    </form>
                </Space>
            </Card>
        </>
    );
}
