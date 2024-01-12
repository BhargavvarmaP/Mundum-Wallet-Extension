import React, { useState, useEffect } from "react";
import {
  // ... (other imports)
  CircularProgress,
  Dialog,
  DialogContent,
  Box,
  Button,
  TextField,
  Typography,
  Grid,
  Container,
  Card,
  CardContent,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import SendIcon from "@mui/icons-material/Send";
import TimelineIcon from "@mui/icons-material/Timeline";
import styled from "styled-components";
import Fab from "@mui/material/Fab";
import userStore from "../../../store/userstore";
import LoadingScreen from "../Loading/LoadingScreen";

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const IconGrid = ({ chainID, accountss, symbol, selectedacc }) => {
  const estimateGas = userStore((state) => state.estimateGas);
  const transferFunds = userStore((state) => state.transferFunds);
  const [openSendModal, setOpenSendModal] = useState(false);
  const [recipentAddress, setResipentAddress] = useState("");
  const [amountValue, setAmountValue] = useState(parseFloat(0));

  const [getCurrentBalance,setGetCurrentBalance]=useState(parseFloat(0));

  console.log(amountValue);

  const [estimatedGas, setEstimatedGas] = useState();
  const [amountWithGas, setAmountWithGas] = useState(0.000021);

  const [loadingScreen, setLoadingScreen] = useState(false);

  const txactivity = userStore((state) => state.txactivity);
  const getBalance=userStore((state)=>state.getBalance);

  const [creationfundMessage, setCreationFundMessage] = useState("");


  const handleSend = async () => {
    const account = {
      address: accountss.address[selectedacc],
      privateKey: accountss.privateKey[selectedacc],
    };

    setLoadingScreen(true); // Show loading screen

    try {
      const result = await transferFunds(
        account,
        recipentAddress,
        amountValue,
        symbol,
        chainID
      );
      console.log(result);

      const txResult = await txactivity(
        result,
        accountss.address[selectedacc],
        chainID
      );

      if (!txResult) {
        alert("Transaction activity not found");
      }else if(txResult){
        
          setGetCurrentBalance(await getBalance(chainID,accountss?.address[selectedacc]));

      }
      setResipentAddress("");
      setAmountValue(parseFloat(0));
      handleCloseModal();
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingScreen(false); // Hide loading screen
    }
  };

  const handleEstimateGas = async (recipentAddress,chainID,amountValue) => {
    console.log("helokj");
    try {
      const account = {
        address: accountss.address[selectedacc],
        privateKey: accountss.privateKey[selectedacc],
      };

      if(amountValue > getCurrentBalance){
        console.log("hjsgdhgjhgdjs");
        setCreationFundMessage( "Insufficient Funds");
  
      }else{
        setCreationFundMessage("");
      }
      const gas = await estimateGas(
        account,
        recipentAddress,
        amountValue,
        symbol,
        chainID
      );
      console.log(gas);
      const totalAmount = (parseFloat(amountValue) + parseFloat(gas)).toFixed(7);

      console.log(totalAmount);
      setAmountWithGas(totalAmount);
      setEstimatedGas(gas);
    } catch (error) {
      console.error(error);
      setEstimatedGas(null);
      

    }
  };
  console.log(getCurrentBalance);


  const handleGetCurrentBal=async()=>{
   
    setGetCurrentBalance(await  getBalance(chainID,accountss?.address[selectedacc]));
    console.log(getCurrentBalance);

  }

  useEffect(() => {

    if(chainID ){
      handleGetCurrentBal();
      console.log(chainID);
    }

    if (recipentAddress  && chainID && amountValue) {
      handleEstimateGas(recipentAddress,chainID,amountValue);      
    }
    else {
      setEstimatedGas(0.000021);
    }

    
         
  }, [recipentAddress, amountValue]);

  const handleOpenModal = () => {
    setOpenSendModal(true);
  };

  const handleCloseModal = () => {
    setOpenSendModal(false);
  };

  return (
    <>
      {loadingScreen ? (
        <LoadingScreen />
      ) : (
        <Grid container spacing={2} display="flex" className="center" mt={2}>
          <Grid item>
            <Box className="center flex-direction-column">
              <Fab size="medium" aria-label="add">
                <AddCircleIcon />
              </Fab>
              <Typography sx={{ textAlign: "center", marginTop: "5px" }}>
                Buy
              </Typography>
            </Box>
          </Grid>
          <Grid item>
            <Box
              className="center flex-direction-column"
              onClick={() => {
                handleOpenModal();
              }}
            >
              <Fab size="medium" aria-label="add">
                <SendIcon />
              </Fab>
              <Typography sx={{ textAlign: "center", marginTop: "5px" }}>
                Send
              </Typography>
            </Box>
          </Grid>

          <Grid item>
            <Box className="center flex-direction-column">
              <Fab size="medium" aria-label="add">
                <TimelineIcon />
              </Fab>
              <Typography sx={{ textAlign: "center", marginTop: "5px" }}>
                Portfolio
              </Typography>
            </Box>
          </Grid>
          <Dialog
            open={openSendModal}
            onClose={handleCloseModal}
            maxWidth="sm"
            fullWidth
          >
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
                              sx={{
                                fontFamily: "Roboto Slab",
                                fontWeight: "900",
                              }}
                            >
                              Send
                            </Typography>
                          </div>
                        </div>

                        <Grid
                          container
                          justifyContent="center"
                          alignItems="center"
                        >
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
                                required
                                value={recipentAddress}
                                onChange={(e) =>
                                  setResipentAddress(e.target.value)
                                }
                              />
                              <TextField
                                type="text"
                                label="Asset"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={symbol}
                                
                              />

                              <TextField
                                type="number"
                                label="Enter Your Amount"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                required
                                value={amountValue}
                                onChange={(e) => setAmountValue(e.target.value)}
                              />
                              <Typography sx={{color:"red",marginBottom:"5px",marginTop:"5px"}}>{creationfundMessage}</Typography>
                              

                              {/* Display estimated gas and///or total amount */}
                              <Card>
                              <CardContent>
                                <Grid container spacing={2}>
                                  <Grid item xs={6}>
                                    <Typography variant="h6" sx={{fontFamily: "Roboto Slab",fontWeight: "100"}}>Estimate Gas</Typography>
                                    <Typography>
                                      {estimatedGas}
                                    </Typography>
                                  </Grid>
                                  <Grid item xs={6}>
                                    <Typography variant="h6" sx={{fontFamily: "Roboto Slab",fontWeight: "200",}}>Amount</Typography>
                                    <Typography>
                                      {amountWithGas}
                                    </Typography>
                                  </Grid>
                                </Grid>
                              </CardContent>
                            </Card>
                            

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
                                  onClick={handleCloseModal}
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
                                  onClick={handleSend}
                                  disabled={parseFloat(amountValue) > getCurrentBalance}
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
        </Grid>
      )}
    </>
  );
};

export default IconGrid;
