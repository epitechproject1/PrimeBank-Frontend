// Tu devras définir ton interface User selon ton modèle Django

import {UserProfile} from "../../features/users/types/user.type.ts";

const USER_KEY = "auth_user";

export const userStorage = {
    getUser: (): UserProfile | null => {
        const user = localStorage.getItem(USER_KEY);
        return user ? JSON.parse(user) : null;
    },
    setUser: (user: UserProfile) => {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    },
    clearUser: () => {
        localStorage.removeItem(USER_KEY);
    },
};