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
  Button, // Import Button from Material-UI
} from "@mui/material";
import styled from "styled-components";
import mundom_logo from "../Assets/mundom_logo.png";
import userStore from "../../../store/userstore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

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

const LoginPage = () => {
  const navigate = useNavigate();
  const [userPassword, setuserPassowrd] = useState("");
  const hadwallet = userStore((state) => state.hadwallet);
  
  const setisAuthenticated = userStore((state) => state.setisAuthenticated);

  const login = userStore((state) => state.login);

  const handleLoginpage = async (e) => {
    try {
      e.preventDefault();
      const result = await login(userPassword);
      if (result) {
        setisAuthenticated(true);
        navigate("/dashboard");
      } else {
        alert("password not match");
      }
    } catch (error) {
      console.log("Error:", error);
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
                      Welcome back!
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
                      The decentralized web awaits
                    </Typography>
                  </div>
                </div>

                <Grid container justifyContent="center" alignItems="center">
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        alignItems: "center",
                      }}
                    >
                      <form>
                        <TextField
                          type="password"
                          label="Enter Password"
                          variant="outlined"
                          fullWidth
                          margin="normal"
                          onChange={(e) => setuserPassowrd(e.target.value)}
                          required
                        />

                        <Box
                          sx={{
                            display: "column",
                            justifyContent: "center", // Center the button horizontally
                            marginTop: "10px", // Add some top margin
                            borderRadius: "10px",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              marginTop: "10px",
                            }}
                          >
                            <Button
                              type="submit"
                              variant="contained"
                              className="col-6"
                              sx={{
                                width: "40%",
                                background: "#1B4D23",
                                height: "50px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              fullWidth
                              onClick={handleLoginpage}
                            >
                              unlock
                            </Button>
                          </Box>
                          <Link to="/auth/forgetPassword">
                            <Typography
                              sx={{
                                display: "flex",
                                justifyContent: "center",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginTop: "20px",
                              }}
                            >
                              Forgot Password?
                            </Typography>
                          </Link>
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

export default LoginPage;
