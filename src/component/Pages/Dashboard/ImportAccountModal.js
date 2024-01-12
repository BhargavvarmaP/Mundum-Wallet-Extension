import React, { useState,useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Popover,
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

const ImportAccountModal = ({ closeModal, open,chainId }) => {

  const [userPrivateKey, setUserPrivateKey] = useState("");
  const [userAccount,setUserAccount]=useState("");

  const [isImportCreated, setIsImportCreated] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");


  const getExistingAccount = userStore((state) => state.getExistingAccount);


  const HandleChangeAccount = async () => {
    try{
      const result=await getExistingAccount(userAccount,userPrivateKey,chainId);
      console.log(result);

      setIsImportCreated(true);
      setCreationMessage("Account Added successfully.");

    }catch(error){
      console.log(error);
      setIsImportCreated(false);
      setCreationMessage("Error creating the account.");
    }
  };

  const handleCloseModal = () => {
    closeModal();
    setIsImportCreated(false);
    setCreationMessage("");
  };


  useEffect(() => {
    if (isImportCreated) {
      setTimeout(() => {
        handleCloseModal();
      }, 1300);
    }
  }, [isImportCreated]);
  return (
    <>
      <Dialog open={open} onClose={closeModal} maxWidth="sm" fullWidth>
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
                          Import Account
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
                            label="Account Name"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={userAccount}
                            onChange={(e)=>setUserAccount(e.target.value)}
                          />
                          <TextField
                            type="text"
                            label="Enter Your Private Key"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={userPrivateKey}
                            onChange={(e) => setUserPrivateKey(e.target.value)}
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
                              onClick={closeModal}
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
                              onClick={HandleChangeAccount}
                            >
                              Import
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

export default ImportAccountModal;
