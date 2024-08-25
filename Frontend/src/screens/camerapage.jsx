import React from 'react'
import { useParams } from 'react-router-dom'

const CameraPage = () => {
    const { cameraId } = useParams();
  return (
    <div>
      <h1>{`CAMERA ID:${cameraId}`}</h1>
    </div>
  )
}

export default CameraPage
