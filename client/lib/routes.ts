import qs from "query-string";

export const externalApiRoutes = {
  signup: () => "/api/users/signup",
};

export const internalApiRoutes = {
  currentUser: () => "/api/users/currentuser",
};

export const clientRoutes = {
  landing: () => "/",
  signup: () => "/auth/signup",
  signin: () => "/auth/signin",
  home: () => "/home",
  error: (statusCode?: string | number, message?: string) =>
    qs.stringifyUrl(
      {
        url: "/error",
        query: { statusCode, message },
      },
      { skipEmptyString: true, skipNull: true }
    ),
};
