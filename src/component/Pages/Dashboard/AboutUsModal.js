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
import mundom_logo from "../Assets/mundom_logo.png";

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;
const AboutUsModal = ({ isClosed, isopen }) => {
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
                        <ImageContainer>
                          <img src={mundom_logo} alt="icon" width="80" />
                        </ImageContainer>
                        <Typography
                          variant="h4"
                          className="font-w600"
                          sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}
                        >
                          About Us
                        </Typography>

                        <Typography
                          variant="body1"
                          className="text-center text-black h5"
                          sx={{
                            marginTop: "20px",
                            fontFamily: "Roboto Slab",
                            fontWeight: "400",
                          }}
                        >
                          Mundum Wallet is a secure cryptocurrency wallet
                          designed for users seeking ease of use and top-notch
                          security. Store, manage, and trade your digital assets
                          with confidence in this user-friendly wallet.
                        </Typography>
                      </div>
                    </div>
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

export default AboutUsModal;
