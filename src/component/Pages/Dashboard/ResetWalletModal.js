import React, { useState } from "react";
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
import { useNavigate } from "react-router-dom";


const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const ResetWalletModal = ({isClosed,isopen}) => {

    const navigate=useNavigate();

    const resetWallet=userStore((state)=>state.resetWallet);
    
    const handleRestWallet= async ()=>{
       await resetWallet();
        navigate("/auth/register");
    }

  return (
    <>
      <Dialog open={isopen} onClose={isClosed} maxWidth="sm" fullWidth>
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
                      variant="body1"
                      className="text-center text-black h5"
                      sx={{
                        marginTop: "20px",
                        fontFamily: "Roboto Slab",
                        fontWeight: "400",
                      }}
                    >
                      Are You Confirm to Reset The Wallet?
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
                              onClick={isClosed}
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
                              onClick={handleRestWallet}
                              fullWidth
                              
                            >
                              Confirm
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
    </>
  );
};

export default ResetWalletModal;
