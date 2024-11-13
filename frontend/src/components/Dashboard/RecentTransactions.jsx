import React, { useEffect, useState } from "react";
import { FiArrowUpRight, FiDollarSign, FiMoreHorizontal } from "react-icons/fi";
import { FaTemperatureHigh } from "react-icons/fa6";

export const RecentTransactions = () => {
  const [sensorData, setSensorData] = useState([]);

  useEffect(() => {
    // Fetch data from the API
    fetch("http://localhost:3000/api/data")
      .then((response) => response.json())
      .then((data) => {
        // Set only the nilai_suhu_max_humid_max data
        setSensorData(data.nilai_suhu_max_humid_max);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return (
    <div className="col-span-12 p-4 rounded border border-stone-300">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="flex items-center gap-1.5 font-medium">
        <FaTemperatureHigh/> Histori data
        </h3>
        <button className="text-sm text-violet-500 hover:underline">
          See all
        </button>
      </div>
      <table className="w-full table-auto">
        <TableHead />

        <tbody>
          {sensorData.map((row, index) => (
            <TableRow
              key={row.idx}
              cusId={row.idx}
              sku={`Suhu: ${row.suhu}°C`}
              date={new Date(row.timestamp).toLocaleDateString()}
              price={`Humid: ${row.humid}%`}
              kecerahan={`Kecerahan: ${row.kecerahan}`}
              order={index + 1}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

const TableHead = () => {
  return (
    <thead>
      <tr className="text-sm font-normal text-stone-500">
        <th className="text-start p-1.5">ID</th>
        <th className="text-start p-1.5">Suhu</th>
        <th className="text-start p-1.5">Date</th>
        <th className="text-start p-1.5">Humid</th>
        <th className="text-start p-1.5">Kecerahan</th>
      </tr>
    </thead>
  );
};

const TableRow = ({ cusId, sku, date, price, kecerahan, order }) => {
  return (
    <tr className={order % 2 ? "bg-stone-100 text-sm" : "text-sm"}>
      <td className="p-1.5">
        <a href="#" className="text-violet-600 underline flex items-center gap-1">
          {cusId} <FiArrowUpRight />
        </a>
      </td>
      <td className="p-1.5">{sku}</td>
      <td className="p-1.5">{date}</td>
      <td className="p-1.5">{price}</td>
      <td className="p-1.5">{kecerahan}</td>
    </tr>
  );
};
