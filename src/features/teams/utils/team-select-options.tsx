import { Space, Avatar } from "antd";
import { UserOutlined, BankOutlined } from "@ant-design/icons";
import { JSX } from "react";
import { UserProfile } from "../../users/types/user.type";
import {DefaultOptionType} from "antd/es/select";
import { BaseSelectOption } from "../utils/team-form-utils";
export interface SelectOption extends DefaultOptionType {
    value: number;
    label: JSX.Element;
    searchLabel: string;
}


export function formatUserOptions(
    baseOptions: BaseSelectOption[],
    users: UserProfile[]
): SelectOption[] {
    return baseOptions.map((option, index) => {
        const user = users[index];

        return {
            ...option,
            label: (
                <Space>
                    <Avatar size={20} icon={<UserOutlined />} />
                    {option.label}
                    <span style={{ color: "#888", fontSize: 12 }}>
                        ({user.email})
                    </span>
                </Space>
            ),
        };
    });
}


export function formatDepartmentOptions(
    baseOptions: BaseSelectOption[]
): SelectOption[] {
    return baseOptions.map((option) => ({
        ...option,
        label: (
            <Space>
                <BankOutlined />
                {option.label}
            </Space>
        ),
    }));
}
