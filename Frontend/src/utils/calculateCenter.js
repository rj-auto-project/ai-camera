import { kmeans } from "ml-kmeans/src/kmeans";

function findMaxOccurrenceIndices(arr) {
  const elementCount = new Map();
  let maxCount = 0;
  let maxElement = arr[0];

  for (const el of arr) {
    const count = (elementCount.get(el) || 0) + 1;
    elementCount.set(el, count);
    if (count > maxCount) {
      maxCount = count;
      maxElement = el;
    }
  }

  return arr.reduce((indices, el, index) => {
    if (el === maxElement) indices.push(index);
    return indices;
  }, []);
}

export const calculateCenter = (data) => {
  if (!Array.isArray(data) || data.length === 0) {
    console.warn("Invalid input data for calculateCenter");
    return null;
  }

  const coordinates = data.map((coordinate) => [coordinate[0], coordinate[1]]);
  const clusterCount = Math.max(
    2,
    Math.min(5, Math.floor(coordinates.length / 2))
  );

  try {
    const clusters = kmeans(coordinates, clusterCount);
    const clusterAssignments = clusters.clusters;
    const maxOccurrenceIndices = findMaxOccurrenceIndices(clusterAssignments);

    console.log("clusters", clusters);
    const mostFrequentClusterCoordinates = maxOccurrenceIndices.map(
      (index) => coordinates[index]
    );

    const center = mostFrequentClusterCoordinates
      .reduce(
        (acc, coord) => acc.map((val, idx) => val + coord[idx]),
        new Array(coordinates[0].length).fill(0)
      )
      .map((val) => val / mostFrequentClusterCoordinates.length);

    return center;
  } catch (error) {
    console.error("Error in calculateCenter:", error);
    return null;
  }
};
