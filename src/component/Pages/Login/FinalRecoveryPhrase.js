import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  Box,
  TextField,
  Grid,
  Button,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import { FileCopy, VisibilityOff } from "@mui/icons-material";
import styled from "styled-components";
import mundom_logo from "../Assets/mundom_logo.png";
import { useNavigate } from "react-router-dom";
import userStore from "../../../store/userstore";

const NavHeader = styled(AppBar)`
  background: rgb(27, 77, 35);
  background: radial-gradient(
    circle,
    rgba(27, 77, 35, 1) 0%,
    rgba(26, 74, 34, 1) 67%,
    rgba(0, 0, 2, 1) 99%
  );
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const FinalRecoveryPhrase = () => {
  const navigate = useNavigate();
  const [mnemonicCode, setMnemonicCode] = useState([]);
  const [mnemonicFetched, setMnemonicFetched] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const mnemonicArray = userStore((state) => state.mnemonicArray);
  console.log("mnemonic array value is ", mnemonicArray);

  useEffect(() => {
    if (!mnemonicFetched && mnemonicArray && mnemonicArray.length > 0) {
      setMnemonicCode(mnemonicArray[0]);
      setMnemonicFetched(true);
    }
  }, [mnemonicArray, mnemonicFetched]);

  const copyMnemonicToClipboard = () => {
    const mnemonicText = mnemonicCode.join(" ");
    const textArea = document.createElement("textarea");
    textArea.value = mnemonicText;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand("copy");
    document.body.removeChild(textArea);

    setSnackbarMessage("Mnemonic copied successfully");
    setSnackbarOpen(true);

    setTimeout(() => {
      setSnackbarOpen(false);
    }, 2000);
  };

  const handleFinalRecoveryPhrase = () => {
    navigate("/auth/confirmMnemonicPhrase");
  };

  return (
    <div>
      <NavHeader position="static">
        <Toolbar>
          <a href="#">
            <img
              src={mundom_logo}
              width="53"
              height="53"
              alt=""
              className="logo-abbr"
            />
          </a>
        </Toolbar>
      </NavHeader>

      <ContentBody className="ml-3">
        <Container>
          <div className="row">
            <div className="col-xl-12 mt-5">
              <div className="d-flex align-items-center justify-content-between flex-column">
                <div className="d-flex me-3 ms-2 text-center">
                  <div
                    className="header-info ms-3 d-flex flex-column mt-8"
                    style={{ marginLeft: "40px" }}
                  >
                    <Typography
                      variant="h4"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Write Down Your Secret <br />
                      Recovery Phrase
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black"
                      sx={{
                        marginTop: "20px",
                        fontFamily: "Roboto Slab",
                        fontWeight: "400",
                      }}
                    >
                      Write down this 12-word Secret Recovery Phrase and save it
                      in <br />a place that you trust and only you can access.
                    </Typography>
                  </div>
                </div>

                <ImageContainer>
                  <img src={mundom_logo} alt="icon" width="80" />
                </ImageContainer>

                <Grid container justifyContent="center" alignItems="center">
                  <Grid
                    container
                    spacing={2}
                    className="mt-3"
                    item
                    xs={12}
                    md={8}
                  >
                    {Array.from({ length: 12 }).map((_, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <TextField
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={mnemonicCode[index] || []} // Display the mnemonic value here
                          InputProps={{ readOnly: true }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                  }}
                >
                  <div style={{ display: "flex", gap: "70px" }}>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Copy to Clipboard">
                        <IconButton
                          size="large"
                          sx={{ color: "#1B4D23" }}
                          onClick={copyMnemonicToClipboard}
                        >
                          <FileCopy />
                        </IconButton>
                      </Tooltip>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Roboto Slab", fontWeight: "700" }}
                      >
                        Copy to clipboard
                      </Typography>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="Hide Secret Phrase">
                        <IconButton size="large" sx={{ color: "#1B4D23" }}>
                          <VisibilityOff />
                        </IconButton>
                      </Tooltip>
                      <Typography
                        variant="body2"
                        sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                      >
                        Hide seed phrase
                      </Typography>
                    </div>
                  </div>
                </div>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    marginTop: "10px",
                    borderRadius: "10px",
                  }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    className="col-4"
                    onClick={handleFinalRecoveryPhrase}
                    sx={{
                      width: "30%",
                      background: "#1B4D23",
                      height: "50px",
                      fontFamily: "Roboto Slab",
                      fontWeight: "900",
                    }}
                    fullWidth
                  >
                    Next
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </Container>
      </ContentBody>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000} // Automatically close after 2 seconds (adjust as needed)
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          severity="success"
          sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default FinalRecoveryPhrase;
