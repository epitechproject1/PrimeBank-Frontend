import { Form, theme } from "antd";
import { useMemo } from "react";

import { usePlannerData } from "../hooks/usePlannerData";
import { usePlannerSearch } from "../hooks/usePlannerSearch";
import { usePlannerState } from "../hooks/usePlannerState";
import { useOverrideModal } from "../hooks/useOverrideModal";
import { useShiftSubmit } from "../hooks/useShiftSubmit";
import { LeftPanel } from "../componnents/LeftPanel";
import { PlannerHeader } from "../componnents/PlannerHeader";
import { PlannerCalendar } from "../componnents/PlannerCalendar";
import { ShiftDrawer } from "../componnents/ShiftDrawer";
import { ShiftFormModal } from "../componnents/ShiftFormModal";
import { ShiftOverrideModal } from "../../shiftOverride/components/ShiftOverrideModal";

import type { ShiftFormValues } from "../schemas/shift.schema";
import type { ShiftOverrideFormValues } from "../../shiftOverride/components/ShiftOverrideModal";
import { createNowSelection } from "../types/plannerHelpers.ts";

export function ShiftsPlannerPage() {
    const { token } = theme.useToken();

    const {
        shifts,
        loading,
        search,
        setSearch,
        fetchShifts,
        deleteShift,
        createShift,
        updateShift,
        overrides,
        upsertOverrideForShift,
        assignments,
        users,
    } = usePlannerData();

    const [form] = Form.useForm<ShiftFormValues>();
    const [overrideForm] = Form.useForm<ShiftOverrideFormValues>();

    const { filteredShifts, filteredUsers } = usePlannerSearch(shifts, users, search);

    const planner = usePlannerState(filteredShifts, overrides, users, assignments, form);

    const override = useOverrideModal(overrides, upsertOverrideForShift, overrideForm);

    const handleSubmit = useShiftSubmit({
        modalMode: planner.modalMode,
        selectedShift: planner.selectedShift,
        selectedUser: planner.selectedUser,
        createShift,
        updateShift,
        closeModal: planner.closeModal,
        fetchShifts,
    });

    // Tous les users disponibles pour le Select
    const userOptions = useMemo(
        () => users.map((u) => ({ value: u.id, label: u.name })),
        [users]
    );

    // Assignments filtrés par user sélectionné dans la sidebar OU dans le form
    // On expose tous les assignments — ShiftFormRelations les affiche tous
    // et l'utilisateur choisit le bon (le back validera la cohérence)
    const assignmentOptions = useMemo(
        () =>
            assignments.map((a) => {
                const firstName = a.contract_detail?.user_detail?.first_name ?? "";
                const lastName = a.contract_detail?.user_detail?.last_name ?? "";
                const name = `${firstName} ${lastName}`.trim();
                return {
                    value: a.id,
                    label: name ? `${name} — #${a.id}` : `Assignation #${a.id}`,
                };
            }),
        [assignments]
    );

    return (
        <div style={{ display: "flex", height: "calc(100vh - 120px)", background: token.colorBgLayout }}>
            <LeftPanel
                users={filteredUsers}
                totalShifts={shifts.length}
                selectedUser={planner.selectedUser}
                onSelectUser={planner.setSelectedUser}
                search={search}
                onChangeSearch={setSearch}
                onSearchEnter={fetchShifts}
            />

            <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column" }}>
                <PlannerHeader
                    selectedUserName={planner.selectedUserName}
                    eventCount={planner.events.length}
                    loading={loading}
                    onRefresh={fetchShifts}
                    onCreate={() => planner.handleDateSelect(createNowSelection())}
                />

                <PlannerCalendar
                    events={planner.events}
                    onSelect={planner.handleDateSelect}
                    onEventClick={planner.handleEventClick}
                />
            </div>

            <ShiftDrawer
                open={planner.drawerOpen}
                shift={planner.selectedShift}
                onClose={() => planner.setDrawerOpen(false)}
                onDelete={async (id) => {
                    await deleteShift(id);
                    fetchShifts();
                }}
                onEdit={(shift) => {
                    planner.setDrawerOpen(false);
                    planner.openEditModal(shift);
                }}
                onOverride={(shift) => {
                    planner.setDrawerOpen(false);
                    override.openOverrideModal(shift);
                }}
            />

            <ShiftFormModal
                open={planner.modalOpen}
                mode={planner.modalMode}
                form={form}
                onCancel={planner.closeModal}
                onSubmit={handleSubmit}
                userOptions={userOptions}
                assignmentOptions={assignmentOptions}
            />

            <ShiftOverrideModal
                open={override.overrideModalOpen}
                form={overrideForm}
                shift={override.selectedShift}
                onCancel={() => override.setOverrideModalOpen(false)}
                onSubmit={override.submitOverride}
            />
        </div>
    );
}