import React, { useEffect, useState } from "react";

export const TopBar = () => {
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

  // Ambil nilai month_year_max untuk ditampilkan
  const monthYear = sensorData.month_year_max?.[0]?.month_year || "No Data";

  return (
    <div className="border-b px-4 mb-4 mt-2 pb-4 border-stone-200">
      <div className="flex items-center justify-between p-0.5">
        <div>
          <span className="text-sm font-bold block">🚀 Good morning!</span>
          <span className="text-xs block text-stone-500">
            {/* Tambahkan data lainnya jika diperlukan */}
          </span>
        </div>

        <button className="flex text-sm items-center gap-2 bg-stone-100 transition-colors hover:bg-violet-100 hover:text-violet-700 px-3 py-1.5 rounded">
          {/* Ganti teks dengan nilai month_year */}
          <span>{monthYear}</span>
        </button>
      </div>
    </div>
  );
};
