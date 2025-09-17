const API_URL = "http://localhost:5000";

// Add farmer
document.getElementById("farmerForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const data = {
    name: this.name.value,
    farm_location: this.farm_location.value,
    crops: this.crops.value.split(",")
  };
  await fetch(`${API_URL}/farmers`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  alert("✅ Farmer added to MongoDB!");
  this.reset();
});

// Add sensor
document.getElementById("sensorForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const data = {
    sensor_id: this.sensor_id.value,
    location: this.location.value,
    type: this.type.value
  };
  await fetch(`${API_URL}/sensors`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  alert("✅ Sensor added to MongoDB!");
  this.reset();
});

// Add reading
document.getElementById("readingForm").addEventListener("submit", async function(e) {
  e.preventDefault();
  const data = {
    sensor_id: this.sensor_id.value,
    value: parseInt(this.value.value)
  };
  await fetch(`${API_URL}/readings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });
  alert("✅ Reading added to MongoDB!");
  this.reset();

  loadAlerts(); // refresh alerts
});

// Load alerts into table
async function loadAlerts() {
  const res = await fetch(`${API_URL}/alerts`);
  const alerts = await res.json();
  const table = document.querySelector("#alertsTable tbody");
  table.innerHTML = "";
  alerts.forEach(a => {
    const row = `<tr>
      <td>${a.farmer_id ? a.farmer_id.name : "Unknown"}</td>
      <td>${a.sensor_id}</td>
      <td>${a.alert_message}</td>
      <td>${new Date(a.timestamp).toLocaleString()}</td>
    </tr>`;
    table.innerHTML += row;
  });
}

// Load alerts on page load
loadAlerts();
