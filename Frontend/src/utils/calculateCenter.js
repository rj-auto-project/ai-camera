export const calculateCenter = (cameras) => {
  if (cameras?.length === 0) return [51.505, -0.09]; 

  const latSum = cameras.reduce(
    (sum, camera) => sum + camera.coordinates[0],
    0,
  );
  const lonSum = cameras.reduce(
    (sum, camera) => sum + camera.coordinates[1],
    0,
  );

  const latCenter = latSum / cameras.length;
  const lonCenter = lonSum / cameras.length;

  return [latCenter, lonCenter];
};
