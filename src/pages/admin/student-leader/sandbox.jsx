import React from "react";
import { InputBox } from "../../../components/components";

export default function SayWhat() {
  return (
    <div className=" absolute inset-0 bg-black/75 backdrop-blur-3xl z-100 flex items-center justify-center">
      <div className="h-9/10 flex-col max-w-4xl gap-4 w-full bg-gray-100  flex items-center px-8 py-6">
        <h1 className="text-3xl font-bold text-cnsc-primary-color">
          WELCOME TO INITIAL REGISTRATION
        </h1>
        <small> Set up Your Organization Initial Information Here</small>
        <div className="h-fit w-full border bg-white px-4 py-2">
          <h1>Organization Information</h1>
          <div className="grid grid-cols-3  gap-x-6 gap-y-4">
            <div className="flex flex-col  col-span-2 gap-2">
              <label className="block text-lg font-medium text-gray-700 ">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orgName"
                className={InputBox}
                placeholder="(Example: Union of Supreme Student Government)"
              />
              <p className="text-red-500 text-lg px-4 ">error</p>
            </div>
            <div className="flex flex-col gap-2">
              <label className="block text-lg font-medium text-gray-700 ">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orgName"
                className={InputBox}
                placeholder="(Example: USSG)"
              />
              <p className="text-red-500 text-lg px-4 ">error</p>
            </div>

            <div className="flex col-span-3 flex-col gap-2">
              <label className="block text-lg font-medium text-gray-700 ">
                Organization Email<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="orgName"
                className={InputBox}
                placeholder="(Example: USSG)"
              />
              <p className="text-red-500 text-lg px-4 ">error</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
// function LeftSide() {
//   return (
//     <div className="border-2 p-4 flex ">
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content This is LeftSide content This is LeftSide content
//       This is LeftSide content
//     </div>
//   );
// }
// function RightSide() {
//   return <div className="border-2 p-4 flex">This isright content</div>;
// }

// export default function TableRowToNav() {
//   return (
//     <div className="border-4 h-full w-full flex overflow-hidden">
//       <div className="h-full   max-w-1/5 overflow-auto">
//         <LeftSide />
//       </div>
//       <div className="h-full flex-1 border-red-500 border-12 max-w-full">
//         <RightSide />
//       </div>
//     </div>
//   );
// }
