import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AppContext } from '../context/AppContext'

const ProfilePage = () => {

  const {selectedImage, setSelectedImage, navigate, authUser, updateProfile} = useContext(AppContext);
  const [name, setName] = useState(authUser.fullName);
  const [bio, setBio] = useState(authUser.bio);

  const handleSubmit =  async(e) =>{
    e.preventDefault();
    if (!selectedImage) {
      await updateProfile({fullName : name, bio});
      navigate('/')
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(selectedImage);
    reader.onload = async () => {
      const base64Img = reader.result;
      await updateProfile({profilePic : base64Img, fullName: name, bio});
      setSelectedImage(null)
      navigate('/')
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center'>
      <div className='w-5/6 max-w-2xl text-gray-300 border border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-lg'>
            Profile details 
          </h3>

          {/*------------Profile icon----------*/}

          <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
          <input onChange={(e)=> setSelectedImage(e.target.files[0])} type="file" id='avatar' accept='.jpg, .png, .jpeg' hidden/>
          <img className={`w-12 h-12 ${selectedImage && 'rounded-full'}`} 
          src={selectedImage ? URL.createObjectURL(selectedImage) : authUser?.profilePic || assets.avatar_icon} alt="" /> upload profile image
          </label>

        {/*----------User name----------*/}

        <input onChange={(e)=>setName(e.target.value)} value={name} type="text" placeholder='Your name' 
        className='p-2 text-[#0f0f0f]  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500'/>
        <textarea rows={4} onChange={(e)=>setBio(e.target.value)} value={bio}
            className='p-2 text-[#0f0f0f]  border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500' placeholder='Add bio... '>
        </textarea>
        <button type="submit" className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'>
          Save
        </button>
        </form>
        <img src={selectedImage ? URL.createObjectURL(selectedImage) : authUser?.profilePic || assets.logo_icon} alt="profilePic" className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImage && 'rounded-full'}`}/>
      </div>
    </div>
  )
}

export default ProfilePage