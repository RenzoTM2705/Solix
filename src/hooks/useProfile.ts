import { useCallback, useEffect, useState } from "react";
import { useAuth } from "./useAuth";
import { getProfile } from "../services/profile.service";
import type { Profile } from "../types/profile";

export const useProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    const refreshProfile = useCallback(async () => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user?.id) {
            setProfile(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        try {
            const nextProfile = await getProfile(user.id);
            setProfile(nextProfile);
        } finally {
            setLoading(false);
        }
    }, [authLoading, user?.id]);

    useEffect(() => {
        refreshProfile();
    }, [refreshProfile]);

    return {
        profile,
        loading,
        refreshProfile,
    };
};
