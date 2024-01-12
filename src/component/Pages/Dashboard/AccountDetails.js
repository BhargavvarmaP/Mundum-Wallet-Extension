import React, { useState } from "react";
import {
  Modal,
  Typography,
  IconButton,
  Button,
  Box,
  TextField,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import QrCode from "qrcode.react";
import userStore from "../../../store/userstore";

const AccountDetailsModal = ({
  isOpen,
  onClose,
  accountName,
  address,
  privateKey,
}) => {
  console.log(isOpen);
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const validatepassword = userStore((state) => state.validatepassword);

  const handleShowPrivateKey = () => {
    setIsShowPassword(true);
  };

  const handleValidatePassword = async () => {
    console.log(password);
    const result = await validatepassword(password);
    console.log(result);
    // Validate the password (you can replace this logic with your own password validation logic)
    if (result) {
      setIsPasswordCorrect(true);
      console.log("Private Key:", privateKey);
    } else {
      setIsPasswordCorrect(false);
    }
  };

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="account-details-modal-title"
      aria-describedby="account-details-modal-description"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
          borderRadius: "8px",
          width: isMobile ? "80%" : "400px", // Adjust width for mobile devices
          textAlign: "center", // Center align text
        }}
      >
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <Typography variant="h6" id="account-details-modal-title">
          {accountName}
        </Typography>
        <Box display="flex" justifyContent="center" mt={4}>
          <QrCode value={address} style={{ height: "200px", width: "200px" }} />
        </Box>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center align child elements
            margin: "20px 0",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              wordWrap: "break-word",
              maxWidth: "-webkit-fill-available",
              margin: "0px 20px",
            }}
          >
            {address}
          </Typography>
          <IconButton
            onClick={() => {
              navigator.clipboard.writeText(address);
            }}
          >
            <FileCopyIcon />
          </IconButton>
        </div>

        {isShowPassword ? (
          <>
            <TextField
              label="Enter Password"
              type="password"
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              margin="normal"
              sx={{ marginBottom: "20px" }} // Add margin for mobile devices
            />
            <Button
              color="secondary"
              variant="outlined"
              onClick={handleValidatePassword}
            >
              Show Private Key
            </Button>
          </>
        ) : (
          <Button
            color="secondary"
            variant="outlined"
            onClick={handleShowPrivateKey}
            sx={{ marginBottom: "20px" }} // Add margin for mobile devices
          >
            Show Private Key
          </Button>
        )}

        {isPasswordCorrect && (
          <>
            <TextField
              label="Private Key:"
              type="text"
              aria-readonly
              variant="outlined"
              multiline
              fullWidth
              rows={2}
              value={privateKey}
              margin="normal"
              sx={{ marginBottom: "20px" }}
            />
          </>
        )}
      </div>
    </Modal>
  );
};

export default AccountDetailsModal;
