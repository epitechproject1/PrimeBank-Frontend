import { Flex, Grid, Spin, theme, Row, Col } from "antd";
import { useState } from "react";
import { useProfile } from "../hooks/useProfile";
import { UpdateProfileForm } from "../components/UpdateProfileForm";
import { ProfileInfoCard } from "../components/ProfileInfoCard";
import { ChangePasswordForm } from "../components/ChangePasswordForm";
import { ProfileHeader } from "../components/ProfileHeader";
import { ProfileStats } from "../components/ProfileStats";
import { ProfileSecurityCard } from "../components/ProfileSecurityCard";

const { useBreakpoint } = Grid;

const ProfilePage = () => {
    const screens = useBreakpoint();
    const { token } = theme.useToken();
    const profile = useProfile();
    const [passwordOpen, setPasswordOpen] = useState(false);

    if (profile.profileQuery.isLoading) {
        return <Spin />;
    }

    const user = profile.profileQuery.data;

    if (!user) return null;

    return (
        <>
            <Flex
                vertical
                style={{
                    minHeight: "100vh",
                    padding: screens.md ? "32px 40px" : "16px",
                }}
            >
                <ProfileHeader
                    user={user}
                    screens={screens}
                    primaryColor={token.colorPrimary}
                    onChangePassword={() => setPasswordOpen(true)}
                    onEditInfo={() => {
                        const el = document.getElementById("profile-edit");
                        el?.scrollIntoView({ behavior: "smooth", block: "start" });
                    }}
                />

                <ProfileStats
                    user={user}
                    colors={{
                        primary: token.colorPrimary,
                        success: token.colorSuccess,
                        warning: token.colorWarning,
                    }}
                />

                <Row gutter={[16, 16]}>
                    <Col xs={24} lg={10}>
                        <ProfileInfoCard user={user} />
                        <ProfileSecurityCard
                            onChangePassword={() => setPasswordOpen(true)}
                            onDelete={() => profile.deleteMutation.mutate()}
                            deleting={profile.deleteMutation.isPending}
                        />
                    </Col>

                    <Col xs={24} lg={14}>
                        <div id="profile-edit">
                            <UpdateProfileForm
                                user={user}
                                onSubmit={profile.updateMutation.mutate}
                                loading={profile.updateMutation.isPending}
                            />
                        </div>
                    </Col>
                </Row>
            </Flex>

            <ChangePasswordForm
                open={passwordOpen}
                onCancel={() => setPasswordOpen(false)}
                onSubmit={profile.passwordMutation.mutateAsync}
                loading={profile.passwordMutation.isPending}
            />
        </>
    );
};

export default ProfilePage;
