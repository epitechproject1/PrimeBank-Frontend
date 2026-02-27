import { Button } from "antd";

type Props = {
    isCreate: boolean;
    onCancel: () => void;
};

export function ShiftFormActions({ isCreate, onCancel }: Props) {
    return (
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
            <Button block onClick={onCancel}>
                Annuler
            </Button>

            <Button htmlType="submit" type="primary" block>
                {isCreate ? "Créer le shift" : "Enregistrer"}
            </Button>
        </div>
    );
}