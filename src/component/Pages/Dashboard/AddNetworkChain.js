import React, { useState,useEffect } from "react";
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

import AccountDetailsModal from "./AccountDetails";
import styled from "styled-components";
import userStore from "../../../store/userstore";

const ContentBody = styled.div`
  margin-left: 30px !important;
`;

const AddNetworkChain = ({ closeModal, isopen ,networkList,selctedNet,fetchBalance}) => {
  console.log(networkList);
  const [networkData, setNetworkData] = useState({
    chainId: parseInt(0),
    network: "",
    symbol: "",
    rpcUrl: "",
  });
  const [isNetworkCreated, setIsNetworkCreated] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");

  const addNetwork = userStore((state) => state.addNetwork);

  const handleAddNetwork = async (e) => {
    e.preventDefault();
    try {
      const result = await addNetwork(
      networkData);
      
      if (!result) {
        alert("Network is not added");
      }else if(result){
        setIsNetworkCreated(true);
      setCreationMessage("Network added successfully");
      }
      
    } catch (error) { 
      setIsNetworkCreated(false);
      setCreationMessage("Error adding the Network.");
      console.log("error occurred:", error);
    }
  };
  const handleCloseModal = () => {
    closeModal();
    setIsNetworkCreated(false);
    setCreationMessage("");
  };
  useEffect(() => {
    if (isNetworkCreated) {
      setTimeout(() => {
        handleCloseModal();
      }, 1000); 
      fetchBalance();
    }
  }, [isNetworkCreated,networkList,selctedNet]);

  return (
    <>
      <Dialog open={isopen} onClose={closeModal} maxWidth="sm" fullWidth>
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
                          Add Network
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
                          <TextField
                            type="text"
                            label="Network Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={networkData.network}
                            onChange={(e) =>
                              setNetworkData({
                                ...networkData,
                                network: e.target.value,
                              })
                            }
                          />

                          <TextField
                            type="text"
                            label="New RPC URL"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={networkData.rpcUrl}
                            onChange={(e) =>
                              setNetworkData({
                                ...networkData,
                                rpcUrl: e.target.value,
                              })
                            }
                          />

                          <TextField
                            type="text"
                            label="Chain ID"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={networkData.chainId}
                            onChange={(e) =>
                              setNetworkData({
                                ...networkData,
                                chainId: parseInt(e.target.value),
                              })
                            }
                          />

                          <TextField
                            type="text"
                            label="Currency Symbol"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={networkData.symbol}
                            onChange={(e) =>
                              setNetworkData({
                                ...networkData,
                                symbol: e.target.value.toUpperCase(),
                              })
                            }
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
                              fullWidth
                              onClick={closeModal}
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
                              onClick={handleAddNetwork}
                            >
                              Save
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

export default AddNetworkChain;
