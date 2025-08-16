import React from "react";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Outlet } from 'react-router-dom';

const MainLayout = () => (
  <Box>
    <Header />
    <Box sx={{ minHeight: "80vh", mt: 2 }}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;