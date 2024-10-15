import { Box, Chip, Typography } from "@mui/material";
import { useState } from "react";

export default function MultipleSelectChips({
  chipsData,
  selectedChips,
  setSelectedChips,
}) {
  const handleChipClick = (chipValue) => {
    setSelectedChips((prevSelected) =>
      prevSelected.includes(chipValue)
        ? prevSelected.filter((value) => value !== chipValue)
        : [...prevSelected, chipValue]
    );
  };
  console.log("selected",selectedChips)
  return (
    <Box>
      {chipsData.map((chipData, index) => (
        <Chip
          key={index}
          label={
            <Typography
              variant="body1"
              sx={{ fontWeight: "500", fontSize: 13 }}
            >
              {chipData.label}
            </Typography>
          }
          color={selectedChips.includes(chipData.value) ? "primary" : "default"}
          onClick={() => handleChipClick(chipData.value)}
          style={{ marginRight: "5px", cursor: "pointer" }}
        />
      ))}
    </Box>
  );
}
