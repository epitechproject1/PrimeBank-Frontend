import { Modal } from "antd";

interface DeleteAccountProps {
  onDelete: () => Promise<void> | void;
}

export const DeleteAccountCard = ({ onDelete }: DeleteAccountProps) => {
  const confirmDelete = () => {
    Modal.confirm({
      title: "Supprimer le compte",
      content: "Cette action est irréversible",
      okText: "Supprimer",
      okType: "danger",
      cancelText: "Annuler",
      onOk: onDelete,
    });
  };

  return (
    <button
      style={{
        background: "red",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: 4,
        cursor: "pointer",
      }}
      onClick={confirmDelete}
    >
      Supprimer le compte
    </button>
  );
};
