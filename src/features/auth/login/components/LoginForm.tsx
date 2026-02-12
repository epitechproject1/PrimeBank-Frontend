import { Card, Button, Typography, Space, theme, Flex } from "antd";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { loginSchema, LoginFormValues } from "../schemas/login.schema";
// 1. On importe le hook unifié useAuth
import { useAuth } from "../hooks/useAuth";
import { LoginFields } from "./LoginFields";

const { Text, Link } = Typography;

export function LoginForm() {
    // 2. On récupère les valeurs depuis useAuth et on les renomme (alias) pour simplifier le code
    const {
        login,
        isLoginLoading: isLoading, // On renomme isLoginLoading -> isLoading
        loginError: error,         // On renomme loginError -> error
        contextHolder
    } = useAuth();

    const { token } = theme.useToken();
    const navigate = useNavigate();

    const {
        handleSubmit,
        control,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: "onChange", // Validation temps réel
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (data: LoginFormValues) => {
        try {
            // Le hook utilise mutateAsync, donc s'il y a une erreur API, elle est levée ici
            await login(data);

            // Si on arrive ici, c'est que le login a réussi (200 OK)
            navigate("/dashboard");
        } catch (err) {
            // Si erreur, on ne fait rien ici (l'erreur est gérée par la variable 'error' du hook)
            // Le console.log aide juste au débogage
            console.error("Échec de la connexion", err);
        }
    };

    return (
        <>
            {contextHolder}

            <Card
                style={{
                    width: "100%",
                    maxWidth: 400,
                    border: "none",
                    // Optionnel: fond transparent pour laisser le design global gérer
                    background: "transparent"
                }}
            >
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Space direction="vertical" size="large" style={{ width: "100%" }}>

                        {/* Champs du formulaire (Email / Password) */}
                        <LoginFields control={control} errors={errors} />

                        {/* --- AFFICHAGE DE L'ERREUR API --- */}
                        {error && (
                            <div style={{
                                background: token.colorErrorBg,
                                border: `1px solid ${token.colorErrorBorder}`,
                                padding: "8px 12px",
                                borderRadius: token.borderRadius,
                                textAlign: 'center'
                            }}>
                                {/* On affiche le message propre venant de l'API */}
                                <Text type="danger">
                                    {error.message || "Une erreur est survenue."}
                                </Text>
                            </div>
                        )}

                        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                size="large"
                                block
                                style={{ fontWeight: 600 }}
                            >
                                Se connecter
                            </Button>

                            <Flex justify="center">
                                <Link href="/forgot-password" style={{ fontSize: 14 }}>
                                    Mot de passe oublié ?
                                </Link>
                            </Flex>
                        </Space>
                    </Space>
                </form>
            </Card>
        </>
    );
}