import {
    Flex,
    Grid,
    Image,
    Typography,
    Button,
    theme,
} from "antd";
import { MoonOutlined, SunOutlined } from "@ant-design/icons";
import { LoginForm } from "../components/LoginForm";
import {useThemeMode} from "../../../../lib/theme/ThemeContext.tsx";

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

export function LoginPage() {
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const { mode, toggleTheme } = useThemeMode();

    const logoSrc =
        mode === "dark"
            ? "/logo-dark.jpeg"
            : "/logo-light.jpeg";

    return (
        <Flex style={{ minHeight: "100vh" }}>

            {/* --- GAUCHE : FORMULAIRE --- */}
            <Flex
                vertical
                align="center"
                justify="center"
                style={{
                    flex: 1,
                    padding: "40px 20px",
                    position: "relative",
                }}
            >
                {/* --- BOUTON THEME MODIFIÉ --- */}
                <div style={{ position: "absolute", top: 24, right: 24 }}>
                    <Button
                        type="text" // 'text' enlève les bordures et le fond par défaut proprement
                        icon={mode === "dark" ? <SunOutlined /> : <MoonOutlined />}
                        onClick={toggleTheme}
                        size="large"
                        style={{ color: token.colorTextSecondary }} // Couleur grise subtile
                    >
                        {/* Affiche le texte en fonction du mode */}
                        {mode === "dark" ? "Mode Sombre" : "Mode Clair"}
                    </Button>
                </div>

                {/* Conteneur centré */}
                <Flex vertical align="center" style={{ width: "100%", maxWidth: 420 }}>

                    {/* 1. LOGO */}
                    <div> {/* Ajout d'un peu d'espace */}
                        <Image
                            src={logoSrc}
                            alt="PrimeBank"
                            preview={false}
                            width={160}
                        />
                    </div>

                    {/* 2. TEXTE D'ACCUEIL */}
                    <Title level={2} style={{ margin: "0 0 8px 0", textAlign: "center" }}>
                        Connectez-vous
                    </Title>

                    {/* 3. FORMULAIRE */}
                    <div style={{ width: "100%"}}>
                        <LoginForm />
                    </div>

                    {/* Copyright */}
                    <div style={{ marginTop: 64 }}>
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            © {new Date().getFullYear()} PrimeBank — Epitech Project.
                        </Text>
                    </div>
                </Flex>
            </Flex>

            {/* --- DROITE : IMAGE --- */}
            {screens.lg && (
                <Flex
                    style={{
                        flex: 1,
                        backgroundColor: token.colorBgContainer
                    }}
                >
                    <Image
                        src="/team.jpg"
                        alt="Équipe PrimeBank"
                        preview={false}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                    />
                </Flex>
            )}
        </Flex>
    );
}

export default LoginPage;