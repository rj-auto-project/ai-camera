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
  Badge,
} from "@mui/material";
import { GrMapLocation } from "react-icons/gr";
import {
  Menu as MenuIcon,
  Settings,
  Logout,
  Stream,
  TaskAltOutlined,
  AnalyticsOutlined,
} from "@mui/icons-material";
import TrackChangesIcon from "@mui/icons-material/TrackChanges";
import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux"; // Removed useSelector since it's not used
import { openLogoutDialog } from "../features/auth/authSlice";
import { FaExclamationTriangle } from "react-icons/fa";
import { BASE_URL } from "../api/url";

const drawerWidth = 190;

export default function CustomDrawer() {
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [incidentNotificationCount, setIncidentNotificationCount] =
    React.useState(0);

  const handleDrawerOpen = () => {
    setDrawerOpen(!drawerOpen);
  };

  const location = useLocation();
  const currentPath = location.pathname.split("/")[2];

  const dispatch = useDispatch();
  const handleOpenLogoutDialog = () => dispatch(openLogoutDialog());

  React.useEffect(() => {
    const eventSource = new EventSource(
      `${BASE_URL}/incidents/notifications/sse`
    );

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setIncidentNotificationCount(data?.count);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    };
    return () => {
      eventSource.close();
    };
  }, [dispatch]);

  const drawerItems = [
    { text: "Map", path: "map", icon: <GrMapLocation size={23} /> },
    { text: "Streams", path: "streams", icon: <Stream /> },
    { text: "Operations", path: "operations", icon: <TaskAltOutlined /> },
    { text: "Analytics", path: "analytics", icon: <AnalyticsOutlined /> },
    { text: "Incidents", path: "incidents", icon: <FaExclamationTriangle /> },
    {
      text: "Track Agent",
      path: "trackagent",
      icon: <TrackChangesIcon />,
    },
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
        <Toolbar>
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

        <List>
          <Divider />
          {drawerItems.map((item, index) => (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={`/dashboard/${item.path}`}
              sx={{
                py: 1.5,
                backgroundColor:
                  currentPath === item.path
                    ? "rgba(255, 255, 255, 0.1)"
                    : "transparent",
              }}
            >
              <ListItemIcon>
                {item.text === "Incidents" ? (
                  <Badge
                    badgeContent={incidentNotificationCount}
                    color="error"
                    invisible={incidentNotificationCount === 0}
                  >
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </div>
      <div>
        <List sx={{ margin: 0 }}>
          <Divider />
          <ListItem
            button
            component={Link}
            to={`/dashboard/settings`}
            sx={{
              backgroundColor:
                currentPath === "settings"
                  ? "rgba(255, 255, 255, 0.1)"
                  : "transparent",
            }}
          >
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
              scrollbarWidth: "none",
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
