import React, { useState } from "react";
import { Card, CardContent, Icon, IconButton, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";

const UserCard = ({ user }) => {
  const [modal, setModal] = useState(false);

  const handleDeleteUser = () => {
    setModal(true);
  };

  return (
    <Card
      variant="outlined"
      sx={{
        maxWidth: 300,
        margin: "20px auto",
        bgcolor: "#121212",
        borderRadius: 2,
        position: "relative",
      }}
    >
      <IconButton
        sx={{ position: "absolute", top: 1, right: 2 }}
        onClick={handleDeleteUser}
      >
        <Delete />
      </IconButton>
      <CardContent>
        <Typography variant="h6" component="div">
          Name: {user.name}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Employee ID: {user.empId}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Joining Date: {user.joiningDate}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Access Level: {user.accessLevel}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserCard;
