import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import { Button, Container, Grid, TextField ,ListItemSecondaryAction} from "@mui/material";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HelpIcon from "@mui/icons-material/Help";
import Dialog from "@mui/material/Dialog"; 
import DialogContent from "@mui/material/DialogContent";
import styled from "styled-components";
import userStore from "../../../store/userstore";
import ActivityTabContent from "./ActivityTabContent";
import SendImportToken from "./SendImportToken";
import DeleteIcon from "@mui/icons-material/Delete"; 
import "./TabContent.css";
import SendIcon from '@mui/icons-material/Send'; // Import the SendIcon

const ContentBody = styled.div`
  margin-left: 30px !important;
`;


/*
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

 */


const TokenItem = ({ token, id, handleTokenClick, handleRemoveErc20Token }) => {
  const [hoveredItem, setHoveredItem] = useState(null);

  const handleMouseEnter = (index) => {
    setHoveredItem(true);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };

  // const handleRemoveToken=async()=>{

  // }

  return (
    <>
      <Box
        key={id + 1 }
        sx={{
          display: "flex",
          marginTop: "10px",
          padding: "4px",
          borderRadius: "5px",
          cursor: "pointer",
          alignItems: "center",
          backgroundColor: "#ebebeb", 

          justifyContent: "space-between",
          "&:hover": {
            backgroundColor: "#ebebeb", 
          },
        }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {token.image ? (
            <img src={token.image} alt={token.name} width="20" height="20" />
          ) : (
            <div
              style={{
                width: "35px",
                height: "35px",
                borderRadius: "50%",
                backgroundColor: "#007BFF",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#fff",
              }}
            >
              {token.tokensymbol?.charAt(0)}
            </div>
         )}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "10px",
            }}
          >
            <Typography variant="body1">{token.tokensymbol}</Typography>
            <Typography variant="subtitle1">{token.tokenbalance}</Typography>
          </div>
        </Box>
        {hoveredItem && (
          <div style={{ display: 'flex' }}>
            <IconButton>
              <SendIcon   onClick={() => handleTokenClick(token)}/> 
            </IconButton>
            {/* <IconButton>
              <DeleteIcon onClick={()=>handleRemoveErc20Token(token)} /> 
            </IconButton> */}
          </div>
        )}

      </Box>
    </>
  );
};








const TokensList = ({ tokens, selectedAccount, handleTokenClick, handleRemoveErc20Token }) => {
  return (
    <Box>
      {tokens?.length > 0 ? (
        tokens[selectedAccount].map((group, index) => (
          <TokenItem
            token={group}
            key={index}
            handleTokenClick={handleTokenClick}
            handleRemoveErc20Token={handleRemoveErc20Token}
          />
        ))
      ) : (
        <p>No tokens available.</p>
      )}
    </Box>
  );
};

