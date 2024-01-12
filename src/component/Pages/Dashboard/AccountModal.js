import React, { useState } from "react";
import {
  Paper,
  Typography,
  IconButton,
  InputAdornment,
  TextField,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemIcon,
  Popover,
  ClickAwayListener, // Import ClickAwayListener
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ImportExportIcon from "@mui/icons-material/ImportExport";
import SecurityIcon from "@mui/icons-material/Security";
import ExploreIcon from "@mui/icons-material/Explore";
import AccountDetailsModal from "./AccountDetails";
import AddAccountModal from "./AddAccountModal";
import ImportAccountModal from "./ImportAccountModal";
import userStore from "../../../store/userstore";

const AccountModal = ({
  closeModal,
  title,
  accountList,
  chainId,
  changeAccount,
  fetchAccount,
  accountAddr,
}) => {
  console.log(accountAddr);
  console.log(accountList);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredAccounts, setFilteredAccounts] = useState(accountList);
  const [anchorEl, setAnchorEl] = useState(null);
  const [clickedAccountIndex, setClickedAccountIndex] = useState(null);
  const [clickedAccount, setClickedAccount] = useState(null); // Store the clicked account
  const [isAccountDetailsModalOpen, setIsAccountDetailsModalOpen] =
    useState(false);
  const [isAddAccountModalOpen, setIsAddAccountModalOpen] = useState(false);
  const [isImportAccountModal, setIsImportAccountModal] = useState(false);


  const removeAccount=userStore((state)=>state.removeAccount);

  const handleremoveAccount=async()=>{
    const result =await removeAccount(clickedAccountIndex,chainId);
    if(result){
      setTimeout(() => {
        closeModal();
      }, 1000); 
      fetchAccount();
    }

  }

  const handleMoreOptionsClick = (event, index, account) => {
    event.stopPropagation();
    setClickedAccountIndex(index);
    setClickedAccount(account); // Update the clicked account
    setAnchorEl(event.currentTarget);
  };

  const handleChangeAccount = (account, index, event) => {
    changeAccount(account, index);
  };

  const handleOpenAddAccountModal = () => {
    setIsAddAccountModalOpen(true);
  };

  const handleOpenImportAccountModal = () => {
    setIsImportAccountModal(true);
  };

  //  i am not using this function i m using closemodal jo props ke through pass hai ---
  const handleOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleItemClick = () => {
    setIsAccountDetailsModalOpen(true);
    // Close the "Three Dots" popover
  };

  // Handle search input change
  const handleSearchChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    const filtered = accountList.filter((account) =>
      account.accountName.toLowerCase().includes(query.toLowerCase())
    );

    setFilteredAccounts(filtered);
  };

  return (
    <>
      <Paper
        sx={{
          padding: "20px",
          maxWidth: "400px",
          margin: "auto",
          marginTop: "50px",
          position: "relative",
          maxHeight: "500px",
          overflowY: "auto",
        }}
      >
        <IconButton
          onClick={closeModal}
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" sx={{ marginBottom: "20px" }}>
          {title}
        </Typography>

        <TextField
          label="Search"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ marginBottom: "20px" }}
          autoComplete="off" // Disable autofill
        />

        <List>
          {filteredAccounts.map((account, index) => (
            <div
              key={account.id}
              style={{ cursor: "pointer" }}
              sx={{
                "&:hover": {
                  backgroundColor: "#f2f2f2",
                },
              }}
            >
              <ListItem>
                <ListItemIcon>
                  <AccountBalanceWalletIcon />
                </ListItemIcon>
                <div
                  style={{ display: "flex", alignItems: "center", flex: 1 }}
                  onClick={(event) =>
                    handleChangeAccount(account, index, event)
                  }
                >
                  <ListItemText
                    primary={`${account?.accountName}`}
                    secondary={`${account.address.substring(
                      0,
                      6
                    )}...${account.address.substring(
                      account.address.length - 4
                    )}`}
                    primaryTypographyProps={{ variant: "subtitle1" }}
                    secondaryTypographyProps={{ variant: "body2" }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <ListItemText
                    primary={account.balance}
                    primaryTypographyProps={{ variant: "body2" }}
                    sx={{ fontSize: "0.8rem" }}
                  />
                  <ListItemIcon>
                    <IconButton
                      edge="end"
                      onClick={(event) =>
                        handleMoreOptionsClick(event, index, account)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                    <Popover
                      id={`options-popover-${index}`} // Use index to make each popover unique
                      open={clickedAccountIndex === index}
                      anchorEl={anchorEl}
                      onClose={closeModal} // Close the popover when clicking outside of it
                      anchorOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                      transformOrigin={{
                        vertical: "top",
                        horizontal: "right",
                      }}
                    >
                    
                      <List>
                        {/* First item with details */}
                        <ListItem button onClick={handleItemClick}>
                          {/* Use the clicked account here */}
                          <ListItemIcon>
                            <AccountBalanceWalletIcon />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${clickedAccount?.accountName}`}
                            primaryTypographyProps={{ variant: "subtitle1" }}
                          />
                        </ListItem>
                        {/* ... (other options) */}

                        {/* BackUp Account */}
                        <ListItem button>
                          <ListItemIcon>
                            <ExploreIcon />
                          </ListItemIcon>
                          <ListItemText primary="BackUp Account" />
                        </ListItem>

                        {/* Remove account */}
                        <ListItem button onClick={handleremoveAccount}>
                          <ListItemIcon>
                            <ExploreIcon />
                          </ListItemIcon>
                          <ListItemText primary="Remove Account" />
                        </ListItem>
                      </List>
                    </Popover>
                  </ListItemIcon>
                </div>
              </ListItem>
              {/* Divider */}
              {account.id !== filteredAccounts.length && <Divider />}
            </div>
          ))}
        </List>
        <Box
          sx={{ display: "flex", flexDirection: "column", marginTop: "20px" }}
        >
          <Button
            variant="outlined"
            startIcon={<AddCircleOutlineIcon />}
            sx={{ marginBottom: "10px" }}
            onClick={handleOpenAddAccountModal}
          >
            Create Account
          </Button>

          <Button
            variant="outlined"
            startIcon={<ImportExportIcon />}
            sx={{ marginBottom: "10px" }}
            onClick={handleOpenImportAccountModal}
          >
            Import Account
          </Button>
          <Button variant="outlined" startIcon={<SecurityIcon />}>
            Add Hardware Wallet
          </Button>
        </Box>
      </Paper>
      <AccountDetailsModal
        isOpen={isAccountDetailsModalOpen}
        onClose={closeModal}
        accountName={clickedAccount ? clickedAccount?.accountName : ""}
        address={clickedAccount ? clickedAccount.address : ""}
        privateKey={clickedAccount ? clickedAccount.privateKey : ""}
      />
      <AddAccountModal
       onClose={closeModal}
        title="Add an account"
        open={isAddAccountModalOpen}
        fetchAccount={fetchAccount}
      />
      <ImportAccountModal
        closeModal={() => setIsImportAccountModal(false)}
        title="Add an account"
        open={isImportAccountModal}
        chainId={chainId}
      />
    </>
  );
};

export default AccountModal;
