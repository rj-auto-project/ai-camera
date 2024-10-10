import cameraService from "../services/setttings.services.js";

const addCamera = async (req, res) => {
  console.log(req.body);
  const existingCamera = await cameraService.getCameraById(req.body.cameraId);

  if (existingCamera) {
    return res.status(409).json({ error: "Camera already exists" });
  }
  try {
    const newCamera = await cameraService.addCamera(req.body);
    return res.status(201).json(newCamera);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Failed to add camera" });
  }
};
const getCamera = async (req, res) => {
  try {
    const { id } = req.params;
    const camera = await cameraService.getCameraById(id);
    if (!camera) {
      return res.status(404).json({ error: "Camera not found" });
    }
    return res.status(200).json(camera);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch camera" });
  }
};

const updateCamera = async (req, res) => {
  try {
    const { id } = req.params;
    const cameraData = req.body;
    const updatedCamera = await cameraService.updateCamera(id, cameraData);
    return res.status(200).json(updatedCamera);
  } catch (error) {
    return res.status(500).json({ error: "Failed to update camera" });
  }
};

const getAllCameras = async (req, res) => {
  try {
    const { skip, take } = req.query;
    const cameras = await cameraService.getAllCameras(skip, take);
    return res.status(200).json(cameras);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch cameras" });
  }
};

export { getAllCameras, getCamera, updateCamera, addCamera };
