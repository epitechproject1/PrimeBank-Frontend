import { useEffect, useRef, useState } from "react";
import type { ScheduleAssignment } from "../types/scheduleAssignment.types";

export function useAssignmentsState() {
    const [assignments, setAssignments] = useState<ScheduleAssignment[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [total, setTotal] = useState(0);

    const assignmentsRef = useRef<ScheduleAssignment[]>([]);
    useEffect(() => {
        assignmentsRef.current = assignments;
    }, [assignments]);

    return {
        assignments,
        setAssignments,
        loading,
        setLoading,
        page,
        setPage,
        search,
        setSearch,
        total,
        setTotal,
        assignmentsRef,
    };
}