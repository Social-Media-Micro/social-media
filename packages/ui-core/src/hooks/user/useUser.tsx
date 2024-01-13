import { UseStorageProps } from "../../helpers/storage";
import { AccessTokensResponseDto } from "@monorepo/api-client/src/models/AccessTokensResponseDto";
import { useAppSelector } from "../../redux/hooks";
import { globalCacheStateSelector } from "../../redux/slices/globaCache.slice";
import useSWR, { SWRConfiguration, useSWRConfig } from "swr";
import {
  accessTokenKey,
  decodeJwt,
  refreshTokenKey,
  tokenStillValid,
} from "../../helpers/token";
import { useCallback, useMemo } from "react";
import { UserType } from "@monorepo/api-client/src/models/CreateUserResponseDto";
import { AuthApi } from "@monorepo/api-client/src/apis/AuthApi";
import { UserApi } from "@monorepo/api-client/src/apis/UserApi";
export interface UserOptions extends UseStorageProps {
  // Required
  onLogout: () => void;
  refreshAccessToken: (
    timeRemaining?: number,
    forceRefresh?: boolean,
    tokens?: { access?: string | null; refresh?: string | null }
  ) => Promise<AccessTokensResponseDto | undefined>;

  // Optional
  access?: string | null;
  refresh?: string | null;
  setAccess?: (token: string | undefined) => void;
  forceStorage?: boolean;
  userExtensionOverride?: string;
}

export const useUser = (options: UserOptions, config?: SWRConfiguration) => {
  const {
    useStorage,
    onLogout,
    refreshAccessToken,
    access,
    refresh,
    forceStorage,
    setAccess,
    userExtensionOverride,
  } = options ?? {};
  const { cache } = useSWRConfig();
  const { userExtension } = useAppSelector(globalCacheStateSelector);
  const [cachedAccessToken, setCachedAccessToken] = useStorage(
    accessTokenKey,
    ""
  );
  const accessToken = useMemo(
    () => (forceStorage ? cachedAccessToken : access ?? cachedAccessToken),
    [forceStorage, cachedAccessToken, access]
  );
  const isAccessTokenValid = useMemo(
    () => !!accessToken && tokenStillValid(accessToken, 0),
    [accessToken]
  );
  const setAccessToken = useMemo(
    () =>
      (!!access && !forceStorage ? setAccess : setCachedAccessToken) ??
      (() => null),
    [access, forceStorage, setAccess, setCachedAccessToken]
  );
  const [cachedRefreshToken, setCachedRefreshToken] = useStorage(
    refreshTokenKey,
    ""
  );
  const refreshToken = useMemo(
    () => (forceStorage ? cachedRefreshToken : refresh ?? cachedRefreshToken),
    [forceStorage, cachedRefreshToken, refresh]
  );
  const setRefreshToken = useMemo(
    () => (refresh && !forceStorage ? () => null : setCachedRefreshToken),
    [refresh, forceStorage, setCachedRefreshToken]
  );
  const logout = useCallback(() => {
    AuthApi.logout().catch(() => null); // update the server that the user has logged out
    if (cache) {
      const c = cache as any; // eslint-disable-line @typescript-eslint/no-explicit-any
      c.clear();
    }
    setAccessToken(undefined);
    setRefreshToken(undefined);
    onLogout();
  }, [cache, setAccessToken, setRefreshToken]);

  const userClaims = useMemo(
    () => (accessToken ? decodeJwt(accessToken) : null),
    [accessToken]
  );

  const key = useMemo(
    () =>
      UserApi.getCurrentUserPath +
      (userExtensionOverride ?? userExtension ?? ""),
    [userExtension, userExtensionOverride]
  );
  const fetch = useCallback(async () => {
    // When this flag is false there is not yet a user to retrieve
    try {
      const { isVerified } = decodeJwt(accessToken);
      if (!accessToken || !isVerified) {
        return null;
      }
      const user = await UserApi.getCurrentUser();
      if (user.remote === "success") {
        if (user.data.data.deactivatedAt && !access) {
          logout();
        }
        return user.data.data;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }, [accessToken, access, logout]);
  const {
    data: user,
    isValidating: loading,
    mutate,
  } = useSWR<UserType | null | undefined>(key, fetch, config);
  return {
    user,
    loading,
    mutate,
    accessToken,
    refreshToken,
    refreshTokenKey,
    setAccessToken,
    setRefreshToken,
    refreshAccessToken,
    logout,
    isAccessTokenValid,
    userClaims,
  };
};
