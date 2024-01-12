import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
// routes
import userStore from "../../store/userstore";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const isAuthenticated = userStore((state) => state.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="dashboard" />;
  }

  return <>{children}</>;
}
