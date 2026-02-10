import { Input, Typography, Space } from "antd";
import { Control, Controller, FieldErrors } from "react-hook-form";
import { LoginFormValues } from "../schemas/login.schema";

const { Text } = Typography;

type Props = {
    control: Control<LoginFormValues>; // On utilise Control ici
    errors: FieldErrors<LoginFormValues>;
};

export function LoginFields({ control, errors }: Props) {
    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            {/* Champ Email */}
            <div>
                <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                        <Input
                            {...field}
                            placeholder="email@exemple.com"
                            status={errors.email ? "error" : ""}
                            size="large"
                        />
                    )}
                />
                {errors.email && (
                    <Text type="danger" style={{ fontSize: 13 }}>
                        {errors.email.message}
                    </Text>
                )}
            </div>

            {/* Champ Mot de passe */}
            <div>
                <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                        <Input.Password
                            {...field}
                            placeholder="••••••••"
                            status={errors.password ? "error" : ""}
                            size="large"
                        />
                    )}
                />
                {errors.password && (
                    <Text type="danger" style={{ fontSize: 13 }}>
                        {errors.password.message}
                    </Text>
                )}
            </div>
        </Space>
    );
}