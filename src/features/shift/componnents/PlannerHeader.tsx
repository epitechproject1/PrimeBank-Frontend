import {PlannerHeaderTitle} from "./PlannerHeader/PlannerHeaderTitle.tsx";
import {PlannerHeaderActions} from "./PlannerHeader/PlannerHeaderActions.tsx";
import {PlannerTypeFilters} from "./PlannerHeader/PlannerTypeFilters.tsx";


type Props = {
    selectedUserName: string;
    eventCount: number;
    loading: boolean;
    onRefresh: () => void;
    onCreate: () => void;
    activeType?: string | null;
    onFilterType?: (type: string | null) => void;
};

export function PlannerHeader({
                                  selectedUserName,
                                  eventCount,
                                  loading,
                                  onRefresh,
                                  onCreate,
                                  activeType = null,
                                  onFilterType,
                              }: Props) {

    return (
        <div style={{ marginBottom: 14 }}>
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: onFilterType ? 10 : 0,
                }}
            >
                <PlannerHeaderTitle
                    selectedUserName={selectedUserName}
                    eventCount={eventCount}
                />

                <PlannerHeaderActions
                    loading={loading}
                    onRefresh={onRefresh}
                    onCreate={onCreate}
                />
            </div>

            {onFilterType && (
                <PlannerTypeFilters
                    activeType={activeType}
                    onFilterType={onFilterType}
                />
            )}
        </div>
    );
}