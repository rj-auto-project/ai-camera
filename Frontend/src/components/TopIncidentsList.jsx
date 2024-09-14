import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Skeleton,
  Alert,
  Chip,
  Divider,
} from "@mui/material";
import ListAltIcon from "@mui/icons-material/ListAlt";
import dayjs from "dayjs";

const TopIncidentsList = ({ data, isLoading }) => {
  return (
    <Card elevation={3} sx={{ height: "100%" }}>
      <CardContent sx={{ height: "100%", overflow: "auto" }}>
        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <ListAltIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6" component="div" color="textPrimary">
            Top Incident Types
          </Typography>
        </Box>
        {isLoading ? (
          <Skeleton variant="rectangular" width="100%" height={350} />
        ) : data?.length > 0 ? (
          <List>
            {data.map((item, index) => (
              <React.Fragment key={item.type}>
                <ListItem alignItems="flex-start">
                  <ListItemIcon>
                    <Typography variant="h6" color="primary">
                      {index + 1}
                    </Typography>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.type}
                        </Typography>
                        <Chip
                          label={`${item.count} incidents`}
                          color="primary"
                          size="small"
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Last Occurrence:
                        </Typography>{" "}
                        {dayjs(item.lastOccurrence).format("MMM D, YYYY HH:mm")}
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Severity:
                        </Typography>{" "}
                        {item.severity}
                        <br />
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Location:
                        </Typography>{" "}
                        {item.location}
                      </>
                    }
                  />
                </ListItem>
                {index < data.length - 1 && (
                  <Divider variant="inset" component="li" />
                )}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No incident type data available for the selected period.
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default TopIncidentsList;
