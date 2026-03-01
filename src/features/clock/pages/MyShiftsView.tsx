// src/features/shift/views/MyShiftsView.tsx

import { useState, useMemo } from "react";
import { Alert, message, Skeleton, Space, Typography, Badge } from "antd";
import { CalendarOutlined } from "@ant-design/icons";
import {CalendarEventExtended} from "../hooks/calendarEvent.ts";
import {useClockIn, useClockOut} from "../hooks/useClockEvents.ts";
import {useSubmitClockCode} from "../hooks/useClockValidation.ts";
import {getErrorMessage} from "../hooks/Clockstatus.tsx";
import {useMyShifts} from "../../shift/hooks/useMyShifts.ts";
import {shiftsToCalendarEvents} from "../hooks/shiftToCalendarEvent.ts";
import {ShiftDetailDrawer} from "../hooks/ShiftDetailDrawer.tsx";
import {ClockCodeModal} from "../hooks/Clockcodemodal.tsx";
import {MyShiftsCalendar} from "../hooks/Myshiftscalendar.tsx";

const { Title, Text } = Typography;

type DrawerEvent = CalendarEventExtended & {
    date: string;
    start: string;
    end: string;
    title: string;
};

function useClockOrchestration() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [code, setCode] = useState("");

    const clockInMutation  = useClockIn();
    const clockOutMutation = useClockOut();
    const submitCodeMutation = useSubmitClockCode();

    const openModal  = () => setIsModalOpen(true);
    const closeModal = () => { setIsModalOpen(false); setCode(""); };

    const clockAction = (mutate: (id: number, opts: any) => void, shiftId: number) =>
        mutate(shiftId, {
            onSuccess: () => { message.success("Code envoyé par email 📩"); openModal(); },
            onError: (err: unknown) => message.error(getErrorMessage(err)),
        });

    const handleClockIn  = (shiftId: number) => clockAction(clockInMutation.mutate,  shiftId);
    const handleClockOut = (shiftId: number) => clockAction(clockOutMutation.mutate, shiftId);

    const handleSubmitCode = () =>
        submitCodeMutation.mutate({ code }, {
            onSuccess: () => { message.success("Pointage validé ✅"); closeModal(); },
            onError:   (err: unknown) => message.error(getErrorMessage(err)),
        });

    return {
        isModalOpen, code, setCode, closeModal,
        handleClockIn, handleClockOut, handleSubmitCode,
        submitLoading: submitCodeMutation.isPending,
    };
}

function useTodayShiftAction(
    onClockIn: (id: number) => void,
    onClockOut: (id: number) => void,
) {
    return (ext: CalendarEventExtended) => {
        if (ext.clockStatus === "NOT_STARTED") { onClockIn(ext.shiftId); return; }
        if (ext.clockStatus === "IN_PROGRESS")  { onClockOut(ext.shiftId); return; }
        message.info("Ce shift ne nécessite pas d'action pour le moment.");
    };
}

export default function MyShiftsView() {
    const [drawerEvent, setDrawerEvent] = useState<DrawerEvent | null>(null);
    const { data, isLoading, error } = useMyShifts({ page: 1, page_size: 200 });

    const clock = useClockOrchestration();
    const handleTodayAction = useTodayShiftAction(clock.handleClockIn, clock.handleClockOut);

    const calendarEvents = useMemo(
        () => shiftsToCalendarEvents(data?.results ?? []),
        [data?.results],
    );

    if (error) {
        return (
            <Alert
                type="error" showIcon
                message="Impossible de charger vos shifts"
                description="Vérifiez votre connexion et réessayez."
                style={{ borderRadius: 12 }}
            />
        );
    }

    return (
        <Space direction="vertical" size={16} style={{ width: "100%" }}>
            <Space align="center" size={12}>
                <CalendarOutlined style={{ fontSize: 20, color: "#1677ff" }} />
                <div>
                    <Title level={4} style={{ margin: 0 }}>Mon planning</Title>
                    {data && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                            <Badge count={data.count} showZero color="#1677ff" style={{ fontSize: 11 }} />
                            {" "}shift{data.count !== 1 ? "s" : ""} au total
                        </Text>
                    )}
                </div>
            </Space>

            {isLoading
                ? <Skeleton active paragraph={{ rows: 10 }} style={{ padding: 24 }} />
                : (
                    <MyShiftsCalendar
                        events={calendarEvents}
                        onTodayShiftClick={handleTodayAction}
                        onOtherShiftClick={setDrawerEvent}
                    />
                )
            }

            <ClockCodeModal
                open={clock.isModalOpen}
                code={clock.code}
                loading={clock.submitLoading}
                onCodeChange={clock.setCode}
                onConfirm={clock.handleSubmitCode}
                onCancel={clock.closeModal}
            />

            <ShiftDetailDrawer
                open={drawerEvent !== null}
                event={drawerEvent}
                onClose={() => setDrawerEvent(null)}
            />
        </Space>
    );
}