import React, { useState } from 'react';
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RefreshIcon from "@mui/icons-material/Refresh";
import HelpIcon from "@mui/icons-material/Help";
import ActivityModal from "./ActivityDetailsmodel"
import ArrowOutwardIcon from '@mui/icons-material/ArrowOutward';


import { Card,Box } from "@mui/material";


const ActivityItem = ({ activitys, id }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const formatDate = (inputDate) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    const formattedDate = new Date(inputDate).toLocaleDateString(undefined, options);
    return formattedDate;
  };

  const handleClose = () => {
    setOpen(false);
  };

  const getStatusText = (Send) => {
    return Send === "Send" ? "Send" : "Received";
  };
  
  return (
    <>
      <Card
        key={id}
        style={{
          display: "flex",
          marginTop: "10px",
          cursor: "pointer",
          padding: "4px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        sx={{
          "&:hover": {
            backgroundColor: "#f2f2f2",
          },
        }}
        onClick={handleOpen}
      >
        <div style={{ marginLeft: "10px" }}>
          <Typography sx={{ fontWeight: "700" }} variant="body1">
            {formatDate(activitys.Date)}
          </Typography>

          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            {activitys.status === "Send" ? (
              <ArrowOutwardIcon width="70px" color="success" sx={{ marginRight: 1 }} />
            ) : (
              <ArrowOutwardIcon width="70px" color="danger" sx={{ marginRight: 1 }} />
            )}

            <div>
              <Typography
                sx={{ fontFamily: 'Segoe UI', fontWeight: "600", fontSize: 'h6.fontSize' }}
                variant="body1"
              >
                {getStatusText(activitys.Send)}
              </Typography>
              <Typography
                variant="subtitle1"
                sx={{
                  color: activitys.status === "Send" ? "green" : "inherit",
                  fontWeight: "medium",
                }}
              >
                {activitys.status}
              </Typography>
            </div>
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <Typography
            variant="subtitle1"
            sx={{
              display: "flex",
              justifyContent: "center",
              marginTop: "15px",
              marginRight: "30px",
            }}
          >
            {activitys.txreceipt?.Amount}
          </Typography>
        </div>
      </Card>
      <ActivityModal open={open} handleClose={handleClose} activitys={activitys} />
    </>
  );
};





const ActivityList = ({ activitys, selectedAccount }) => {
  console.log(activitys);
  console.log(selectedAccount);
  return (
    <Box>
      {activitys?.length > 0 ? (
        activitys.map((group, index) =>
          <ActivityItem activitys={group} key={index} />)
      ) : (
        <p>No Activities found.</p> 
      )}
    </Box>
  );
};




const ActivityTabContent = ({ title, activitys, backgroundColor, selectedAccount }) => (
  <Box
    p={3}
    sx={{
      backgroundColor: backgroundColor || "transparent",
      borderRadius: "10px",
    }}
  >
    <Typography variant="h6">{title}</Typography>
    <ActivityList activitys={activitys} selectedAccount={selectedAccount} />

    {/* Three additional options with icons and words */}

    

    <Box display="flex" mt={2} cursor="pointer">
      <IconButton>
        <RefreshIcon />
      </IconButton>
      <Typography variant="body2" mt={1} sx={{ cursor: "pointer" }}>
        Refresh List 
      </Typography>
    </Box>


  </Box>

);
export default ActivityTabContent
