import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Grid,
  Button,
} from "@mui/material";
import styled from "styled-components";
import mundom_logo from "../Assets/mundom_logo.png";
import { Link } from "react-router-dom";
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

const CreateWalletPassword = () => {
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [termsAgreementError, setTermsAgreementError] = useState("");

  const generatePassword = userStore((state) => state.generatePassword);

    const gethadwallet=userStore((state)=>state.gethadwallet);


  const handleCreateNewWallet = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (newPassword !== confirmPassword) {
      setPasswordMatchError("Passwords do not match");
      return;
    } else {
      setPasswordMatchError(""); // Clear the error if passwords match
    }

    // Checking  if terms are agreed @@@@@@@@@@@@@@@
    if (!agreeToTerms) {
      setTermsAgreementError("You must agree to the Terms of Use");
      return;
    } else {
      setTermsAgreementError(""); // Clear the error if terms are agreed
    }

    try {
      const hadWallet=await gethadwallet();
      if(hadWallet){
        navigate("/dashboard");

      }else{
        const result = await generatePassword(newPassword);
      if (!result) {
        alert("not able to generate new password");
      }
      navigate("/auth/secureWallet");

      }
      
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    }
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
                    <ImageContainer>
                      <img src={mundom_logo} alt="icon" width="80" />
                    </ImageContainer>

                    <Typography
                      variant="h4"
                      className="font-w600"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Create Password
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{
                        marginTop: "20px",
                        fontFamily: "Roboto Slab",
                        fontWeight: "700",
                      }}
                    >
                      This password will unlock your Mundum only on this device.
                      Mundum cannot recover this password.
                    </Typography>
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
                      <form onSubmit={handleCreateNewWallet}>
                        <TextField
                          type="password"
                          label="New Password"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <TextField
                          type="password"
                          label="Confirm Password"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        {passwordMatchError && (
                          <Typography
                            variant="body1"
                            color="error"
                            sx={{
                              marginTop: "10px",
                              fontFamily: "Roboto Slab",
                              fontWeight: "700",
                            }}
                          >
                            {passwordMatchError}
                          </Typography>
                        )}

                        <FormControlLabel
                          control={
                            <Checkbox
                              checked={agreeToTerms}
                              onChange={(e) =>
                                setAgreeToTerms(e.target.checked)
                              }
                              required
                            />
                          }
                          label={
                            <Typography
                              variant="body1"
                              sx={{
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                              }}
                            >
                              I agree to the <Link to="#">Terms of Use</Link>
                            </Typography>
                          }
                        />
                        {termsAgreementError && (
                          <Typography
                            variant="body1"
                            color="error"
                            sx={{
                              marginTop: "10px",
                              fontFamily: "Roboto Slab",
                              fontWeight: "700",
                            }}
                          >
                            {termsAgreementError}
                          </Typography>
                        )}

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
                            className="col-6"
                            sx={{
                              width: "50%",
                              background: "#1B4D23",
                              height: "50px",
                              fontFamily: "Roboto Slab",
                              fontWeight: "700",
                            }}
                            fullWidth
                          >
                            Create a new Wallet
                          </Button>
                        </Box>
                      </form>
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

export default CreateWalletPassword;
