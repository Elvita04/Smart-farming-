const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ Connect to MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/smart_farm", {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log(err));

// ✅ Define Schemas
const Farmer = mongoose.model("Farmer", new mongoose.Schema({
  name: String,
  farm_location: String,
  crops: [String]
}));

const Sensor = mongoose.model("Sensor", new mongoose.Schema({
  sensor_id: String,
  location: String,
  type: String
}));

const Reading = mongoose.model("Reading", new mongoose.Schema({
  sensor_id: String,
  timestamp: { type: Date, default: Date.now },
  value: Number
}));

const Alert = mongoose.model("Alert", new mongoose.Schema({
  farmer_id: mongoose.Schema.Types.ObjectId,
  sensor_id: String,
  alert_message: String,
  timestamp: { type: Date, default: Date.now }
}));

// ✅ Routes

// Add farmer
app.post("/farmers", async (req, res) => {
  const farmer = new Farmer(req.body);
  await farmer.save();
  res.json(farmer);
});

// Add sensor
app.post("/sensors", async (req, res) => {
  const sensor = new Sensor(req.body);
  await sensor.save();
  res.json(sensor);
});

// Add reading + generate alert if needed
app.post("/readings", async (req, res) => {
  const reading = new Reading(req.body);
  await reading.save();

  // generate alert if value < 35
  if (reading.value < 35) {
    const farmer = await Farmer.findOne(); // simple: take first farmer
    const alert = new Alert({
      farmer_id: farmer ? farmer._id : null,
      sensor_id: reading.sensor_id,
      alert_message: "Soil moisture below 35%. Please irrigate!"
    });
    await alert.save();
  }

  res.json(reading);
});

// Fetch alerts
app.get("/alerts", async (req, res) => {
  const alerts = await Alert.find().populate("farmer_id");
  res.json(alerts);
});

// ✅ Start server
app.listen(5000, () => console.log("🚀 Server running on http://localhost:5000"));