const TabContent = ({ title, tokens, backgroundColor, selectedAccount }) => (
  <Box
    p={3}
    sx={{
      backgroundColor: backgroundColor || "transparent",
      borderRadius: "10px",
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <TokensList tokens={tokens} selectedAccount={selectedAccount} />

    {/* Three additional options with icons and words */}
    <Box display="flex" mt={2} cursor="pointer">
      <IconButton>
        <AddCircleOutlineIcon />
      </IconButton>
      <Typography variant="body2" mt={1} sx={{ cursor: "pointer" }}>
        Import Token hgsdjashj
      </Typography>
    </Box>

    <Box display="flex" mt={2} cursor="pointer">
      <IconButton>
        <RefreshIcon />
      </IconButton>
      <Typography variant="body2" mt={1} sx={{ cursor: "pointer" }}>
        Refresh List hbjhsjh
      </Typography>
    </Box>

    <Box display="flex" mt={2} cursor="pointer">
      <IconButton>
        <HelpIcon />
      </IconButton>
      <Typography variant="body2" mt={1} sx={{ cursor: "pointer" }}>
        Wallet Support
      </Typography>
    </Box>
  </Box>
);

const TabContentToken = ({
  title,
  tokens,
  backgroundColor,
  closeImportToken,
  openImportToken,
  selectAccount,
  handleTokenClick,
  handleRefreshList,
  handleRemoveErc20Token
}) => (
  <Box
    p={3}
    sx={{
      backgroundColor: backgroundColor || "transparent",
      borderRadius: "10px",
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <TokensList
      tokens={tokens}
      selectedAccount={selectAccount}
      handleTokenClick={handleTokenClick}
      handleRemoveErc20Token={handleRemoveErc20Token}
    />

    {/* Three additional options with icons and words */}
    <Box display="flex" mt={2} cursor="pointer" onClick={openImportToken}>
      <IconButton>
        <AddCircleOutlineIcon />
      </IconButton>
      <Typography variant="body2" mt={1} sx={{ cursor: "pointer" }}>
        Import Token
      </Typography>
    </Box>

    <Box display="flex" mt={2} cursor="pointer">
      <IconButton>
        <RefreshIcon onClick={handleRefreshList} />
      </IconButton>
      <Typography
        variant="body2"
        mt={1}
        sx={{ cursor: "pointer" }}
        
      >
        Refresh List
      </Typography>
    </Box>
  </Box>
);

const TabsContent = ({
  currentTab,
  tokenData,
  accountAddr,
  tokenSet,
  chainId,
  selectAccount,
  activity,
  setImportedTokens,
  importedTokens,
  tokens,
  fetchAccount,
}) => {
  console.log(importedTokens);
  console.log(tokenData);
  const [importTokenDialog, setImportTokenDialog] = useState(false); // State variable for the dialog
  const [tokenContractAddress, setTokenContractAddress] = useState("");
  console.log(tokenContractAddress);

  const [tokenSymbol, setTokenSymbol] = useState();
  const [tokenDesimal, setTokenDecimal] = useState();

  const [isAddTokenCreated, setIsAddTokenCreated] = useState(false);
  const [creationMessage, setCreationMessage] = useState("");

  console.log(importedTokens);
  const [tokenAlreadyAddedError, setTokenAlreadyAddedError] = useState(false);

  const importERC20Tokens = userStore((state) => state.importERC20Tokens);
  const getERC20Balance = userStore((state) => state.getERC20Balance);
  const getTokenDetails = userStore((state) => state.getTokenDetails);
 const removeERC20Token =userStore((state)=>state.removeERC20Token);
 const updateTokenBalance =userStore((state)=>state.updateTokenBalance);

  const [selectedToken, setSelectedToken] = useState(null);

  const handleTokenClick = (token) => {
    setSelectedToken(token);
  };

  const handleupdateTokenBalance=async()=>{
    console.log(tokens);
    console.log(selectAccount);

      //  const result= await updateTokenBalance(tokens[selectAccount].tokenaddress,accountAddr,chainId);
      //  console.log(result);
    
    
  }

  const handleRemoveErc20Token=async(token)=>{
    console.log("accountAddr", accountAddr, "token.tokenaddress", token.tokenaddress, "chainId", chainId)
    const result=await removeERC20Token(accountAddr,token.tokenaddress,chainId);
    console.log(result);
  }


  const handleBalncefetech = async () => {
    console.log(tokenContractAddress, accountAddr, chainId);
    const result = await getERC20Balance(
      tokenContractAddress,
      accountAddr,
      chainId
    );
    console.log(result);
  };

  const handleAddToken = async (e) => {
    try {
      console.log(
        tokenContractAddress,
        accountAddr,
        tokenSymbol,
        tokenDesimal,
        chainId
      );

      if (importedTokens.some((token) => token.symbol === tokenSymbol)) {
        setTokenAlreadyAddedError(true);
      } else {
        const result = await importERC20Tokens(
          tokenContractAddress,
          accountAddr,
          tokenSymbol,
          tokenDesimal,
          chainId
        );
        console.log(result);
        console.log(tokenContractAddress, accountAddr, chainId);

        const tokenfetch = await getERC20Balance(
          tokenContractAddress,
          accountAddr,
          chainId
        );
        console.log(tokenfetch);

        // Update the tokens and importedTokens state
        tokenSet((prevTokens) => [...prevTokens, tokenfetch]);

        setImportedTokens((prevImportedTokens) => [
          ...prevImportedTokens,
          { symbol: tokenSymbol, address: tokenContractAddress },
        ]);

        await fetchAccount();
        console.log("ram ram ram");
        setIsAddTokenCreated(true);
        setCreationMessage("Add Token successfully");
        setTimeout(() => {
          closeImportTokenDialog();
        }, 1000);
        setTokenAlreadyAddedError(false);
      }
    } catch (error) {
      console.error("Error:", error);
      setIsAddTokenCreated(false);
      setCreationMessage("Error Adding The Token");
    }
  };

  const handlegetTokenDetails = async () => {
    if (tokenContractAddress) {
      const result = await getTokenDetails(tokenContractAddress, chainId);
      setTokenSymbol(result.symbol);
      setTokenDecimal(result.decimals);
      console.log(result);
    }
  };

  useEffect(() => {
    if (importTokenDialog) {
      handlegetTokenDetails();

    }


  });

  useEffect(() => {
    console.log("ram ram ram");
    console.log(importedTokens);
    handleupdateTokenBalance();

    if (isAddTokenCreated) {
      setTimeout(() => {
        closeImportTokenDialog();
      }, 1000);
      handleBalncefetech();
    }
  }, [tokens, importedTokens]);

  // Function to open the dialog
  const openImportTokenDialog = () => {
    setImportTokenDialog(true);
  };

  // Function to close the dialog
  const closeImportTokenDialog = () => {
    setImportTokenDialog(false);
    setCreationMessage("");
    setIsAddTokenCreated(false);
  };

  const handleRefreshList = async () => {
    await fetchAccount();
    console.log("jhscdjhhjd");
  };

  return (
    <div>
      {/* Token Tab */}
      <div role="tabpanel" hidden={currentTab !== 0}>
        <TabContentToken
          title="Token Content"
          tokens={tokenData}
          selectAccount={selectAccount}
          openImportToken={openImportTokenDialog}
          handleRefreshList={handleRefreshList}
          closeImportToken={closeImportTokenDialog}
          handleTokenClick={handleTokenClick}
          handleRemoveErc20Token={handleRemoveErc20Token}
        />
      </div>

      {/* NFTs Tab */}
      <div role="tabpanel" hidden={currentTab !== 1}>
        {/* <TabContent
          title="NFTs Content"
          tokens={nftData}
          backgroundColor="#f2f2f2"
        /> */}
      </div>

      {/* Activity Tab */}

      <div role="tabpanel" hidden={currentTab !== 2}>
        <ActivityTabContent
          title="Activity Content"
          activitys={activity}
          backgroundColor="#fff"
          chainId={chainId}
        />
      </div>

      {selectedToken && (
        <SendImportToken
          handleopen={true}
          handleClosed={() => setSelectedToken(null)}
          tokens={selectedToken}
          accountAddr={accountAddr}
          chainId={chainId}
        />
      )}

      {/* Import Token Dialog */}
      <Dialog open={importTokenDialog} onClose={closeImportTokenDialog}>
        <DialogContent>
          {/* Add your content for the dialog here */}
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
                          Import Token
                        </Typography>

                        <Typography
                          variant="body1"
                          className="text-center text-black h5"
                          sx={{
                            marginTop: "20px",
                            fontFamily: "Roboto Slab",
                            fontWeight: "700",
                          }}
                        >
                          Make sure you trust a token before you import it.
                          Learn how to avoid token <br />
                          scams and security risks. You can also enable token
                          detection in your Settings
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
                            label="Token Contract Address"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={tokenContractAddress}
                            onChange={(e) =>
                              setTokenContractAddress(e.target.value)
                            }
                          />

                          <TextField
                            type="text"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            value={tokenSymbol}
                            required
                          />

                          <TextField
                            type="number"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            required
                            value={tokenDesimal}
                          />

                          {/* Display error message if tokenAlreadyAddedError is true */}
                          {tokenAlreadyAddedError && (
                            <Typography variant="body2" color="error">
                              Token is already added.
                            </Typography>
                          )}

                          <Typography sx={{ color: "green" }}>
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
                                height: "58px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              onClick={closeImportTokenDialog}
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
                                height: "58px",
                                fontFamily: "Roboto Slab",
                                fontWeight: "700",
                                marginRight: "10px",
                              }}
                              fullWidth
                              onClick={handleAddToken}
                            >
                              Add Token
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
    </div>
  );
};

export default TabsContent;
