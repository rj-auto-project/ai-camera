export const getLocationFromCoordinates = async (coordinates) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${coordinates[0]}&lon=${coordinates[1]}&format=json`
    );
    const data = await response.json();
    
    if (!data?.address) return null;

    const { address } = data;
    const locationFields = ['suburb', 'road', 'city', 'town', 'village', 'postcode'];
    
    const locationParts = locationFields
      .map(field => address[field])    // Extract the address fields
      .filter(Boolean);               // Filter out undefined or null values

    return locationParts.join(", ");
    
  } catch (error) {
    console.error('Error fetching location:', error);
    return null;
  }
};
