// Set Cesium Ion access token
Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJiNmE1YjE1MC0zY2M2LTRmYTctYWE3Zi0wYTJiY2ExN2IwZGMiLCJpZCI6MjY2MDc4LCJpYXQiOjE3MzU5OTE0MDl9.0IER-7oZC7H3Rba57JEZWM5594EKaKie4-uyx-o3qgs';

// Check for createWorldTerrain support
let terrainProvider;
if (Cesium.createWorldTerrain) {
  terrainProvider = Cesium.createWorldTerrain(); // Use world terrain if available
} else {
  terrainProvider = new Cesium.EllipsoidTerrainProvider(); // Fallback terrain
}

// Initialize Cesium Viewer
const viewer = new Cesium.Viewer('cesiumContainer', {
  terrainProvider: terrainProvider,
  animation: false,
  timeline: false,
  baseLayerPicker: false,
});

// Function to upload file and display on map
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const latitude = parseFloat(document.getElementById('latitude').value);
  const longitude = parseFloat(document.getElementById('longitude').value);
  const altitude = parseFloat(document.getElementById('altitude').value || 0);

  if (!fileInput.files.length) {
    alert('Please select an OBJ file to upload.');
    return;
  }

  if (isNaN(latitude) || isNaN(longitude)) {
    alert('Please enter valid latitude and longitude.');
    return;
  }

  const formData = new FormData();
  formData.append('file', fileInput.files[0]);

  try {
    const response = await fetch('http://localhost:3000/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (response.ok) {
      console.log('File uploaded:', result.fileUrl);
      addModelToMap(result.fileUrl, longitude, latitude, altitude);
    } else {
      alert(result.message);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Failed to upload file.');
  }
}

// Function to add the model to Cesium map
function addModelToMap(url, longitude, latitude, altitude) {
  const position = Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude);
  viewer.entities.add({
    name: 'Uploaded 3D Model',
    position: position,
    model: {
      uri: url,
      scale: 1.0,
    },
  });

  // Fly camera to the model
  viewer.camera.flyTo({
    destination: Cesium.Cartesian3.fromDegrees(longitude, latitude, altitude + 500),
  });
}
