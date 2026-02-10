import { useState } from "react";
import { message } from "antd";
import { login } from "../services/login.service";

type LoginPayload = {
    email: string;
    password: string;
};

type UseLoginResult = {
    login: (payload: LoginPayload) => Promise<void>;
    isLoading: boolean;
    error: string | null;
    contextHolder: React.ReactNode;
};

export function useLogin(): UseLoginResult {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [messageApi, contextHolder] = message.useMessage();

    const loginHandler = async (payload: LoginPayload) => {
        setIsLoading(true);
        setError(null);

        try {
            await login(payload);

            messageApi.success("Connexion réussie");
        } catch (err: any) {
            const errorMessage =
                err?.message || "Erreur lors de la connexion";

            setError(errorMessage);
            messageApi.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        login: loginHandler,
        isLoading,
        error,
        contextHolder,
    };
}
