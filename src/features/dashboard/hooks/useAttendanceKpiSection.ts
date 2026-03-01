import { useMemo, useState } from "react";
import type { Dayjs } from "dayjs";

import { useUsers } from "../../users";
import { useTeamsData } from "../../teams/hooks/data/useTeamsData";
import { useDepartmentsData } from "../../departments/hooks/useDepartmentsData";
import { useAttendanceKPIs } from "../../kpi/hook/useAttendanceKPIs";

export type Option = { label: string; value: number };

export function useAttendanceKpiSection() {
    const [dates, setDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
    const [userId, setUserId] = useState<number | undefined>();
    const [teamId, setTeamId] = useState<number | undefined>();
    const [departmentId, setDepartmentId] = useState<number | undefined>();

    const { users } = useUsers({ page: 1, page_size: 200 });
    const { teams } = useTeamsData();
    const { departments } = useDepartmentsData();

    const filters = useMemo(
        () => ({
            date_from: dates?.[0]?.format("YYYY-MM-DD"),
            date_to: dates?.[1]?.format("YYYY-MM-DD"),
            user: userId,
            team: teamId,
            department: departmentId,
        }),
        [dates, userId, teamId, departmentId]
    );

    const { data, isLoading, isError } = useAttendanceKPIs(filters);

    const hasFilters = [userId, teamId, departmentId, dates].some(Boolean);

    const userOptions: Option[] = (users ?? []).map((u: any) => ({
        label: `${u.first_name} ${u.last_name}`,
        value: u.id,
    }));

    const teamOptions: Option[] = (teams ?? []).map((t: any) => ({
        label: t.name,
        value: t.id,
    }));

    const departmentOptions: Option[] = (departments ?? []).map((d: any) => ({
        label: d.name,
        value: d.id,
    }));

    const reset = () => {
        setDates(null);
        setUserId(undefined);
        setTeamId(undefined);
        setDepartmentId(undefined);
    };

    return {
        // state
        dates,
        userId,
        teamId,
        departmentId,

        // setters
        setDates,
        setUserId,
        setTeamId,
        setDepartmentId,
        reset,

        // data
        data,
        isLoading,
        isError,

        userOptions,
        teamOptions,
        departmentOptions,

        hasFilters,
    };
}