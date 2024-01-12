import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  TextField,
  Grid,
  Box, // Import Box from MUI for layout
} from "@mui/material";
import styled from "styled-components"; // Import styled-components
import mundom_logo from "../Assets/mundom_logo.png";
import reveal from "../Assets/reveal.png";
import userStore from "../../../store/userstore";
import { useNavigate } from "react-router-dom";


// Define styled components for your custom styles
const NavHeader = styled(AppBar)`
  background: rgb(27, 77, 35);
  background: radial-gradient(
    circle,
    rgba(27, 77, 35, 1) 0%,
    rgba(26, 74, 34, 1) 67%,
    rgba(0, 0, 2, 1) 99%
  );
`;

const ContentBody = styled.div`
  /* Add your Tailwind CSS styles here */
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const IntroRevealMnemonicBtn = styled(Button)`
  height: 50px;
  /* Add your Tailwind CSS styles here */
`;

const FontW600 = styled.div`
  /* Add your Tailwind CSS styles here */
`;

// Define a styled component for the image container
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const ImageContainerRevel = styled.div`
  display: flex;
  justify-content: center;
`;

// Define a styled component for the button container
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 40%;
  margin-top: 1rem; // Adjust the margin as needed

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column; // Change to column layout on smaller screens
    align-items: center; // Center-align items on smaller screens
  }
`;

function IntroRevealMnemonic() {
  const navigate = useNavigate();

  const generateMnemonic = userStore((state) => state.generateMnemonic);

  const handleGenerateMnemonic = async () => {
    try {
      const { result, mnemonic } = await generateMnemonic();
      console.log(result, mnemonic);

      
      navigate("/auth/finalRecoveryPhrase")
    } catch (error) {
      console.error("Error generating mnemonic:", error);
    }
  };

  return (
    <div>
      <NavHeader position="static">
        <Toolbar>
          <a href="#" className="brand-logo">
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

      <ContentBody className={`content-body ml-3`}>
        <Container>
          <div className="row">
            <div className="col-xl-12 mt-5">
              <div className="d-flex align-items-center justify-content-between flex-column">
                <div className="d-flex me-3 ms-2 text-center">
                  <div
                    className={`header-info ms-3 d-flex flex-column ${FontW600}`}
                  >
                    <ImageContainer>
                      <img src={mundom_logo} alt="icon" width="80" />
                    </ImageContainer>

                    <Typography sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}>Wallet Secret Recovery Phrase</Typography>
                    <Typography>
                      Write down this 12-word Secret Recovery Phrase and save it
                      in a place that you trust and only you can access.
                    </Typography>
                    <Typography sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}>Tips :</Typography>
                    <Typography>- Save in a passowrd manager</Typography>
                    <Typography>- Store in a safe deposit box</Typography>
                    <Typography>
                      - Write down and store in multiple secret places
                    </Typography>
                  </div>
                </div>

                <div className="col-xl-6 col-lg-6 mt-5">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                  <ImageContainerRevel>
                   <img src={reveal} alt="icon" width="260"  />
                  </ImageContainerRevel>                    
                  </Box>
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
                  className="col-6"
                  sx={{
                    width: "30%",
                    background: "#1B4D23",
                    height: "70px",
                    fontFamily: "Roboto Slab",
                    fontWeight: "700",
                    
                  }}
                  onClick={handleGenerateMnemonic}
                  fullWidth
                >
                  Intro Reveal Mnemonic
                </Button>
              </Box>
              </div>
            </div>
          </div>
        </Container>
      </ContentBody>
    </div>
  );
}

export default IntroRevealMnemonic;
