import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUserStore } from "@/stores/userStore";
import { useShallow } from "zustand/shallow";

interface PrivateRouteProps {
  redirectTo?: string;
}

/**
 * A private route component that checks authentication via Zustand store.
 *
 * @param redirectTo - The route to redirect unauthenticated users to. Defaults to "/login".
 */
const PrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = "/auth" }) => {
  // Get the `auth.hid` from Zustand store
  const { auth } = useUserStore(
    useShallow((state) => ({
      auth: state.auth,
    }))
  );

  // Check if `auth.hid` exists
  const isAuthenticated = Boolean(auth?.hid);

  return isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};



/**
 * A private route component that checks authentication via Zustand store.
 *
 * @param redirectTo - The route to redirect authenticated users out of auth urls. Defaults to "/".
 */
export const InversePrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = "/auth" }) => {
  // Get the `auth.hid` from Zustand store
  const { auth } = useUserStore(
    useShallow((state) => ({
      auth: state.auth,
    }))
  );

  // Check if `auth.hid` exists
  const isAuthenticated = Boolean(auth?.hid);

  return !isAuthenticated ? <Outlet /> : <Navigate to={redirectTo} />;
};




/**
 * A private route component that checks authentication via Zustand store.
 *
 * @param redirectTo - The route to redirect authenticated users out of auth urls. Defaults to "/".
 */
export const OnBoardPrivateRoute: React.FC<PrivateRouteProps> = ({ redirectTo = "/onboarding" }) => {
  // Get the `auth.hid` from Zustand store
  const { auth } = useUserStore(
    useShallow((state) => ({
      auth: state.auth,
    }))
  );

  // Check if `auth.hid` exists
  const isAuthenticated = Boolean(auth?.hid);
  const accepted_terms = Boolean(auth?.accepted_terms);

  return isAuthenticated && !accepted_terms ? <Navigate to={redirectTo} />: <Outlet />;
};



export default PrivateRoute;
