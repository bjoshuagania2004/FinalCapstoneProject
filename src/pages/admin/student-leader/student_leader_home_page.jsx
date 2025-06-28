import { useEffect, useState } from "react";

export default function StudentHomeSection({ orgInfo, loading, errorMsg }) {
  if (loading) return <p>Loading organization info...</p>;
  if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

  return (
    <div>
      <h2 className="text-black">
        Welcome to the Home Page {orgInfo?.orgName}
      </h2>
      {/* Add more organization details below if needed */}
      <p>Type: {orgInfo?.orgClass}</p>
      <p>Adviser: {orgInfo?.adviserName}</p>
    </div>
  );
}
