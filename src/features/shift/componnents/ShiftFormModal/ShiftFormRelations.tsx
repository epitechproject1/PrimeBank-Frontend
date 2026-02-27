import { Divider, Form, Select } from "antd";

type Option = { value: number; label: string };

type Props = {
    isCreate: boolean;
    userOptions: Option[];
    assignmentOptions: Option[];
};

export function ShiftFormRelations({
                                       isCreate,
                                       userOptions,
                                       assignmentOptions,
                                   }: Props) {
    const form = Form.useFormInstance();

    // Quand l'user change → on reset assignment
    // (le parent doit appeler form.setFieldValue("assignment", ...) s'il trouve un match)
    const handleUserChange = (userId: number) => {
        form.setFieldValue("user", userId);
        form.setFieldValue("assignment", undefined);
    };

    return (
        <>
            {/* Mode édition : champs cachés pour garder les valeurs dans le form */}
            {!isCreate && (
                <>
                    <Form.Item name="user" hidden><input /></Form.Item>
                    <Form.Item name="assignment" hidden><input /></Form.Item>
                </>
            )}

            {/* Mode création */}
            {isCreate && (
                <>
                    <Divider>Employé & Assignation</Divider>

                    {userOptions.length > 0 && (
                        <Form.Item
                            name="user"
                            label="Employé"
                            rules={[{ required: true, message: "Sélectionnez un employé" }]}
                        >
                            <Select
                                options={userOptions}
                                showSearch
                                optionFilterProp="label"
                                placeholder="Sélectionner un employé"
                                onChange={handleUserChange}
                            />
                        </Form.Item>
                    )}

                    <Form.Item
                        name="assignment"
                        label="Assignation"
                        rules={[{ required: true, message: "Sélectionnez une assignation" }]}
                    >
                        <Select
                            options={assignmentOptions}
                            showSearch
                            optionFilterProp="label"
                            placeholder="Sélectionner une assignation"
                        />
                    </Form.Item>
                </>
            )}
        </>
    );
}