import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  Container,
  DialogContent,
  Dialog,
  Grid,
} from "@mui/material";
import styled from "styled-components";
import userStore from "../../../store/userstore";

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const AddAccountModal = ({ onClose, open,fetchAccount }) => {
  const [accountName, setAccountName] = useState("");

  const [isAccountCreated, setIsAccountCreated] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");
  
  const generateNewAccount = userStore((state) => state.generateNewAccount);

  const HandleCreatenewAccount = async (e) => {
    try {
      e.preventDefault();
      const result = await generateNewAccount(accountName);
      console.log(result);

      setIsAccountCreated(true);
      setCreationMessage("Account created successfully.");

      setAccountName("");
       

    } catch (error) {
      console.log(error);

      setIsAccountCreated(false);
      setCreationMessage("Error creating the account.");
    }
  };


  const handleCloseModal = () => {
    onClose();
    setIsAccountCreated(false);
    setCreationMessage("");
  };

  // useEffect to close the modal when isAccountCreated becomes true
  useEffect(() => {
    if (isAccountCreated) {
      setTimeout(() => {
        handleCloseModal();
      }, 1000); 
      fetchAccount();
    }
  }, [isAccountCreated]);

  return (
    <Dialog open={open} onClose={handleCloseModal} maxWidth="sm" fullWidth>
      <DialogContent>
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
                        Add Account
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
                          
                            <TextField
                              type="text"
                              label="Enter Account Name"
                              variant="outlined"
                              fullWidth
                              margin="normal"
                              required
                              value={accountName}
                              onChange={(e) => setAccountName(e.target.value)}
                            />
                            
                            <Typography sx={{color:"green"}}> 
                            {creationMessage}
                            
                            </Typography>


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
                                  width: "40%",
                                  background: "#1B4D23",
                                  height: "50px",
                                  fontFamily: "Roboto Slab",
                                  fontWeight: "700",
                                  marginRight: "10px",
                                }}
                                onClick={handleCloseModal}
                                fullWidth
                              >
                                Cancel
                              </Button>

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
                                }}
                                fullWidth
                                onClick={HandleCreatenewAccount}
                              >
                                Create
                              </Button>
                            </Box>
                        
                      </Box>
                    </Grid>
                  </Grid>
                </div>
              </div>
            </div>
          </Container>
        </ContentBody>
      </DialogContent>
    </Dialog>
  );
};

export default AddAccountModal;
