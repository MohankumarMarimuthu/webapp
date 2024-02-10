import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Swiper , SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import SwiperCore from 'swiper';
import 'swiper/css/bundle';
import ListingCards from '../components/ListingCards';

export default function Home() {

  SwiperCore.use([Navigation])

  const [offerListings, setOfferListings] = useState([])
  const [saleListings, setSaleListings] = useState([])
  const [rentListings, setRentListings] = useState([])

  useEffect(() => {
    const fetchOfferListings = async() => {
      try{
      const res = await fetch('/api/list/search?offer=true&limit=4');
      const data = await res.json();
      setOfferListings(data)
      } 
      catch(error){
        console.log(error)
      }
    }
    const fetchSaleListings = async() => {
      try{
      const res = await fetch('/api/list/search?type=sale&limit=4');
      const data = await res.json();
      setSaleListings(data)
      } 
      catch(error){
        console.log(error)
      }
    }
    const fetchRentListings = async() => {
      try{
      const res = await fetch('/api/list/search?type=rent&limit=4');
      const data = await res.json();
      setRentListings(data)
      } 
      catch(error){
        console.log(error)
      }
    }
    fetchOfferListings();
    fetchSaleListings();
    fetchRentListings();
  },[])
  

  console.log("offerListings" , offerListings)

    return (
    <div>

      <div className='flex flex-col gap-6 py-28 px-3 max-w-6xl mx-auto'>
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>Find your next <span className='text-slate-500'>perfect</span>
        <br /> place with ease</h1>

        <div className='text-gray-400 text-xs md:text-sm'>
          This is the best perfect place for you to live
          <br />
          we have wide range of opportunites please check it out
        </div>

        <Link to={"/search"} className='text-xs md:text-sm text-blue-800 font-bold hover:underline'>Explore ...</Link>
      </div>

      
      <Swiper navigation>

          {offerListings && offerListings.length > 0 && offerListings.map((item : any) => (
            <SwiperSlide>
              <div className='h-[500px]' key={item._id} style={{ background: `url(${item.imageUrls[0]}) center no-repeat` , backgroundSize: "cover"}}>

              </div>

            </SwiperSlide>
          )) }

      </Swiper>
      
      <div className='max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10'>
        {offerListings && offerListings.length > 0 && 
        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent offers</h2>
            <Link to={`/search?offer=true`} className='text-sm text-blue-800 hover:underline'>
              Show more offers
            </Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {offerListings.map((item:any) => (
              <ListingCards key={item._id} data = {item}/>
            ))}
          </div>
        </div>
        }
        {saleListings && saleListings.length > 0 && 
        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for sale</h2>
            <Link to={`/search?type=sale`} className='text-sm text-blue-800 hover:underline'>
              Show more places for sale
            </Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {saleListings.map((item:any) => (
              <ListingCards key={item._id} data = {item}/>
            ))}
          </div>
        </div>
        }
        {rentListings && rentListings.length > 0 && 
        <div className=''>
          <div className='my-3'>
            <h2 className='text-2xl font-semibold text-slate-600'>Recent places for rent</h2>
            <Link to={`/search?type=rent`} className='text-sm text-blue-800 hover:underline'>
              Show more places for rent
            </Link>
          </div>

          <div className='flex flex-wrap gap-4'>
            {rentListings.map((item:any) => (
              <ListingCards key={item._id} data = {item}/>
            ))}
          </div>
        </div>
        }
        

        
      </div>
    </div>
  )
}
