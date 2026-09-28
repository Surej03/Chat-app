import React, { useContext} from 'react'
import LeftSidebar from '../components/LeftSidebar'
import ChatContainer from '../components/chatContainer'
import RightSidebar from '../components/RightSidebar'
import { AppContext } from '../context/AppContext'
import { ChatContext } from '../context/ChatContext'

const HomePage = () => {

  const {selectedUser} = useContext(ChatContext)
  const {showRightSidebar} = useContext(AppContext)


  return (
    <div className='w-screen h-screen bg-[#0f0f0f]'>
      <div className={`grid h-full w-full overflow-hidden grid-cols-1
        ${selectedUser ? showRightSidebar ? 'md:grid-cols-[1.2fr_2fr_1.2fr]' : 'md:grid-cols-[1fr_2fr]': 'md:grid-cols-2'}`}>
        <LeftSidebar />
        <ChatContainer />
        <RightSidebar />
      </div>
    </div>
  )
}


export default HomePage