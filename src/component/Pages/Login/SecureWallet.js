import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  Box,
  Checkbox,
  TextField,
  Grid,
  Button, // Import Button from Material-UI
} from "@mui/material";
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

const SecureWallet = () => {
  const navigate = useNavigate();

  const handleSecureMYwallet=()=>{
    navigate("/auth/introRevelMnemonic")
  }


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
                    <ImageContainer>
                      <img src={mundom_logo} alt="icon" width="80" />
                    </ImageContainer>
                    <Typography
                      variant="h4"
                      className="font-bold"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Secure Your Wallet
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{
                        fontFamily: "Roboto Slab",
                        fontWeight: "900",
                        marginTop: "10px",
                      }}
                    >
                      What is a Secret Recovery Phrase?
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      Your 12-word recovery phrase is your only way to recover
                      your wallet and your funds.
                      <br /> If you lose your recovery phrase, you will lose
                      access to your wallet and your funds forever.
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{
                        fontFamily: "Roboto Slab",
                        fontWeight: "900",
                        marginTop: "10px",
                      }}
                    >
                      Should I share my Secret Recovery Phrase?
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      No, you should never share your secret recovery phrase
                      with anyone. Your secret <br/> recovery phrase is the most
                      important piece of information related to your <br/>Web3
                      wallet. It is the only way to recover your wallet and your
                      funds <br/> if you ever lose your password or forget your PIN.
                    </Typography>
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
                    className="col-3"
                    sx={{
                      width: "40%",
                      background: "#1B4D23",
                      height: "50px",
                      fontFamily: "Roboto Slab",
                      fontWeight: "900",
                      marginTop: "20px",
                    }}
                    onClick={handleSecureMYwallet}
                    fullWidth // Make the button take up full width
                  >
                    Secure My Wallet
                  </Button>
                </Box>
              </div>
            </div>
          </div>
        </Container>
      </ContentBody>
    </div>
  );
};

export default SecureWallet;
