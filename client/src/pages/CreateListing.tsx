import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import  { useState } from 'react'
import { app } from '../firebase'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const CreateListing = () => {

  interface formData {
    name: string;
    description: string;
    address: string;
    furnished: boolean;
    bathrooms: number;
    bedrooms: number;
    parking: boolean;
    regularPrice: number;
    discountPrice: number;
    type: string;
    offer: boolean;
    imageUrls: string[];
    
  }

  const[images, setImages] = useState([])
  const[formData, setFormData] = useState<formData>({
    name: '',
    description: '',
    address: '',
    furnished: false,
    bathrooms : 0,
    bedrooms: 0,
    parking: false,
    regularPrice: 600,
    discountPrice: 0,
    type: 'sale',
    offer: false,
    imageUrls: [],
    
  })
  const [imageUploadError, setImageUploadError] = useState<any>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState(false);
  const { currentUser } = useSelector((state : any) => state.user)
  const navigate = useNavigate();


  const handleImageSubmit = () => {
    if (images.length > 0 && images.length + formData.imageUrls.length < 7 ) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < images.length; i++) {
        promises.push(storeImage(images[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls as string[]),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch(() => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async(image : any) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + image.name;
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef , image);

      uploadTask.on("state_changed" , (snapshot) => {  
        const progress = (snapshot.bytesTransferred/snapshot.totalBytes) * 100;
        console.log('progress' , progress) 
      },
      (error) => {
        return reject(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
        .then((downloadURL) => {
        return resolve(downloadURL)
      })
      })
    })
  }

  const handleRemoveImage = (index:  number) => {
    setFormData({
      ...formData,
      imageUrls: formData.imageUrls.filter((_, i) => i !== index)
    })
  }

  const handleChange = (e : any) => {
    if(e.target.id === "sale" || e.target.id === "rent"){
      setFormData({
        ...formData,
        type: e.target.id,
      })
    }

    if(e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer"){
      setFormData({
        ...formData,
        [e.target.id] : e.target.checked
      })
    }

    if(e.target.type === "number"){
      setFormData({
        ...formData,
        [e.target.id] : parseInt(e.target.value)
      })
    }
    if(e.target.type === "text" || e.target.type === "textarea"){
      setFormData({
        ...formData,
        [e.target.id] : e.target.value
      })
    }
  }


  // console.log("formData" , currentUser)

  const handleSubmit = async(e : any)  => {
    e.preventDefault()
    // console.log("check" , formData)
    try{
      if(formData.imageUrls.length < 1) return setError('you must upload atleast one image')
      if(+formData.discountPrice > +formData.regularPrice ) return setError('discount price must be lesser then regular price')
      setLoading(true)
      setError('')

      const res = await fetch('/api/list/create' , {
        method : 'POST',
        headers : {
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          ...formData,
          userRef: currentUser._id
        })
      })

      const data = await res.json();

      if(data.success === false){
        setError(data.message) 
      } 

      navigate(`/listing/${data._id}`)


    }catch(error : any){
      setError(error.message)
      setLoading(false)
    }
    setLoading(false)
  }
  

  return (
    <main className='p-3 max-w-4xl mx-auto'>
      <h1 className='font-semibold my-7 text-center text-3xl'>Create a listing</h1>
      <form className='flex flex-col md:flex-row gap-6' onSubmit={handleSubmit}>
        <div className='flex flex-col gap-4 flex-1'>
        <input className='border p-3 rounded-lg' id='name' placeholder='Name' minLength={10} maxLength={25} 
        type='text' required onChange={handleChange} value={formData.name}/>
        <textarea className='border p-3 rounded-lg' id='description' 
        placeholder='Description' required onChange={handleChange} value={formData.description}/>
        <input className='border p-3 rounded-lg' id='address' placeholder='Address' 
        type='text' required onChange={handleChange} value={formData.address}/>
        <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-2'>
            <input type='checkbox' id="sale" className='w-5'
            onChange={handleChange} checked={formData.type == "sale"}/>
            <span>Sell</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id="rent" className='w-5'
            onChange={handleChange} checked={formData.type == "rent"}/>
            <span>Rent</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id="parking" className='w-5'  onChange={handleChange} 
            checked={formData.parking}/>
            <span>Parking spot</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id="furnished" className='w-5'  onChange={handleChange} 
            checked={formData.furnished}/>
            <span>Furnished</span>
          </div>
          <div className='flex gap-2'>
            <input type='checkbox' id="offer" className='w-5'  onChange={handleChange} 
            checked={formData.offer}/>
            <span>Offer</span>
          </div>
        </div>
        <div className='flex gap-6 flex-wrap'>
          <div className='flex gap-3 items-center'>
            <input type='number' id='bedrooms' min={1} max={10} required className='text-center p-[2px] border border-gray-300 rounded-lg'
            onChange={handleChange} value={formData.bedrooms}/>
            <span>Beds</span>
          </div>
          <div className='flex items-center gap-3'>
            <input type='number' id='bathrooms' min={1} max={10} required className='text-center p-[2px] border border-gray-300 rounded-lg'
            onChange={handleChange} value={formData.bathrooms}/>
            <span>Baths</span>
          </div>
          <div className='flex items-center gap-3'>
            <input type='number' id='regularPrice' min={600} max={1000000} required className='text-center p-[2px] border border-gray-300 rounded-lg'
            onChange={handleChange} value={formData.regularPrice}/>
            <div className='flex flex-col items-center'>
            <p>Regular Price</p>
            {formData.type === "rent" && <span className='text-xs'>(/month)</span>}
            
            </div>
          </div>
          {formData.offer && (
            <div className='flex items-center gap-3'>
            <input type='number' id='discountPrice' min={0} max={1000000} required className='text-center p-[2px] border border-gray-300 rounded-lg'
            onChange={handleChange} value={formData.discountPrice}/>
            <div className='flex flex-col items-center'>
            <p>Discounted Price</p>
            {formData.type === "rent" && <span className='text-xs'>(/month)</span>}
            </div>
          </div>
          )}
        </div>
        </div>
        <div className='flex flex-col flex-1 gap-4'>
          <div>
          <p className='font-semibold'>Images:
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover</span>
          </p>
          </div>
         
          <div className='flex gap-4'>
          <input className='p-3 border border-gray-300 w-full rounded' type='file' id='images' accept='image/*' multiple max={6}
          onChange={(e : any) => setImages(e.target.files)}
          />  
          <button className='uppercase border-green-700 text-green-700 border p-3 rounded
          disabled:opacity-80 hover:shadow-lg' onClick={handleImageSubmit} type='button' disabled={uploading}>{uploading ? 'Uploading...' : 'Upload'}</button>
          </div> 

          <p className='text-red-700 text-sm'>{imageUploadError ? imageUploadError : ""}</p>
          {formData.imageUrls.length > 0 && formData.imageUrls.map((url : string, index: number) => (
            <div className='flex justify-between p-3 border items-center' key={url}>
              <img src={url} alt='listing image' className='w-20 h-20 rounded-lg object-contain'/>
              <button className='p-3 text-red-700 rounded-lg uppercase hover:opacity-75'
              type='button' onClick={() => handleRemoveImage(index)}>Delete</button>
            </div>
          ))

          }

          <button className='uppercase p-3 bg-slate-700 rounded-lg text-white hover:opacity-90
          disabled:opacity-80' disabled={loading}>{loading ? "creating" : "create listing"}</button>

          {error && <p className='text-red-700 text-sm'>{error}</p>}

        </div>
        
      </form>
    </main>
  )
}

export default CreateListing
