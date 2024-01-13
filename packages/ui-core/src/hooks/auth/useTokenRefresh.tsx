import ms from "ms";
import { useEffect, useState } from "react";

import { REFRESH_TIME_REMAINING } from "../../helpers/token";
import { useUser } from "../../hooks/user/useUser";

// Try to refresh the access token every this many minutes
const CHECK_FOR_AUTH_REFRESH = ms("4 minutes");

type TokenRefreshOptions = {
  useUserProps: ReturnType<typeof useUser>;
  onSetAccess?: (token: string) => void;
  onSetRefresh?: (token: string) => void;
  refreshTime?: number;
  timeRemaining?: number;
};

export const useTokenRefresh = ({
  useUserProps,
  onSetAccess,
  onSetRefresh,
  refreshTime,
  timeRemaining,
}: TokenRefreshOptions) => {
  refreshTime = refreshTime ?? CHECK_FOR_AUTH_REFRESH;
  timeRemaining = timeRemaining ?? REFRESH_TIME_REMAINING;

  const [hasRefreshed, setHasRefreshed] = useState(false);
  const {
    refreshAccessToken,
    setAccessToken,
    setRefreshToken,
    mutate,
    user,
    accessToken,
    refreshToken,
    logout,
    ...useUserRes
  } = useUserProps;

  // Refresh once on page load then repeatedly
  useEffect(() => {
    const refreshAuth = async () => {
      await refreshAccessToken(timeRemaining, undefined, {
        access: accessToken,
        refresh: refreshToken,
      }).then((res) => {
        if (!res) {
          return;
        }
        const { refreshToken, accessToken } = res;
        if (refreshToken) {
          setRefreshToken(refreshToken);
          onSetRefresh?.(refreshToken);
        }
        if (accessToken) {
          setAccessToken(accessToken);
          onSetAccess?.(accessToken);
        }
        return accessToken;
      });

      setHasRefreshed(true);
    };

    refreshAuth();
    const interval = setInterval(() => refreshAuth(), refreshTime);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    accessToken,
    logout,
    mutate,
    onSetAccess,
    onSetRefresh,
    refreshTime,
    refreshToken,
    setAccessToken,
    setRefreshToken,
    timeRemaining,
  ]);

  return {
    setAccessToken,
    hasRefreshed,
    mutate,
    user,
    accessToken,
    logout,
    setRefreshToken,
    refreshToken,
    ...useUserRes,
  };
};
