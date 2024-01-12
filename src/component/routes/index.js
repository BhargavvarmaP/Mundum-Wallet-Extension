import { Navigate, useRoutes } from "react-router-dom";
import GuestGuard from "../guards/GuestGuard";
import HadWallet from "../guards/HadWallet";
import AuthGuard from "../guards/AuthGuard";
import LoginPage from "../../component/Pages/OtherPages/LoginPage";
import Dashboard from "../../component/Pages/Dashboard";
import CreateWallet from "../../component/Pages/Login/CreateWallet";
import CreateWalletPassword from "../../component/Pages/Login/CreateWalletPassword";
import SecureWallet from "../../component/Pages/Login/SecureWallet";
import IntroRevealMnemonic from "../../component/Pages/Login/IntroRevealMnemonic";
import FinalRecoveryPhrase from "../../component/Pages/Login/FinalRecoveryPhrase";
import ConfirmMnemonicPhrase from "../../component/Pages/Login/ConfirmMnemonicPhrase";
import ForgetPassword from "../Pages/OtherPages/ForgetPassword";

// ----------------------------------------------------------------------

export default function Router() {  
  return useRoutes([
    {
      path: "/",
      element: (
        <AuthGuard>
          <Navigate to="/dashboard/app" replace />
        </AuthGuard>
      ),
    },
    {
      path: "/auth",
      children: [
        {
          path: "login",
          element: (
            <HadWallet>
              <LoginPage />
            </HadWallet>
          ),
        },
        {
          path: "register",
          element: (
            <GuestGuard>
              <CreateWallet />
            </GuestGuard>
          ),
        },

        {
          path: "createWalletPassword",
          element: (
            <GuestGuard>
              <CreateWalletPassword />
            </GuestGuard>
          ),
        },
        {
          path: "SecureWallet",
          element: (
            <GuestGuard>
              <SecureWallet />
            </GuestGuard>
          ),
        },
        {
          path: "introRevelMnemonic",
          element: (
            <GuestGuard>
              <IntroRevealMnemonic />
            </GuestGuard>
          ),
        },
        {
          path: "finalRecoveryPhrase",
          element: (
            <GuestGuard>
              <FinalRecoveryPhrase />
            </GuestGuard>
          ),
        },
        {
          path: "confirmMnemonicPhrase",
          element: (
            <GuestGuard>
              <ConfirmMnemonicPhrase />
            </GuestGuard>
          ),
        },
        {
          path: "forgetPassword",
          element: (
            <AuthGuard>
              <ForgetPassword />
            </AuthGuard>
          ),
        },
      ],
    },
    // Dashboard Routes
    {
      path: "dashboard",
      element: (
        <AuthGuard>
          <Dashboard />
        </AuthGuard>
      ),
      children: [{ path: "app", element: <Dashboard /> }],
    },
  
    { path: "*", element: <Navigate to="/404" replace /> },
  ]);
}
