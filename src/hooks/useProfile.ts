// Hook para leer y refrescar el perfil asociado al usuario autenticado.
import { useCallback, useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";
import { getProfile } from "../services/profile.service";
import type { Profile } from "../types/profile";

const profileCache = new Map<string, Profile | null>();
const profileInFlight = new Map<string, Promise<Profile | null>>();

const fetchProfileCached = (userId: string, force = false) => {
    if (!force && profileCache.has(userId)) {
        return Promise.resolve(profileCache.get(userId) ?? null);
    }

    if (!force && profileInFlight.has(userId)) {
        return profileInFlight.get(userId) as Promise<Profile | null>;
    }

    const request = getProfile(userId)
        .then((nextProfile) => {
            profileCache.set(userId, nextProfile);
            return nextProfile;
        })
        .finally(() => {
            profileInFlight.delete(userId);
        });

    profileInFlight.set(userId, request);
    return request;
};

export const useProfile = () => {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(false);

    const refreshProfile = useCallback(async (force = false) => {
        if (loading) {
            return;
        }

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
            const nextProfile = await fetchProfileCached(user.id, force);
            setProfile(nextProfile);
        } finally {
            setLoading(false);
        }
    }, [authLoading, loading, user?.id]);

    const refreshProfileRef = useRef(refreshProfile);

    useEffect(() => {
        refreshProfileRef.current = refreshProfile;
    }, [refreshProfile]);

    useEffect(() => {
        if (authLoading) {
            setLoading(true);
            return;
        }

        if (!user?.id) {
            setProfile(null);
            setLoading(false);
            return;
        }

        void refreshProfileRef.current();
    }, [authLoading, user?.id]);

    return {
        profile,
        loading,
        refreshProfile,
    };
};
