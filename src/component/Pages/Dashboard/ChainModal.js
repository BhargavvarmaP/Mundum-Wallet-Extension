import React, { useState } from "react";
import {
  Paper,
  Typography,
  Button,
  List,
  Box,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  IconButton,
  ListItemSecondaryAction,
  Switch,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddNetworkChain from "./AddNetworkChain";
import userStore from "../../../store/userstore";

const ChainModal = ({
  closeModal,
  networkList,
  selctedNetfunc,
  chainID,
  selctedNet,
  fetchBalance,
}) => {
  const [isAddNetworkModalOpen, setIsAddNetworkModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);

  const removeNetwork = userStore((state) => state.removeNetwork);

  const handleOpenNetworkModal = () => {
    setIsAddNetworkModalOpen(true);
  };


  const handleMouseEnter = (index) => {
    setHoveredItem(index);
  };

  const handleMouseLeave = () => {
    setHoveredItem(null);
  };


  const handleDeleteNetwork = async (chainId) => {
    console.log(chainId)
    const result = await removeNetwork(chainId);
    if (result) {
      closeModal();
    }
  };

  return (
    <Paper
      sx={{
        padding: "20px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "20px",
        position: "relative",
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
        Select a network
      </Typography>

      <List>
        {isExpanded
          ? networkList.map((chain, index) => (
              <ListItem
                key={chain?.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#ebebeb", 
                  },
                  backgroundColor: hoveredItem === index ? "#ebebeb" : "transparent",

                }}
      
                onClick={() => selctedNetfunc(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
              >
                <ListItemAvatar>
                  {chain?.image ? (
                    <Avatar alt={chain} src={chain.image} />
                  ) : (
                    <Avatar
                      sx={{
                        backgroundColor: "#007BFF",
                        color: "#fff",
                      }}
                    >
                      {chain?.charAt(0)}
                    </Avatar>
                  )}
                </ListItemAvatar>

                <ListItemText primary={chain} />

                {hoveredItem === index ?<ListItemSecondaryAction 
                
                >
                                  <IconButton
                                    edge="end"
                                    aria-label="delete"
                                    
                                  >
                                    <DeleteIcon onClick={() => handleDeleteNetwork(chain.id)} />
                                  </IconButton>
                                </ListItemSecondaryAction>: null}
              </ListItem>
            ))
          : networkList.slice(0, 3).map((chain, index) => (
              <ListItem
                key={chain?.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#ebebeb",
                  },
                  backgroundColor: hoveredItem === index ? "#ebebeb" : "transparent",

                }}
      
                onClick={() => selctedNetfunc(index)}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}

              >
                <ListItemAvatar>
                  {chain?.image ? (
                    <Avatar alt={chain} src={chain.image} />
                  ) : (
                    <Avatar
                      sx={{
                        backgroundColor: "#007BFF",
                        color: "#fff",
                      }}
                    >
                      {chain?.charAt(0)}
                    </Avatar>
                  )}
                </ListItemAvatar>

                <ListItemText primary={chain} />

                {hoveredItem === index ?<ListItemSecondaryAction 
                
>
                  <IconButton
                    edge="end"
                    aria-label="delete"
                    
                  >
                    <DeleteIcon onClick={() => handleDeleteNetwork(chain.id)} />
                  </IconButton>
                </ListItemSecondaryAction>: null}
              </ListItem>
            ))}
      </List>

      <Box
        sx={{
          display: "flex",
          marginTop:"10px",
          justifyContent:"space-between",
        }}
      >
        <Typography >Show All Networks</Typography>
        <Box sx={{display:"flex",alignItems:"center",marginTop:"-6px",marginLeft:"right"}}>
        <Switch 
          onChange={() => setIsExpanded(!isExpanded)}
          defaultChecked={isExpanded}
          color={isExpanded ? "primary" : "secondary"}
        />
        </Box>
      </Box>

      <Box className="center">
        <Button
          variant="outlined"
          sx={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "100px",
            border: "2px solid black",
          }}
          onClick={handleOpenNetworkModal}
        >
          Add Network
        </Button>
      </Box>

      <AddNetworkChain
        closeModal={closeModal}
        title="Add a network"
        isopen={isAddNetworkModalOpen}
        networkList={networkList}
        selctedNet={selctedNet}
        fetchBalance={fetchBalance}
      />
    </Paper>
  );
};

export default ChainModal;
