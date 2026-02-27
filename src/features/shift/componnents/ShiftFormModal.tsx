import { Form, Modal } from "antd";
import type { FormInstance } from "antd";
import type { ShiftFormValues } from "../schemas/shift.schema";
import {ShiftFormHeader} from "./ShiftFormModal/ShiftFormHeader.tsx";
import {ShiftFormInfos} from "./ShiftFormModal/ShiftFormInfos.tsx";
import {ShiftFormTimes} from "./ShiftFormModal/ShiftFormTimes.tsx";
import {ShiftFormRelations} from "./ShiftFormModal/ShiftFormRelations.tsx";
import {ShiftFormActions} from "./ShiftFormModal/ShiftFormActions.tsx";

type Option = { value: number; label: string };

type Props = {
    open: boolean;
    mode: "create" | "edit";
    form: FormInstance<ShiftFormValues>;
    onCancel: () => void;
    onSubmit: (values: ShiftFormValues) => void | Promise<void>;
    assignmentOptions?: Option[];
    userOptions?: Option[];
};

export function ShiftFormModal({
                                   open,
                                   mode,
                                   form,
                                   onCancel,
                                   onSubmit,
                                   assignmentOptions = [],
                                   userOptions = [],
                               }: Props) {
    const isCreate = mode === "create";

    return (
        <Modal
            open={open}
            onCancel={onCancel}
            footer={null}
            title={<ShiftFormHeader isCreate={isCreate} />}
            destroyOnHidden
            width={480}
        >
            <Form form={form} layout="vertical" onFinish={onSubmit} style={{ marginTop: 8 }}>
                <ShiftFormInfos isCreate={isCreate} />
                <ShiftFormTimes />
                <ShiftFormRelations
                    isCreate={isCreate}
                    userOptions={userOptions}
                    assignmentOptions={assignmentOptions}
                />
                <ShiftFormActions isCreate={isCreate} onCancel={onCancel} />
            </Form>
        </Modal>
    );
}