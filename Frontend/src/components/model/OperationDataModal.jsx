import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Grid,
  Chip,
  Divider,
} from "@mui/material";
import { formatTimeToIST } from "../../utils/formatTime.js";

const OperationDataModal = ({ open, onClose, operationData }) => {
  console.log(operationData);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        <Typography variant="h6" style={{ fontWeight: "bold" }}>
          {operationData?.title || "Operation Details"}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        {operationData?.operation === "request" && (
          <>
            {operationData?.data?.classes && (
              <Grid container spacing={2} style={{ marginBottom: "16px" }}>
                <Grid item xs={12}>
                  <Typography
                    variant="subtitle1"
                    style={{ fontWeight: "500", marginBottom: "8px" }}
                  >
                    Classes:
                  </Typography>
                  <Grid container spacing={1}>
                    {operationData.data.classes.map((className, index) => (
                      <Grid item key={index}>
                        <Chip
                          label={className}
                          sx={{ color: "white", fontWeight: "semibold" }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            )}

            {operationData?.data?.topColor && (
              <Grid container spacing={2} style={{ marginBottom: "16px" }}>
                <Grid item xs={6}>
                  <Typography variant="subtitle1" style={{ fontWeight: "500" }}>
                    Top Color:
                  </Typography>
                  <Typography variant="body2">
                    {operationData?.data?.topColor}
                  </Typography>
                </Grid>

                {operationData?.data?.bottomColor && (
                  <Grid item xs={6}>
                    <Typography
                      variant="subtitle1"
                      style={{ fontWeight: "500" }}
                    >
                      Bottom Color:
                      <Typography variant="body2">
                        {operationData?.data?.bottomColor}
                      </Typography>
                    </Typography>
                  </Grid>
                )}
              </Grid>
            )}
          </>
        )}

        {operationData?.operation === "response" && (
          <>
            <Divider style={{ margin: "16px 0" }} />
            <Typography variant="subtitle1" style={{ fontWeight: "500" }}>
              Response Data
            </Typography>
            {/* Add your response-specific content here */}
          </>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OperationDataModal;
