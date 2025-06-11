import React, { useState } from "react";

const data = [
  { id: 1, name: "Item One", description: "This is the first item's details." },
  { id: 2, name: "Item Two", description: "Details for item two go here." },
  {
    id: 3,
    name: "Item Three",
    description: "Info about item three is shown here.",
  },
];

export default function TableRowToNav() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Navigation bar */}
      <div className="bg-white shadow p-4 rounded mb-4">
        <h2 className="text-xl font-bold">Selected:</h2>
        {selected ? (
          <div className="text-blue-600 font-medium">{selected.name}</div>
        ) : (
          <div className="text-gray-500">Click a row to select an item</div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded shadow">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left px-4 py-2">ID</th>
              <th className="text-left px-4 py-2">Name</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-blue-100 cursor-pointer"
                onClick={() => setSelected(item)}
              >
                <td className="border px-4 py-2">{item.id}</td>
                <td className="border px-4 py-2">{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Section */}
      {selected && (
        <div className="mt-6 p-4 bg-white shadow rounded">
          <h3 className="text-lg font-semibold mb-2">Details</h3>
          <p>{selected.description}</p>
        </div>
      )}
    </div>
  );
}
