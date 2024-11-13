const express = require("express");
const bodyParser = require("body-parser");
const mqtt = require("mqtt");
const mysql = require("mysql2");

const app = express();
const PORT = 3000;

const cors = require("cors");

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Koneksi ke MySQL
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // Ganti dengan password MySQL Anda
  database: "uts_152022032",
});

db.connect((err) => {
  if (err) {
    console.error("Koneksi ke database gagal:", err);
    return;
  }
  console.log("Koneksi ke database berhasil");
});

// Koneksi ke MQTT broker
const mqttClient = mqtt.connect("mqtt://broker.hivemq.com");
const MQTT_TOPIC = "sensor/dht22/152022032";

mqttClient.on("connect", () => {
  console.log("Terhubung ke broker MQTT");
  mqttClient.subscribe(`${MQTT_TOPIC}`, (err) => {
    if (!err) {
      console.log(`Berlangganan ke topik ${MQTT_TOPIC}`);
    }
  });
});

mqttClient.on(`message`, (topic, message) => {
  if (topic === `${MQTT_TOPIC}`) {
    const data = JSON.parse(message.toString());
    const { suhu, humid, kecerahan } = data;

    // Simpan ke database
    const query = "INSERT INTO sensor_data (suhu, humid, kecerahan) VALUES (?, ?, ?)";
    db.query(query, [suhu, humid, kecerahan], (err, results) => {
      if (err) {
        console.error("Gagal menyimpan data ke database:", err);
      } else {
        console.log("Data berhasil disimpan:", results.insertId);
      }
    });
  }
});

app.get("/api/data", (req, res) => {
  const querySuhu = "SELECT MAX(suhu) AS suhuMax, MIN(suhu) AS suhuMin, AVG(suhu) AS suhuRata FROM sensor_data";
  const queryDetail = `
          SELECT id AS idx, suhu, humid, kecerahan, timestamp 
          FROM sensor_data 
          WHERE suhu = (SELECT MAX(suhu) FROM sensor_data) 
          OR humid = (SELECT MAX(humid) FROM sensor_data)
      `;
  const queryMonthYear = `
          SELECT DISTINCT DATE_FORMAT(timestamp, '%m-%Y') AS month_year 
          FROM sensor_data 
          WHERE suhu = (SELECT MAX(suhu) FROM sensor_data) 
          OR humid = (SELECT MAX(humid) FROM sensor_data)
      `;

  db.query(querySuhu, (err, suhuResults) => {
    if (err) {
      return res.status(500).json({ error: "Gagal mengambil data suhu" });
    }

    const suhuMax = suhuResults[0]?.suhuMax || 0;
    const suhuMin = suhuResults[0]?.suhuMin || 0;
    const suhuRata = suhuResults[0]?.suhuRata || 0;

    db.query(queryDetail, (err, detailResults) => {
      if (err) {
        return res.status(500).json({ error: "Gagal mengambil data detail" });
      }

      db.query(queryMonthYear, (err, monthYearResults) => {
        if (err) {
          return res.status(500).json({ error: "Gagal mengambil data bulan dan tahun" });
        }

        // Susun format JSON
        const response = {
          suhumax: suhuMax,
          suhumin: suhuMin,
          suhurata: suhuRata,
          nilai_suhu_max_humid_max: detailResults.map((row) => ({
            idx: row.idx,
            suhu: row.suhu,
            humid: row.humid,
            kecerahan: row.kecerahan,
            timestamp: row.timestamp,
          })),
          month_year_max: monthYearResults.map((row) => ({
            month_year: row.month_year,
          })),
        };

        res.json(response);
      });
    });
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
