import React, { useState } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SupportIcon from "@mui/icons-material/Support";
import SettingsIcon from "@mui/icons-material/Settings";
import LockIcon from "@mui/icons-material/Lock";
import ResetWalletModal from "./ResetWalletModal";
import AboutUsModal from "./AboutUsModal";
import { useNavigate } from "react-router-dom";
import userStore from "../../../store/userstore";
const MoreItems = ({ closeModal, title }) => {
  const [openResetWalletModal, setOpenResetWalletModal] = useState(false);
  const [openAboutUsModal, setOpenAboutUsModal] = useState(false);
  const navigate = useNavigate();
const exportDB = userStore((state)=>state.exportDB);
  const handleOpenResetWalletModal = () => {
    setOpenResetWalletModal(true);
  };

  const handleBackupWalletModal = async() => {
    await exportDB();
  };

  const handleOpenAboutUsModal = () => {
    setOpenAboutUsModal(true);
  };

  const handleLockWallet = () => {
    navigate("/auth/login");
  };

  return (
    <Paper sx={{ maxWidth: "500px", margin: "auto" }}>
      <List dense>
        <ListItem button onClick={handleOpenResetWalletModal}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="Reset wallet" />
        </ListItem>

        <ListItem button onClick={handleBackupWalletModal}>
          <ListItemIcon>
            <AssessmentIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="Backup wallet" />
        </ListItem>


        <ListItem button>
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="Notifications" />
        </ListItem>

        <ListItem button onClick={handleOpenAboutUsModal}>
          <ListItemIcon>
            <SupportIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="About Us" />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="Settings" />
        </ListItem>
        <ListItem button onClick={handleLockWallet}>
          <ListItemIcon>
            <LockIcon />
          </ListItemIcon>
          <ListItemText sx={{ marginRight: "10px" }} primary="Lock Wallet" />
        </ListItem>
      </List>

      {openResetWalletModal && (
        <ResetWalletModal
          isopen={openResetWalletModal}
          isClosed={() => setOpenResetWalletModal(false)}
        />
      )}

      {openAboutUsModal && (
        <AboutUsModal
          isopen={openAboutUsModal}
          isClosed={() => setOpenAboutUsModal(false)}
        />
      )}
    </Paper>
  );
};

export default MoreItems;
