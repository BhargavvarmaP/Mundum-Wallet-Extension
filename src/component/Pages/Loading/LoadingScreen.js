import React from "react";
import { CircularProgress, Container, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        background:"white",
    }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ marginTop: 2 }}>
        Please wait...
      </Typography>
    </Container>
  );
};

export default LoadingScreen;
