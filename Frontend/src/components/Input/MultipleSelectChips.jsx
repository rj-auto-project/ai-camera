import { Box, Chip } from "@mui/material";
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
        : [...prevSelected, chipValue],
    );
  };

  return (
    <Box>
      {chipsData.map((chipData, index) => (
        <Chip
          key={index}
          label={chipData.label}
          color={selectedChips.includes(chipData.value) ? "primary" : "default"}
          onClick={() => handleChipClick(chipData.value)}
          style={{ marginRight: "5px", cursor: "pointer" }}
        />
      ))}
    </Box>
  );
}
