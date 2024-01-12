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
import userStore from "../../../store/userstore";
import LoadingScreen from "../Loading/LoadingScreen";

import styled from "styled-components";

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SendImportToken = ({ handleClosed, handleopen, tokens, accountAddr, chainId }) => {
  const [recipientAddress, setRecipientAddress] = useState("");
  const [amountValue, setAmountValue] = useState("");

  const [loadingScreen, setLoadingScreen] = useState(false);

  const transferERC20Tokens = userStore((state) => state.transferERC20Tokens);

  const handleTransferErc20Token = async () => {
    try {

      setLoadingScreen(true); // Show loading screen

      const result = await transferERC20Tokens(
        recipientAddress,
        accountAddr,
        amountValue,
        tokens.tokenaddress,
        chainId
      );
      

      console.log(result);

    } catch (error) {
      console.error(error);

    } finally {
      setLoadingScreen(false); // Hide loading screen
      handleClosed();
    }
  };

  return (
    <>
    
      <Dialog open={handleopen} onClose={handleClosed} maxWidth="sm">
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
                          Send Token
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
                            label="Enter Your Recipient Address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={recipientAddress}
                            onChange={(e) => setRecipientAddress(e.target.value)}
                            required
                          />
                          <TextField
                            type="text"
                            variant="outlined"
                            value={tokens.tokensymbol}
                            fullWidth
                            margin="normal"
                            required
                          />
                          <TextField
                            type="number"
                            label="Enter Your Amount"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={amountValue}
                            onChange={(e) => setAmountValue(e.target.value)}
                            required
                          />

                          {loadingScreen && <LoadingScreen />}
                          
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
                              onClick={handleClosed}
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
                              onClick={handleTransferErc20Token}
                              fullWidth
                            >
                              Send
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

export default SendImportToken;
