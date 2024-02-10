import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage"
import { useEffect, useRef, useState } from "react"
import { useSelector , useDispatch } from "react-redux"
import { updateUserStart , updateUserFailure , updateUserSuccess, deleteUserFailure, deleteUserStart, deleteUserSuccess, signOutUserFailure, signOutUserSuccess, signOutUserStart } from "../redux/user/userSlice"
import { app } from "../firebase"
import { Link } from "react-router-dom"


interface FormData {
  avatar?: string; // Assuming 'avatar' is a string property
  // Add other properties as needed
}

const Profile = () => {
  const { currentUser , loading , error } = useSelector((state : any) => state.user)
  const fileRef = useRef<HTMLInputElement | null>(null)
  const [file, setFile] = useState<File | undefined>(undefined)
  const [filePercent , setFilePercent] = useState(0)
  const [fileError, setFileError] = useState(false)
  const [formData, setFormData] = useState<FormData>({})
  const [update, setUpdate] = useState(false)
  const [showListingError, setShowListingError] = useState(false)
  const [listings, setListings] = useState([])
  const dispatch = useDispatch()


  // console.log('file' , currentUser)

  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file: any) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);

    const uploadTask = uploadBytesResumable(storageRef , file)

    uploadTask.on('state_changed' , (snapshot) => {  
      const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
      setFilePercent(Math.round(progress)) 
    },
    (error : any) => {
      setFileError(true)
      console.log('err' , error)
    },
    () => {
      getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        setFormData({...formData , avatar: downloadURL})
      })
    }
    )
  }

  const handleChange = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    })
  }
  // console.log("formData" , formData)

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try{
      dispatch(updateUserStart());

      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'PUT',
        headers: {
          "Content-Type" : "application/json",
        },
        body: JSON.stringify(formData)
      });
      const data = await res.json()
      console.log('data' , data)

      if(data.success == false){
        dispatch(updateUserFailure(data.message))
        return;
      }
      dispatch(updateUserSuccess(data))
      setUpdate(true)
    }
    catch(error : any){
      dispatch(updateUserFailure(error.message))
    }
  }

  const handleDelete = async() => {
    try{

      dispatch(deleteUserStart())

      const res = await fetch(`/api/user/delete/${currentUser._id}` , {
        method : 'DELETE',     
      })
  
      const data =  await res.json();

      if(data.success == false){
        dispatch(deleteUserFailure(data.message))
        return;
      }

      dispatch(deleteUserSuccess(data))
    }
    catch(error : any){
     dispatch(deleteUserFailure(error.message))
    }
    
  }

  const handleSignOut = async() => {
    try{

      dispatch(signOutUserStart()) 
      const res = await fetch('/api/auth/sign-out')
      const data =  await res.json();

      if(data.success == false){
        dispatch(signOutUserFailure(data.message))
        return;
      }

      dispatch(signOutUserSuccess(data))

    }
    catch(error : any){
       dispatch(signOutUserFailure(error.message))
    }
    
  }

  const handleShowListing = async() => {
    try{
      setShowListingError(false)
      const res = await fetch(`/api/user/listing/${currentUser._id}`)
      const data =  await res.json();

      if(data.success == false){
        setShowListingError(true)
        return;
      }
      setListings(data)
      
    }
    catch(error){
      setShowListingError(true)
    }
  }

  const handleDeleteListing = async(listingId : string) => {
    try{
      const res = await fetch(`/api/list/delete/${listingId}` , {
        method: 'DELETE',
      });

      const data = await res.json();

      if(data.success == false){
        console.log('error in deletion');
        return
      }
      setListings((prev) => prev.filter((item : any) => item._id !== listingId));
    }
    catch(error){
      console.log(error , 'error')
    }
  }

  console.log('listing' , listings)

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
      <input type="file" ref={fileRef} hidden onChange={(e) => e.target.files && setFile(e.target.files[0])}/>
      <img src={formData.avatar || currentUser.avatar} alt="profile-pic" className="rounded-xl w-24 h-24 object-cover
      self-center mt-2 cursor-pointer" onClick={() => fileRef.current && fileRef.current.click()}/>
      <p className="text-center">
          {fileError ? (
            <span className="text-red-700">Error in image upload</span>
             ) : filePercent > 0 && filePercent < 100 ? (
            <span className="text-slate-700">{`Uploading file ${filePercent}%`}</span>
            ) : filePercent === 100 && !fileError? (
            <span className="text-green-700">File uploaded successfully</span>
          ) : null}
      </p>

      <input placeholder="username" id="username" className="border p-3 rounded-lg outline-none" type="text"
      defaultValue={currentUser.username} onChange={handleChange}/>
      <input placeholder="email" id="email" className="border p-3 rounded-lg outline-none" type="email"
      defaultValue={currentUser.email} onChange={handleChange}
      />
      <input placeholder="password" id="password" className="border p-3 rounded-lg outline-none" type="password" onChange={handleChange}/>
      <button className="text-white bg-slate-700 rounded-lg uppercase p-3 hover:bg-slate-600
      disabled:opacity-85" disabled={loading}>{loading ? "updating..." : "update"}</button>
      
      <Link className="uppercase bg-green-700 text-white rounded-lg p-3 text-center" 
      to={"/create-listing"}>create listing</Link>
      
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer font-lg" onClick={handleDelete}>Delete account</span>
        
        <span className="text-red-700 cursor-pointer font-lg" onClick={handleSignOut}>Sign out</span>
        
      </div>

      <p className="text-red-700">{error ? error : ""} </p>
      <p className="text-green-600">{update ? "user update successfully!" : ""} </p>
      <button className="text-green-700 w-full mx-auto" onClick={handleShowListing}>Show Listings</button>
      <p className="text-red-700 mt-5">{showListingError ? "error showing listing" : ""}</p>

      <h1 className="text-xl text-center mb-2">Your Listings</h1> 
      {listings && listings.length > 0 && listings.map((item : any) => (
        <div className="flex flex-row items-center justify-between border-white border-[2px] rounded-lg p-2 mb-2 hover:opacity-95 hover:bg-slate-200" key={item._id}>
          <Link to={`/listing/${item._id}`}>
            <img src={item.imageUrls[0]} alt="listingImage" className="w-20 h-20 object-contain"/>
          </Link>
          <Link to={`/listing/${item._id}`}>
            <p className="text-base uppercase">{item.name}</p>
          </Link>
          <div className="flex flex-col">
            <Link to={`/edit-listing/${item._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
            </Link>
            <button className="text-red-700 uppercase" onClick={() => handleDeleteListing(item._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Profile