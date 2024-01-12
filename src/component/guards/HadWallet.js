import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
// routes
import userStore from "../../store/userstore";

// ----------------------------------------------------------------------

GuestGuard.propTypes = {
  children: PropTypes.node,
};

export default function GuestGuard({ children }) {
  const hadwallet = localStorage.getItem("hadwallet");

  if (!hadwallet) {
    return <Navigate to="/auth/register" />;
  }
  return <>{children}</>;
}
