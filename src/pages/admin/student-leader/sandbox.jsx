import React from "react";

function LeftSide() {
  return (
    <div className="border-2 p-4 flex ">
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content This is LeftSide content This is LeftSide content
      This is LeftSide content
    </div>
  );
}
function RightSide() {
  return <div className="border-2 p-4 flex">This isright content</div>;
}

export default function TableRowToNav() {
  return (
    <div className="border-4 h-full w-full flex overflow-hidden">
      <div className="h-full   max-w-1/5 overflow-auto">
        <LeftSide />
      </div>
      <div className="h-full flex-1 border-red-500 border-12 max-w-full">
        <RightSide />
      </div>
    </div>
  );
}
