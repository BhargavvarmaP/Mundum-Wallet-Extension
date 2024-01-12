import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Grid,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import QRCode from "qrcode.react";

import styled from "styled-components";
import mundom_logo from "../Assets/mundom_logo.png";
import qrcode from "../Assets/qrcode.jpg";
import { FileCopy } from "@mui/icons-material";

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

const ImageContainerQrcode = styled.div`
  display: flex;
  justify-content: center;
  width: 150;
  height: 290;
`;

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const AccountDetails = () => {
  const [providerAddress, setProviderAddress] = useState("GauravKumar");
  const [privateKeyValue,setPrivatekeyValue]=useState("t62176516sgjdhygsydgyws"); 
  const [isCopied, setIsCopied] = useState(false);
  const [showPrivateKeyInput, setShowPrivateKeyInput] = useState(false);
  const [showCopyDoneButtons, setShowCopyDoneButtons] = useState(false);
  const [privateKey, setPrivateKey] = useState("");
  const [password, setPassword] = useState("");

  const handleCopyProviderAddress = () => {
    navigator.clipboard.writeText(providerAddress);
    setIsCopied(true);
  };

  const handlePrivateKeyAddress=()=>{
    navigator.clipboard.writeText(privateKeyValue)
    setIsCopied(true);

  }

  const handleShowPrivateKey = () => {
    setShowPrivateKeyInput(true);
  };

  const handleCancel = () => {
    setShowPrivateKeyInput(false);
    setShowCopyDoneButtons(false);
    setPrivateKey("");
    setPassword("");
  };

  const handleConfirm = () => {
    setShowPrivateKeyInput(false);
    setShowCopyDoneButtons(true);
  };

  const handleCopyPrivateKey = () => {
    navigator.clipboard.writeText(privateKey);
    setIsCopied(true);
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
                      className="font-w600"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                       Account
                    </Typography>
                    <Typography
                      variant="h6"
                      className="font-w600"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      Make sure you trust a token before you import it. Learn how
                      <br />to avoid token
                       Settings
                    </Typography>

                    <ImageContainer>
                      <img src={mundom_logo} alt="icon" width="80" />
                    </ImageContainer>

                    <ImageContainerQrcode>
                      <QRCode value={providerAddress} size={128}/> 
                    </ImageContainerQrcode>
                  </div>
                </div>

                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {!showPrivateKeyInput && !showCopyDoneButtons ? (
                        <div>
                          <TextField
                            type="text"
                            label="Provider address"
                            value={providerAddress}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                              endAdornment: (
                                <Tooltip
                                  title={isCopied ? "Copied" : "Copy to Clipboard"}
                                >
                                  <IconButton
                                    onClick={handleCopyProviderAddress}
                                    size="large"
                                    sx={{
                                      color: isCopied ? "success.main" : "#1B4D23",
                                    }}
                                  >
                                    <FileCopy />
                                  </IconButton>
                                </Tooltip>
                              ),
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                              borderRadius: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              className="col-6"
                              sx={{
                                width: "100%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              onClick={handleShowPrivateKey}
                            >
                              Show Private Key
                            </Button>
                          </Box>
                        </div>
                      ) : showPrivateKeyInput ? (
                        <div>
                          <TextField
                            type="password"
                            label="Enter Your Password"
                            value={password}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            onChange={(e) => setPassword(e.target.value)}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                              borderRadius: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              className="col-4"
                              sx={{
                                width: "50%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              onClick={handleCancel}
                            >
                              Cancel
                            </Button>

                            <Button
                              variant="contained"
                              className="col-4"
                              sx={{
                                width: "50%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                              }}
                              onClick={handleConfirm}
                            >
                              Confirm
                            </Button>
                          </Box>
                        </div>
                      ) : showCopyDoneButtons ? (
                        <div>
                          <TextField
                            type="text"
                            label="Private Key"
                            value={privateKeyValue}
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                              endAdornment: (
                                <Tooltip
                                  title={isCopied ? "Copied" : "Copy to Clipboard"}
                                >
                                  <IconButton
                                    onClick={handlePrivateKeyAddress}
                                    size="large"
                                    sx={{
                                      color: isCopied ? "success.main" : "#1B4D23",
                                    }}
                                  >
                                    <FileCopy />
                                  </IconButton>
                                </Tooltip>
                              ),
                            }}
                          />

                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                              borderRadius: "10px",
                            }}
                          >
                            <Button
                              variant="contained"
                              className="col-4"
                              sx={{
                                width: "50%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              onClick={handleCopyPrivateKey}
                            >
                              Copy
                            </Button>

                            <Button
                              variant="contained"
                              className="col-4"
                              sx={{
                                width: "50%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                              }}
                              onClick={handleCancel}
                            >
                              Done
                            </Button>
                          </Box>
                        </div>
                      ) : null}
                    </Box>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Container>
      </ContentBody>
    </div>
  );
};

export default AccountDetails;
