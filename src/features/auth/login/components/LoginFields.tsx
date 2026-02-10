import { Input, Typography, Space } from "antd";
import { FieldErrors, UseFormRegister } from "react-hook-form";
import { LoginFormValues } from "../schemas/login.schema";

const { Text } = Typography;

type Props = {
    register: UseFormRegister<LoginFormValues>;
    errors: FieldErrors<LoginFormValues>;
};

export function LoginFields({ register, errors }: Props) {
    return (
        <Space direction="vertical" size="middle" style={{ width: "100%" }}>
            <div>
                <Input
                    {...register("email")}
                    placeholder="email@exemple.com"
                    status={errors.email ? "error" : ""}
                />
                {errors.email && (
                    <Text type="danger">{errors.email.message}</Text>
                )}
            </div>

            <div>
                <Input.Password
                    {...register("password")}
                    placeholder="••••••••"
                    status={errors.password ? "error" : ""}
                />
                {errors.password && (
                    <Text type="danger">{errors.password.message}</Text>
                )}
            </div>
        </Space>
    );
}
