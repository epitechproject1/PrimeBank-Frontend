import { useNavigate } from "react-router-dom";
import { WeekPatternsSidebar } from "../components/WeekPatternsSidebar";
import { WeekPatternContent } from "../components/WeekPatternContent";
import { WeekPatternFormModal } from "../components/WeekPatternFormModal";
import { useWeekPatternsPage } from "../hooks/useWeekPatternsPage";

export function WeekPatternsPage() {
    const navigate = useNavigate();

    const {
        weekPatterns,
        loading,
        selected,
        modalOpen,
        editing,
        form,
        setSelected,
        openCreate,
        openEdit,
        closeModal,
        handleSubmit,
        handleDuplicate,
        deleteWeekPattern,
        fetchWeekPatterns,
    } = useWeekPatternsPage();

    return (
        <div style={{ display: "flex", height: "calc(100vh - 60px)" }}>
            <WeekPatternsSidebar
                patterns={weekPatterns}
                selected={selected}
                onSelect={setSelected}
                onCreate={openCreate}
            />

            <WeekPatternContent
                selected={selected}
                loading={loading}
                onRefresh={fetchWeekPatterns}
                onDuplicate={handleDuplicate}
                onEdit={openEdit}
                onDelete={deleteWeekPattern}
                navigate={navigate}
            />

            <WeekPatternFormModal
                open={modalOpen}
                editing={editing}
                form={form}
                onCancel={closeModal}
                onSubmit={handleSubmit}
            />
        </div>
    );
}