export const getLocationFromCoordinates = async (coordinates) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&format=json`
    );
    const data = await response.json();

    if (!data?.address) return null;

    const { address } = data;
    const locationFields = [
      "road", // Most specific: a particular street/road.
      "suburb", // A local area within a city.
      "neighbourhood", // Specific small area (optional).
      "hamlet", // Small settlement or cluster of houses.
      "village", // Small residential area.
      "town", // A town or small urban area.
      "city", // A larger urban area.
      "postcode",
      "county", // An administrative region within a state.
    ];

    const locationParts = locationFields
      .map((field) => address[field]) // Extract the address fields
      .filter(Boolean); // Filter out undefined or null values

    console.log(address);
    return locationParts.join(", ");
  } catch (error) {
    console.error("Error fetching location:", error);
    return null;
  }
};
