import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Checkbox,
  FormControlLabel,
  TextField,
  Grid,
  Button, // Import Button from Material-UI
} from "@mui/material";
import styled from "styled-components";
import mundom_logo from "../Assets/mundom_logo.png";
import { Link } from "react-router-dom";
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

const AddNetwork = () => {
  const [networkData, setNetworkData] = useState({
    chainId: parseInt(0),
    network: "",
    symbol: "",
    rpcUrl: "",
  });

  const addNetwork = userStore((state) => state.addNetwork);

  const handleAddNetwork = async (e) => {
    e.preventDefault();
    try {
      const result = await addNetwork({...networkData,chainId: parseInt(networkData.chainId)});
      if(!result){
        alert("Network is not added");
      }
      console.log(result);
    } catch (error) {
      console.log("error occurred:", error);
    }
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
                      Add Network
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
                      Imported accounts won’t be associated with your Mundom
                      Secret Recovery Phrase. Learn more about imported accounts
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
                        value={networkData.network}
                        onChange={(e) =>
                          setNetworkData({
                            ...networkData,
                            network: e.target.value,
                          })
                        }
                        required
                      />

                      <TextField
                        type="text"
                        label="New RPC URL"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={networkData.rpcUrl}
                        onChange={(e) =>
                          setNetworkData({
                            ...networkData,
                            rpcUrl: e.target.value,
                          })
                        }
                        required
                      />

                      <TextField
                        type="text"
                        label="Chain ID"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={networkData.chainId}
                        onChange={(e) =>
                          setNetworkData({
                            ...networkData,
                            chainId: parseInt(e.target.value),
                          })
                        }
                        required
                      />

                      <TextField
                        type="text"
                        label="Currency Symbol"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={networkData.symbol}
                        onChange={(e) =>
                          setNetworkData({
                            ...networkData,
                            symbol: ((e.target.value).toUpperCase()),
                          })
                        }
                        required
                      />

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
                        >
                          Cancle
                        </Button>

                        <Button
                          type="submit"
                          variant="contained"
                          className="col-6"
                          onClick={handleAddNetwork}
                          sx={{
                            width: "40%",
                            background: "#1B4D23",
                            height: "50px",
                            fontFamily: "Roboto Slab",
                            fontWeight: "700",
                          }}
                          fullWidth
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
    </div>
  );
};

export default AddNetwork;
