import React, { useContext, useState} from 'react'
import assets, { imagesDummyData } from '../assets/assets'
import {X} from "lucide-react";
import { AppContext } from '../context/AppContext';
import { ChatContext } from '../context/ChatContext';


const RightSidebar = () => {

  const {showRightSidebar, setShowRightSidebar, rightSidebarRef} = useContext(AppContext)
  const  {users, getUsers, selectedUser} = useContext(ChatContext);
  const [showBlock, setShowBlock] = useState(false)


  if (!showRightSidebar || !selectedUser) return null;

  return selectedUser &&(
    <div className={`bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll ${selectedUser ? "max-md:hidden" : ""}`} ref={rightSidebarRef}>

      {/*--------close button----------*/}
      <div className='absolute top-4 right-4'>
      <button className="hover:bg-blue-950 hover:bg-opacity-20 hover:rounded-full" title="Close" onClick={() =>{setShowRightSidebar(false)}}><X size={20}/></button>
      </div>

      {/*-------user info-------*/}

      <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
        <img src={selectedUser?.profilePic || assets.avatar_icon} alt="" className='w-20 aspect-[1/1] rounded-full'/>
        <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
          <p className='w-2 h-2 bg-green-500 rounded-full'></p>
          {selectedUser.fullName}</h1>
          <p className='px-10 mx-auto'>{selectedUser.bio}</p>
      </div>

       {/*-----------displaying media files----------*/}
       <hr className='border-[#ffffff50] my-4'/>
      <div className='px-5 text-xs'>
        <p>Media</p>
        <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
          {imagesDummyData.map((url, index)=>(
            <div key={index} onClick={()=> window.open(url)} className='cursor-pointer rounded'>
              <img src={url} alt="" className='h-full rounded-md'/>
            </div>
          ))}
        </div>
      </div>

{/*---------Action Buttons----------*/}
<div className='absolute bottom-5 left-1/2 transform -translate-x-1/2 flex gap-4'>
  <button
    onClick={() => setShowBlock(true)} 
    className='bg-red-600 hover:bg-red-700 transition-all text-white text-sm font-medium py-2 px-6 rounded-full shadow-md'>
    Block
  </button>
  <button
    onClick={() => console.log("Reported")}
    className='bg-orange-500 hover:bg-orange-600 transition-all text-white text-sm font-medium py-2 px-6 rounded-full shadow-md'>
    Report
  </button>
</div>

    </div>
  )
}

export default RightSidebar