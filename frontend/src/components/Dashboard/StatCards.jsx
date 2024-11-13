import React, { useEffect, useState } from "react";

export const StatCards = () => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        setSensorData(data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  if (!sensorData) {
    return <p>Loading...</p>;
  }

  return (
    <Card
      title="DHT 22"
      value={sensorData.suhumax}
      value1={sensorData.suhumin}
      value2={sensorData.suhurata}
    />
  );
};

const Card = ({ title, value, value1, value2 }) => {
  return (
    <div className="col-span-4 p-4 rounded border border-stone-300">
      <div className="flex mb-8 items-start justify-between">
        <div>
          <h3 className="text-stone-500 mb-2 text-sm">{title}</h3>
          <p className="text-3xl font-semibold">Suhu Max: {value}°C</p>
          <p className="text-3xl font-semibold">Suhu Min: {value1}°C</p>
          <p className="text-3xl font-semibold">Suhu Rata-rata: {value2}°C</p>
        </div>
      </div>
    </div>
  );
};
