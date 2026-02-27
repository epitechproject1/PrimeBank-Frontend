import { useEffect } from "react";
import { useAssignmentsState } from "./useAssignmentsState";
import { useFetchAssignments } from "./useFetchAssignments";
import { useCreateAssignment } from "./useCreateAssignment";
import { useUpdateAssignment } from "./useUpdateAssignment";
import { useDeleteAssignment } from "./useDeleteAssignment";
import { useGenerateShifts } from "./useGenerateShifts";

export function useScheduleAssignmentsData() {
    const {
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
    } = useAssignmentsState();

    const fetchAssignments = useFetchAssignments(page, search, setAssignments, setLoading, setTotal);
    const createAssignment = useCreateAssignment(setAssignments, setTotal);
    const updateAssignment = useUpdateAssignment(assignmentsRef, setAssignments);
    const deleteAssignment = useDeleteAssignment(assignmentsRef, setAssignments, setTotal);
    const generateShifts = useGenerateShifts(setAssignments);

    useEffect(() => {
        fetchAssignments();
    }, [fetchAssignments]);

    return {
        assignments,
        loading,
        page,
        total,
        search,
        setPage,
        setSearch,
        fetchAssignments,
        createAssignment,
        updateAssignment,
        deleteAssignment,
        generateShifts,
    };
}