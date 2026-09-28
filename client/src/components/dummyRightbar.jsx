import React, { useContext, useState } from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import { X } from "lucide-react";
import { AppContext } from '../context/AppContext';

const RightSidebar = () => {
  const { selectedUser, showRightSidebar, setShowRightSidebar, rightSidebarRef } = useContext(AppContext);
  const [showBlockModal, setShowBlockModal] = useState(false);

  if (!showRightSidebar || !selectedUser) return null;

  return (
    <div
      className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`}
      ref={rightSidebarRef}
    >
      {/* Close Button */}
      <div className='absolute top-4 right-4'>
        <button
          className="hover:bg-blue-950 hover:bg-opacity-20 hover:rounded-full"
          title="Close"
          onClick={() => { setShowRightSidebar(false) }}
        >
          <X size={20} />
        </button>
      </div>

      {/* User Info */}
      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full' />
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 bg-green-500 rounded-full'></p>
          {selectedUser.fullName}
        </h1>
        <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

      {/* Media Files */}
      <hr className='border-[#ffffff50] my-4' />
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {imagesDummyData.map((url, index) => (
            <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md' />
            </div>
          ))}
        </div>
      </div>

      {/* Block & Report Buttons */}
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={() => setShowBlockModal(true)}
          className="bg-red-600 hover:bg-red-700 transition-all text-white text-sm font-medium py-2 px-6 rounded-full shadow-md"
        >
          Block
        </button>
        <button
          onClick={() => console.log("Reported")}
          className="bg-orange-500 hover:bg-orange-600 transition-all text-white text-sm font-medium py-2 px-6 rounded-full shadow-md"
        >
          Report
        </button>
      </div>

      {/* Block Modal */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-[#1f1f1f] text-white p-6 rounded-xl max-w-sm w-full shadow-lg space-y-4 relative">
            <h3 className="text-lg font-semibold">Block {selectedUser.fullName}?</h3>
            <p className="text-sm text-gray-300">
              Blocked contacts will no longer be able to send you messages.
            </p>
            <div className='flex justify-end gap-4 pt-4'>
              <button
                onClick={() => setShowBlockModal(false)}
                className='text-sm px-4 py-2 rounded bg-gray-600 hover:bg-gray-700'
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log(`Blocked ${selectedUser.fullName}`);
                  setShowBlockModal(false);
                }}
                className='bg-red-600 hover:bg-red-700 transition-all text-white text-sm font-medium py-2 px-6 rounded-full shadow-md'
              >
                Confirm Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RightSidebar;