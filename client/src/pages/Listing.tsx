import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Swiper , SwiperSlide } from 'swiper/react';
import SwiperCore from 'swiper';
import { Navigation } from 'swiper/modules';
import 'swiper/css/bundle';
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaBed , FaBath , FaParking , FaChair    } from "react-icons/fa";
import { useSelector } from 'react-redux';
import Contact from '../components/Contact';



const Listing = () => {

  type Accommodation = {
    address: string;
    bathrooms: number;
    bedrooms: number;
    createdAt: string;
    description: string;
    discountPrice: number;
    furnished: boolean;
    imageUrls: string[];
    name: string;
    offer: boolean;
    parking: boolean;
    regularPrice: number;
    type: "rent";
    updatedAt: string;
    userRef: string;
    __v: number;
    _id: string;
  };
  
    SwiperCore.use([Navigation])
    const [listing, setListing] = useState<Accommodation>();
    const { currentUser } = useSelector((state : any) => state.user)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(false)
    const params = useParams();
    const [contact, setContact] = useState(false)
    

    useEffect(() => {
       const fetchListing = async() => {
        try{
            setLoading(true);
            const res = await fetch(`/api/list/get-listing-byId/${params.listingId}`)
            const data = await res.json()
            
            if(data.success == false){
                console.log('error' , data.message)
                setLoading(false)
                return;
            }
            setListing(data);
            setLoading(false)
        }
        catch(error){
          setLoading(false)
          setError(true)
        }
       }

       fetchListing();
    },[])



  return (
    <main>
      {loading && <p className='text-lg text-center'>loading...</p>}
      {error && <p className='text-red-700 text-center text-2xl'>Something went wrong</p>}
      {listing && !error && !loading && 
      <>
      <Swiper navigation>
        {listing.imageUrls.map((item) => (
          <SwiperSlide key={item}>
            <div className='h-[500px] w-full' style={{ background: `url(${item}) center no-repeat` , backgroundSize: 'cover'}}>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className='container max-w-[300px] lg:max-w-5xl mx-auto my-10'>
        <div>
          <h1 className='text-black text-xl font-medium capitalize'>{listing.name} <span> - ${listing.discountPrice}</span></h1>
          <p className='flex items-center mt-4'><FaMapMarkerAlt className="text-green-700 "/> <span className='text-slate-700 capitalize text-base'>{listing.address}</span></p>
        </div>

        <div className='flex gap-5 my-5'>
        <p className='text-base text-white bg-red-900 py-2 w-full max-w-[200px] text-center px-5 mt-2 rounded-md font-semibold
        flex justify-center items-center'>{listing.type == "rent"  ? "For Rent" : "For Sale"}</p>
        {
          listing.offer && (
            <p className='text-base text-white bg-green-900 py-2 w-full max-w-[200px] text-center px-5 mt-2 rounded-md font-semibold'>${+listing.regularPrice - +listing.discountPrice} Discount</p>
          )
        }
        </div>

        <p className='text-base text-slate-600 my-10'><span className="text-lg text-black font-medium">Description : </span>{listing.description}</p>

        <ul className='flex flex-wrap gap-5 items-bottom my-5'>
          <li className='text-green-700 font-semibold flex gap-2 items-center'><FaBed className="text-green-700 h-9 w-9"/> {listing.bedrooms} Beds</li>
          <li className='text-green-700 font-semibold flex gap-2 items-center'><FaBath className="text-green-700 h-8 w-8"/> {listing.bathrooms} Baths</li>
          <li className='text-green-700 font-semibold flex gap-2 items-center'><FaParking className="text-green-700 h-8 w-8"/>{listing.parking ? "Parking"  : "No Parking"} </li>
          <li className='text-green-700 font-semibold flex gap-2 items-center'><FaChair  className="text-green-700 h-8 w-8"/> {listing.furnished ? "Furnished" : "Not Furnished"}</li>
        </ul>

       {currentUser && listing.userRef !== currentUser._id && !contact &&  
        <div className='flex justify-center my-10'>
        <button onClick={() => setContact(true)}className='text-white bg-slate-700 p-4 rounded-lg uppercase font-normal w-[200px] hover:opacity-85'>Contact Landlord</button>
        </div>
        }   

        {contact && 
          <Contact listing={listing}/>
        }    

      </div>
      </>}
    </main>
  )
}

export default Listing