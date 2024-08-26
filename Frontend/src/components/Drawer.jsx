import * as React from "react";
import {
  Box,
  CssBaseline,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { GrMapLocation } from "react-icons/gr";
import {
  Menu as MenuIcon,
  Settings,
  Logout,
  Stream,
  TaskAltOutlined,
  Report,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openLogoutDialog } from "../features/auth/authSlice";

const drawerWidth = 210;

export default function CustomDrawer() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const dispatch = useDispatch();
  const handleOpenLogoutDialog = () => dispatch(openLogoutDialog());

  const drawerItems = [
    { text: "Map", path: "map", icon: <GrMapLocation size={23} /> },
    { text: "Streams", path: "streams", icon: <Stream /> },
    { text: "Operations", path: "operations", icon: <TaskAltOutlined /> },
    { text: "Reports", path: "reports", icon: <Report /> },
  ];

  const drawer = (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
      }}
    >
      <div>
        <Toolbar sx={{ minHeight: 48 }}> {/* Reduced height */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerOpen}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>

        <Divider />
        <List>
          {drawerItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={`/dashboard/${item.path}`}
              sx={{ py: 1 }}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
      <div>
        <Divider />
        <List>
          <ListItem button component={Link} to={`/dashboard/settings`}>
            <ListItemIcon>
              <Settings />
            </ListItemIcon>
            <ListItemText primary={"Settings"} />
          </ListItem>
          <ListItem button onClick={handleOpenLogoutDialog}>
            <ListItemIcon>
              <Logout />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItem>
        </List>
      </div>
    </div>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerOpen ? drawerWidth : 60}px)` },
          ml: { sm: `${drawerOpen ? drawerWidth : 60}px` },
          transition: "margin 0.3s ease",
        }}
      ></AppBar>
      <Box
        component="nav"
        sx={{
          width: { sm: drawerOpen ? drawerWidth : 60 },
          flexShrink: { sm: 0 },
          overflow: "hidden",
        }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerOpen ? drawerWidth : 60,
              transition: "width 0.3s ease",
              overflowX: "hidden",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </Box>
  );
}
