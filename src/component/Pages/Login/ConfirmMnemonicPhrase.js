import React, { useState } from "react";
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

const ConfirmRecoveryPhrase = () => {
  const navigate = useNavigate();
  const generateNewWallet = userStore((state) => state.generateNewWallet);
  const setisAuthenticated = userStore((state) => state.setisAuthenticated);
  const [userMnemonic, setUserMnemonic] = useState(Array(12).fill(""));

  const sethadwallet = userStore((state) => state.sethadwallet);

  const updateUserMnemonic = (index, value) => {
    const updatedMnemonic = [...userMnemonic];
    updatedMnemonic[index] = value;
    setUserMnemonic(updatedMnemonic);
  };

  const handleGenerateWallet = async () => {
    try {
      const mnemonic = userMnemonic.join(" ");
      console.log(mnemonic);
      const result = await generateNewWallet(mnemonic);
      if (!result) {
        alert("Mnemonic not matched,need to setup again");
      } else if (result) {
        sethadwallet(true);
        setisAuthenticated(true);
        setTimeout(() => {
          navigate("/dashboard");
        }, 100);
      }
    } catch (error) {
      console.error("Error generating wallets:", error);
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const pastedText = clipboardData.getData("Text");
    const pastedWords = pastedText.split(/\s+/).filter((word) => word); // Split and filter out empty strings

    const updatedMnemonic = Array(12).fill("");
    pastedWords.slice(0, updatedMnemonic.length).forEach((word, index) => {
      updatedMnemonic[index] = word;
    });

    setUserMnemonic(updatedMnemonic);
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
                      Confirm Secret Mnemonic Phrase
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Why Confirm It?
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      Peace of Mind: Confirming ensures your phrase is correct,
                      protecting your assets.
                    </Typography>

                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      Recovery: It's your lifeline if you ever lose access to
                      your wallet.
                    </Typography>
                    <Typography
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "400" }}
                    >
                      Prevents Loss: Confirming now can prevent future
                      heartaches.
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
                    {/* Create 12 input fields in three columns */}
                    {userMnemonic.map((phrase, index) => (
                      <Grid item xs={6} sm={4} key={index}>
                        <TextField
                          label={`Phrase ${index + 1}`}
                          variant="outlined"
                          fullWidth
                          borderRadius="30px"
                          value={phrase}
                          onChange={(e) => {
                            const updatedMnemonic = [...userMnemonic];
                            updatedMnemonic[index] = e.target.value;
                            setUserMnemonic(updatedMnemonic);
                          }}
                          onPaste={handlePaste} // Handle paste event for all text fields
                          margin="normal"
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>

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
                    onClick={handleGenerateWallet}
                    sx={{ width: "30%", background: "#1B4D23", height: "50px" }}
                    fullWidth // Make the button take up full width
                  >
                    Next
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

export default ConfirmRecoveryPhrase;
