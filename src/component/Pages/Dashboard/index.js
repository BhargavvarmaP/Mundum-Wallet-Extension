import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Box,
  Button,
  IconButton,
  Grid,
  Tabs,
  Modal,
  Tab,
  Alert,
  Snackbar,
  Popover,
  useStepContext,
} from "@mui/material";
import { useTheme } from "@mui/system";
import useMediaQuery from "@mui/material/useMediaQuery";
import IconGrid from "./IconGrid";
import Card from "@mui/material/Card";
import ContentCopyTwoToneIcon from "@mui/icons-material/ContentCopyTwoTone";
import mundom_logo from "../Assets/mundom_logo.png";
import TabsContent from "./TabsContent";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ChainModal from "./ChainModal";
import AccountModal from "./AccountModal";
import MoreItems from "./MoreItems";
import userStore from "../../../store/userstore";
import { ethers } from "ethers";

const Dashboard = ({ isAuthenticated }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isMoreItemsOpen, setIsMoreItemsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selctedNet, setselctedNet] = useState(0);
  const [networkList, setNetworkList] = useState([]);
  const [accountList, setAccountList] = useState([]);

  const [wallets, setWallets] = useState([]);
  const [accountss, setAccountss] = useState("");
  const [account, setAccount] = useState("");
  const [symbol, setSymbol] = useState("");
  const [getBal, setgetBal] = useState([]);
  const [chainID, setChainId] = useState();
  const [rpcUrl, setrpcUrl] = useState("");
  const [tokens, setToken] = useState([]);
  const [alltokens, setAllToken] = useState([]);
  const [selectAccount, setSelectedAccount] = useState(0);
  const [accountName, setAccountName] = useState(0);
  const [activity, setActivity] = useState([]);
  console.log(activity);
  const [importedTokens, setImportedTokens] = useState([]);
  console.log(alltokens);

  const selctedNetfunc = (network) => {
    setselctedNet(network);
    setIsModalOpen(false);
  };

  const openAccountModal = () => {
    setIsAccountModalOpen(true);
  };

  const getNetworks = userStore((state) => state.getnetworks);
  const getwallets = userStore((state) => state.getwallets);
  const getBalance = userStore((state) => state.getBalance);
  const gettxActivity = userStore((state) => state.gettxActivity);
  const txactivity = userStore((state) => state.txactivity);


  let seenTxs = new Set();
   const date = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata", format: "yyyy-MM-ddTHH:mm:ssZ" }); 

   let receivetx=[];

  const getnetworksList = async () => {
    let networks = await getNetworks();
    networks = networks[0].map((network) => network.network);
    setNetworkList(networks);
  };

  const handlereceivetx = async(receivetxactivity) =>{
    console.log("Activity:",receivetxactivity)
    const res = await txactivity(receivetxactivity,account,chainID);
    console.log(res);
  }
  const fetchAccount = async () => {
    const walletsT = await getwallets();
    setWallets(walletsT[0]);
    const newAccountList = walletsT[0][0].accountName.map((accountName, i) => ({
      accountName: accountName,
      address: walletsT[0][0].address[i],
      privateKey: walletsT[0][0].privateKey[i],
      network: walletsT[0][0].network,
    }));
    const allTokenList = {
      allERC721tokens: [],
    };
    walletsT[0].forEach((item, i) => {
      allTokenList.allERC721tokens.push(item.ERC20tokens);
    });
    setToken(allTokenList.allERC721tokens[0][0]);
    setAccountList(newAccountList);
    setAllToken(allTokenList?.allERC721tokens);
    setSymbol(walletsT[0][selctedNet]?.network?.symbol);
    setChainId(walletsT[0][selctedNet]?.network?.chainId);
    setrpcUrl(walletsT[0][selctedNet]?.network?.rpcUrl);
    setAccountss(walletsT[0][selctedNet]);
    setAccountName(walletsT[0][selctedNet].accountName[0]);
    setAccount(walletsT[0][selctedNet].address[0]);
    setActivity(await gettxActivity(walletsT[0][selctedNet].address[0], walletsT[0][selctedNet]?.network.chainId));
    fetchBalance(newAccountList[selctedNet]?.network?.chainId, newAccountList[selctedNet]?.address);
  };

  const fetchBalance = async (chainId, address) => {
    if(address){
      setgetBal(await getBalance(chainId, address));
      setActivity(await gettxActivity(address, chainId));
    }
  };

  useEffect(() => {
    getnetworksList();
    fetchAccount();
  }, []);
  
  useEffect(() => {
    setSymbol(wallets[selctedNet]?.network?.symbol);
    setAccountss(wallets[selctedNet]);
    setChainId(wallets[selctedNet]?.network.chainId);
    setToken(alltokens[selctedNet]);
  }, [selctedNet,tokens,importedTokens]);

  useEffect(() => {
    if (wallets.length > 0 && selctedNet !== null) {
      setSymbol(wallets[selctedNet]?.network?.symbol);
      setAccountss(wallets[selctedNet]);
      const newChainId = wallets[selctedNet]?.network.chainId;
      setChainId(newChainId);
      fetchBalance(newChainId, account);
      setToken(alltokens[selctedNet]);
    }
  }, [selctedNet, wallets, accountName,tokens,importedTokens]);
  useEffect(() => {
    console.log(rpcUrl,date,account)
    const provider = new ethers.providers.JsonRpcProvider(rpcUrl);
  
    const handleblock = async (blockNumber) => {
      try {
        const block = await provider.getBlockWithTransactions(blockNumber);
  
        for (const transaction of block.transactions) {
          if (!seenTxs.has(transaction.hash)) {
            seenTxs.add(transaction.hash);
  
            if (transaction.to === account) {
              const receipt = {
                Sender:transaction.from,
                Recipient: transaction.to,
                Amount: ethers.utils.formatEther(transaction.value),
                BlockHash: transaction.blockHash,
                TxHash: transaction.hash,
                BlockNumber: transaction.blockNumber,
                TransactionIndex: transaction.transactionIndex,
              }
              receivetx.push({
                Received:"Received",
                Date: date,
                txreceipt: receipt,
                status: 'Success',
              });
            }
          }
        }
        
        console.log(receivetx);
         if(receivetx.length>0){
          console.log("first")
          handlereceivetx(receivetx.shift());
        }
        console.log(receivetx);
      } catch (error) {
        console.error(error);
      }
    };
  
    provider.on("block", handleblock);
   
    return () => {
      provider.off('block', handleblock);
    };
  }, [rpcUrl,account,date]);
  
  const closeAccountModal = () => {
    setIsAccountModalOpen(false);
  };

  const openMoreItemsPopover = (event) => {
    setAnchorEl(event.currentTarget);
    setIsMoreItemsOpen(true);
  };

  const closeMoreItemsPopover = () => {
    setIsMoreItemsOpen(false);
  };

  const isOpen = () => {
    setIsModalOpen(true);
    getnetworksList();
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const tokenSet = (data) => {
    setToken(data);
  };

  const copyToClipboardAccount = async () => {
    try {
      await navigator.clipboard.writeText(account);
      setSnackbarMessage("Address copied successfully");
      setSnackbarOpen(true);
    } catch (error) {
      console.log(error)
    }
  };

  const changeAccount = (account, index) => {
    setAccount(account.address);
    setAccountName(account.accountName);
    setSelectedAccount(index);
    closeAccountModal();
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const modalContent = (
    <ChainModal closeModal={closeModal} networkList={networkList} selctedNetfunc={selctedNetfunc} fetchBalance={fetchBalance} selctedNet={selctedNet} />
  );

  const accountModalContent = (
    <AccountModal
      closeModal={closeAccountModal}
      title="Select an account"
      accountList={accountList}
      chainId={chainID}
      accountss={accountss}
      selectedacc={selectAccount}
      changeAccount={changeAccount}
      fetchAccount={fetchAccount}
    />
  );

  return (
    <div>
      <AppBar position="static" className="appbar">
        <Toolbar>
          <img src={mundom_logo} width="53" height="53" alt="" className="logo-abbr" />
        </Toolbar>
      </AppBar>
      <Container className="container">
        <Card sx={{ borderRadius: "12px" }}>
          <Box className="headerInfo">
            <img src={mundom_logo} alt="icon" width="80" className="logo" />
            <Grid container spacing={3}>
              <Grid item xs={4}>
                <Button
                  sx={{ width: "100%", background: "#aed4b4", borderRadius: "100px", fontWeight: "700" }}
                  onClick={isOpen}
                >
                  {isMobile ? symbol : networkList[selctedNet]}
                  <ArrowDropDownIcon />
                </Button>
              </Grid>
              <Grid item xs={4}>
                <Button
                  sx={{ width: "100%", fontWeight: "700", "&:hover": { backgroundColor: "#aed4b4" } }}
                  onClick={openAccountModal}
                >
                  {accountName}
                  <ArrowDropDownIcon />
                </Button>
              </Grid>
              <Grid item xs={4} flexDirection="row-reverse" display="flex" pr={4}>
                <IconButton size="small" sx={{ marginLeft: "8px" }} onClick={openMoreItemsPopover}>
                  <MoreVertIcon />
                </IconButton>
              </Grid>
            </Grid>
            <Typography
              onClick={copyToClipboardAccount}
              variant="body1"
              className="text-center text-black h5"
              sx={{
                marginTop: "20px",
                fontWeight: "700",
                borderRadius: "100px",
                backgroundColor: "lightblue",
                paddingLeft: "10px",
                paddingRight: "10px",
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
              }}
            >
              {`${account.slice(0, 4)}...${account.slice(-4)}`}
              <IconButton size="small" sx={{ marginLeft: "8px" }}>
                <ContentCopyTwoToneIcon />
              </IconButton>
            </Typography>
            <Typography
              variant="h4"
              className="text-center text-black h5"
              sx={{
                marginTop: "20px",
                fontWeight: "700",
                display: "flex",
                alignItems: "center",
              }}
            >
              {getBal} {symbol}
            </Typography>
          </Box>
          <IconGrid chainID={chainID} symbol={symbol} accountss={accountss} selectedacc={selectAccount} />
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={currentTab}
              onChange={(event, newValue) => setCurrentTab(newValue)}
              centered
              variant="fullWidth"
            >
              <Tab
                label="Token"
                sx={{ width: "33.33%", borderBottom: currentTab === 0 ? "2px solid #77de87" : "none" }}
              />
              <Tab
                label="NFTs"
                sx={{ width: "33.33%", borderBottom: currentTab === 1 ? "2px solid #77de87" : "none" }}
              />
              <Tab
                label="Activity"
                sx={{ width: "33.33%", borderBottom: currentTab === 2 ? "2px solid #77de87" : "none" }}
              />
            </Tabs>
          </Box>
          <TabsContent
            closeModal={closeModal}
            currentTab={currentTab}
            tokenData={tokens}
            chainId={chainID}
            accountAddr={account}
            tokenSet={tokenSet}
            tokens={tokens}
            activity={activity}
            importedTokens={importedTokens}
            setImportedTokens={setImportedTokens}
            fetchAccount={fetchAccount}
            selectAccount={selectAccount}
          />
        </Card>
      </Container>
      <Popover
        open={isMoreItemsOpen}
        anchorEl={anchorEl}
        onClose={closeMoreItemsPopover}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MoreItems />
      </Popover>
      <Modal
        open={isModalOpen}
        onClose={closeModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {modalContent}
      </Modal>
      <Modal
        open={isAccountModalOpen}
        onClose={closeAccountModal}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        {accountModalContent}
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ fontFamily: "Roboto Slab", fontWeight: "900" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
