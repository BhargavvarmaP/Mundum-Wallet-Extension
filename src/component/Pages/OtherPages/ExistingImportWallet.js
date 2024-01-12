import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  TextField,
  Grid,
  Button, // Import Button from Material-UI
} from "@mui/material";
import styled from "styled-components";
import { useState } from "react";
import mundom_logo from "../Assets/mundom_logo.png";
import { Link } from "react-router-dom";
import userStore from "../../../store/userstore";
import { useNavigate } from "react-router-dom";

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

const ExistingImportWallet = () => {
  const [existingMnemonic, setExistingMnemonic] = useState([]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  const navigate = useNavigate();

  const importWallet = userStore((state) => state.importWallet);

  const updateUserMnemonic = (index, value) => {
    const updatedMnemonic = [...existingMnemonic];
    updatedMnemonic[index] = value;
    setExistingMnemonic(updatedMnemonic);
  };

  const handleImportWallet = async (e) => {
    try {
      e.preventDefault();
      if (newPassword !== confirmPassword) {
        setPasswordMatchError("Passwords do not match");
        return;
      } else {
        setPasswordMatchError(""); // Clear the error if passwords match
      }
      const mnemonic = existingMnemonic.join(" ");
      const result = await importWallet(mnemonic, newPassword);
      if (!result) {
        alert("Import Existing Wallet failed");
      }
      navigate("/dashboard");
    } catch (error) {
      console.log("error ajgshg%%%%%%%%%%", error);
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
                    className="header-info ms-3 d-flex flex-column"
                    style={{ marginLeft: "40px" }}
                  >
                    <Typography
                      variant="h4"
                      className="font-bold"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Enter Your Secret Recovery Phrase
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "700" }}
                    >
                      Enter Your 12 Word Secret Recovery Phrase
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
                          label={`Phrase ${index + 1}`}
                          variant="outlined"
                          fullWidth
                          borderRadius="30px"
                          margin="normal"
                          onChange={(e) =>
                            updateUserMnemonic(index, e.target.value)
                          }
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

                <Grid
                  container
                  justifyContent="center"
                  alignItems="center"
                  mb={4}
                >
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      <Box>
                        <Typography
                          sx={{
                            fontFamily: "Roboto Slab",
                            fontWeight: "900",
                            marginTop: "20px",
                            marginBottom: "20px",
                          }}
                        >
                          Create Password for Your Wallet
                        </Typography>
                      </Box>

                      <form>
                        <TextField
                          type="password"
                          label="New Password"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          required
                        />

                        <TextField
                          type="password"
                          label="Confirm Password"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required
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
                            onClick={handleImportWallet}
                          >
                            Confirm
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

export default ExistingImportWallet;
