import { Modal } from "antd";
import type { Shift } from "../types/shift.types";
import {ShiftDrawerHeader} from "./ShiftDrawer/ShiftDrawerHeader.tsx";
import {ShiftDrawerDetails} from "./ShiftDrawer/ShiftDrawerDetails.tsx";
import {ShiftDrawerActions} from "./ShiftDrawer/ShiftDrawerActions.tsx";

type Props = {
    open: boolean;
    shift: Shift | null;
    onClose: () => void;
    onDelete: (id: number) => Promise<void>;
    onEdit: (shift: Shift) => void;
    onOverride: (shift: Shift) => void;
};

export function ShiftDrawer({
                                open,
                                shift,
                                onClose,
                                onDelete,
                                onEdit,
                                onOverride,
                            }: Props) {
    if (!shift) return null;

    return (
        <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            width={440}
            styles={{ body: { padding: 0 } }}
        >
            <ShiftDrawerHeader shift={shift} />
            <ShiftDrawerDetails shift={shift} />
            <ShiftDrawerActions
                shift={shift}
                onClose={onClose}
                onDelete={onDelete}
                onEdit={onEdit}
                onOverride={onOverride}
            />
        </Modal>
    );
}