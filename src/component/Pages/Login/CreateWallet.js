import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Button,
  Checkbox,
  FormControlLabel,
  Box, // Import Box from MUI for layout
} from "@mui/material";
import styled from "styled-components"; // Import styled-components
import mundom_logo from "../Assets/mundom_logo.png";
import { useNavigate } from "react-router-dom";
import userStore from "../../../store/userstore";
import { dblClick } from "@testing-library/user-event/dist/click";

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

const CreateWalletBtn = styled(Button)`
  height: 50px;
  margin-bottom: "10px";
`;

const ImportWalletBtn = styled(Button)`
  height: 50px;
  /* Add your Tailwind CSS styles here */
`;

const ImportExistingWalletBtn = styled(ImportWalletBtn)`
  /* Add margin-top to the button */
  color: "red";
  @media (max-width: 768px) {
    margin-top: 3rem;
  }
`;

const FontW600 = styled.div`
  /* Add your Tailwind CSS styles here */
`;

// Define a styled component for the image container
const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

// Define a styled component for the button container
const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 45%;
  margin-top: 1rem; // Adjust the margin as needed

  @media (max-width: 768px) {
    width: 100%;
    flex-direction: column; // Change to column layout on smaller screens
    align-items: center; // Center-align items on smaller screens
  }
`;

function CreateWallet() {
  const navigate = useNavigate();
  const [termsAgreed, setTermsAgreed] = useState(false);

  const addhadwallet = userStore((state) => state.addhadwallet);
 const hadwallet=userStore((state)=>state.hadwallet);
 console.log(hadwallet);

  const handleCreateWalletClick = async () => {
    const result= await addhadwallet();

    if (result) {
      
      navigate("/auth/createWalletPassword");
    } else {

      navigate("/auth/login");
    }
    
  };

  const handleImportWalletClick = () => {
    navigate("existingImportWallet");
  };

  const handleTermsCheckboxChange = (event) => {
    setTermsAgreed(event.target.checked);
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

      <ContentBody className="ml-3">
        <Container>
          <div className="row">
            <div className="col-xl-12 mt-5">
              <div className="d-flex align-items-center justify-content-between flex-column">
                <div className="d-flex me-3 ms-2 text-center">
                  <div
                    className={`header-info ms-3 d-flex flex-column ${FontW600}`}
                  >
                    <Typography
                      variant="h2"
                      sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                    >
                      Let's get started
                    </Typography>
                    <Typography
                      variant="h5"
                      className="text-center text-black h5"
                      sx={{
                        marginTop: "20px",
                        fontFamily: "Roboto Slab",
                        fontWeight: "700",
                      }}
                    >
                      Trusted by millions Mundum is a secure wallet making the
                      world of web3 accessible to all.
                    </Typography>
                  </div>
                </div>

                <ImageContainer>
                  <img src={mundom_logo} alt="icon" width="80" />
                </ImageContainer>

                <div className="col-xl-6 col-lg-6 mt-5">
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <ButtonContainer>
                      {" "}
                      <Box mb={3}>
                        <CreateWalletBtn
                          type="submit"
                          variant="contained"
                          color="primary"
                          className={`btn btn-primary col-6 font-sans `}
                          onClick={handleCreateWalletClick}
                          disabled={!termsAgreed}
                        >
                          <Box
                            className="text-black"
                            sx={{
                              fontFamily: "Roboto Slab",
                              fontWeight: "700",
                            }}
                          >
                            Create a new wallet
                          </Box>
                        </CreateWalletBtn>
                      </Box>
                      <ImportExistingWalletBtn
                        type="submit"
                        variant="contained"
                        color="secondary"
                        className={`btn btn-secondary col-6`}
                        onClick={handleImportWalletClick}
                        disabled={!termsAgreed}
                      >
                        <Box
                          className="text-white"
                          sx={{ fontFamily: "Roboto Slab", fontWeight: "700" }}
                        >
                          Import an existing wallet
                        </Box>
                      </ImportExistingWalletBtn>
                    </ButtonContainer>

                    <div className="d-flex justify-content-center w-100 mt-4">
                      <FormControlLabel
                        control={
                          <Checkbox
                            className="form-check-input"
                            onChange={handleTermsCheckboxChange}
                            checked={termsAgreed}
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
                            I agree to the <a href="#">Terms of Use</a>
                          </Typography>
                        }
                      />
                    </div>
                  </Box>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </ContentBody>
    </div>
  );
}

export default CreateWallet;
