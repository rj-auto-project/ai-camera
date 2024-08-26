export const operationForms = {
    "Vehicle Search": [
      {
        name: "vehicleColor",
        label: "Color",
        type: "select",
        rules: { required: "Color is required" },
        options: [
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
          { value: "green", label: "Green" },
          { value: "black", label: "Black" },
        ],
      },
      { 
        name: "licenseNumber", 
        label: "License Number", 
        type: "text", 
        rules: { required: "License Number is required" } 
      },
      { 
        name: "ownerName", 
        label: "Owner Name", 
        type: "text" 
      },
      { 
        name: "startTime", 
        label: "Start Time", 
        type: "datetime-local", 
        rules: { required: "Start Time is required" } 
      },
      { 
        name: "endTime", 
        label: "End Time", 
        type: "datetime-local", 
        rules: { required: "End Time is required" } 
      },
    ],
    "Suspect Search": [
      {
        name: "suspectColor",
        label: "Color",
        type: "select",
        rules: { required: "Color is required" },
        options: [
          { value: "red", label: "Red" },
          { value: "blue", label: "Blue" },
          { value: "green", label: "Green" },
          { value: "black", label: "Black" },
        ],
      },
      { 
        name: "passengerCount", 
        label: "Number of Passengers", 
        type: "number" 
      },
      { 
        name: "clothColor", 
        label: "Cloth Color", 
        type: "text" 
      },
    ],
    "Restricted Vehicle": [
      {
        name: "class",
        label: "Class",
        type: "select",
        rules: { required: "Class is required" },
        options: [
          { value: "car", label: "Car" },
          { value: "bike", label: "Bike" },
          { value: "truck", label: "Truck" },
        ],
      },
      { 
        name: "startTime", 
        label: "Start Time", 
        type: "datetime-local", 
        rules: { required: "Start Time is required" } 
      },
      { 
        name: "endTime", 
        label: "End Time", 
        type: "datetime-local", 
        rules: { required: "End Time is required" } 
      },
    ],
    "Crowd Restriction": [
      {
        name: "threshold",
        label: "Threshold",
        type: "number",
        rules: { required: "Threshold is required" },
      },
      {
        name: "startTime",
        label: "Start Time",
        type: "datetime-local",
        rules: { required: "Start Time is required" },
      },
      {
        name: "endTime",
        label: "End Time",
        type: "datetime-local",
        rules: { required: "End Time is required" },
      },
    ],
  };
  