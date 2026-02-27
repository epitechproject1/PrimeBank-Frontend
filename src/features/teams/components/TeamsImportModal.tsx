import { Modal, Upload, Spin } from "antd";

export function TeamsImportModal({
                                     open,
                                     loading,
                                     onClose,
                                     onImport,
                                 }: {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onImport: (file: File) => void;
}) {
    return (
        <Modal
            title="Importer des équipes (CSV)"
            open={open}
            onCancel={onClose}
            footer={null}
            destroyOnClose
            maskClosable={!loading}
        >
            <Upload.Dragger
                accept=".csv"
                showUploadList={false}
                disabled={loading}
                beforeUpload={(file) => {
                    onImport(file as File);
                    return false;
                }}
                style={{ padding: "20px 0" }}
            >
                <p className="ant-upload-drag-icon" style={{ fontSize: 40 }}>
                    📂
                </p>
                <p className="ant-upload-text">
                    Glissez votre fichier CSV ici ou cliquez pour sélectionner
                </p>
                <p className="ant-upload-hint">
                    Formats acceptés : .csv — encodage UTF-8 recommandé
                </p>
            </Upload.Dragger>

            {loading && (
                <div style={{ textAlign: "center", marginTop: 20 }}>
                    <Spin tip="Import en cours…" />
                </div>
            )}
        </Modal>
    );
}