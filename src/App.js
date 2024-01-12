import React from "react";
import Router from "./component/routes";

import "./Dashboard.css"; // Import the CSS file

function App() {
  return <Router />;
}

export default App;
// // App.js or your main application file
// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import CreateWallet from "./component/Pages/Login/CreateWallet";
// import CreateWalletPassword from "./component/Pages/Login/CreateWalletPassword";
// import FinalRecoveryPhrase from "./component/Pages/Login/FinalRecoveryPhrase";
// import ConfirmRecoveryPhrase from "./component/Pages/Login/ConfirmMnemonicPhrase";
// import AddAccount from "./component/Pages/OtherPages/AddAccount";
// import AddNetwork from "./component/Pages/OtherPages/AddNetwork";
// import ImportAccount from "./component/Pages/OtherPages/ImportAccount";
// import LoginPage from "./component/Pages/OtherPages/LoginPage";
// import ImportToken from "./component/Pages/OtherPages/ImportToken";
// import ExistingImportWallet from "./component/Pages/OtherPages/ExistingImportWallet";
// import ForgetPassword from "./component/Pages/OtherPages/ForgetPassword";
// import AccountDetails from "./component/Pages/OtherPages/AccountDetails";
// import IntroRevealMnemonic from "./component/Pages/Login/IntroRevealMnemonic";
// import Dashboard from "./component/Pages/Dashboard";
// import SecureWallet from "./component/Pages/Login/SecureWallet";
// import "./Dashboard.css"; // Import the CSS file
// import userStore from "./store/userstore";

// function App() {
//   const isAuthenticated = userStore((state) => state.isAuthenticated);
//   return (
//     <Router>
//       <Routes>
//         <Route path="/" element={<CreateWallet />} />
//         <Route
//           path="/createWalletPassword"
//           element={<CreateWalletPassword />}
//         />
//         <Route path="/finalRecoveryPhrase" element={<FinalRecoveryPhrase />} />
//         <Route path="/introRevelMnemonic" element={<IntroRevealMnemonic />} />
//         <Route
//           path="/confirmMnemonicPhrase"
//           element={<ConfirmRecoveryPhrase />}
//         />
//         <Route path="/addAccount" element={<AddAccount />} />
//         <Route path="/addNetwork" element={<AddNetwork />} />
//         <Route path="/importAccount" element={<ImportAccount />} />
//         <Route path="/loginPage" element={<LoginPage />} />
//         <Route path="/importToken" element={<ImportToken />} />
//         <Route
//           path="/existingImportWallet"
//           element={<ExistingImportWallet />}
//         />
//         <Route path="/forgetPassword" element={<ForgetPassword />} />
//         <Route path="/accountDetails" element={<AccountDetails />} />
//         <Route path="/secureWallet" element={<SecureWallet />} />
//         <Route
//           path="/dashboard"
//           element={<Dashboard isAuthenticated={isAuthenticated} />}
//         />{" "}
//       </Routes>
//     </Router>
//   );
// }

// export default App;
