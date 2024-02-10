import  { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListingCards from '../components/ListingCards';

const search = () => {

    const [sidebardata, SetSidebarData] = useState({
        searchTerm: "",
        type: "all",
        parking: false,
        furnished: false,
        offer: false,
        sort: 'created_at',
        order: 'desc' 
    })
    const[loading, setLoading] = useState(false);
    const[listing, setListing] = useState<any>([])
    const navigate = useNavigate()

    

    useEffect(() => {
     
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const typeFromUrl = urlParams.get('type');
    const parkingValue = urlParams.get('parking');
    const parkingFromUrl = parkingValue === "true"
    const furnishedValue = urlParams.get('furnished');
    const furnishedFromUrl = furnishedValue === "true";
    const offerValue = urlParams.get('offer');
    const offerFromUrl = offerValue === "true";
    const sortFromUrl = urlParams.get('sort');
    const orderFromUrl = urlParams.get('order');

    if(searchTermFromUrl || typeFromUrl || parkingFromUrl || furnishedFromUrl || offerFromUrl || sortFromUrl ||
        orderFromUrl){
        SetSidebarData({
        searchTerm: searchTermFromUrl || '',
        type: typeFromUrl || 'all',
        parking: parkingFromUrl || false,
        furnished: furnishedFromUrl || false,
        offer: offerFromUrl || false,
        sort: sortFromUrl || "created_at",
        order: orderFromUrl || "desc", 
        })
    }

    const fetchListings = async() => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/list/search?${searchQuery}`);
      const data = await res.json();
      
      setListing(data);
      setLoading(false);
    }

    fetchListings();

    },[location.search])

    const handleChange = (e : any) => {
      if(e.target.id === "all" || e.target.id == 'rent' || e.target.id == 'sale'){
        SetSidebarData({ ...sidebardata, type: e.target.id})
      }  

      if(e.target.id === 'searchTerm'){
        SetSidebarData({ ...sidebardata, searchTerm: e.target.value})
      }

      if(e.target.id === 'parking' || e.target.id === "furnished" || e.target.id === 'offer'){
        SetSidebarData({...sidebardata, [e.target.id] : e.target.checked || e.target.checked === 'true' ? true : false})
      }

      if(e.target.id === "sort_order"){
        const sort = e.target.value.split('_')[0] || 'created_at';

        const order = e.target.value.split('_')[1] || 'desc';
        SetSidebarData({...sidebardata, sort, order})
      }
    }

    const handleSubmit = (e: any) => {
      e.preventDefault()
      const urlParams = new URLSearchParams()
      urlParams.set('searchTerm' , sidebardata.searchTerm);
      urlParams.set('type' , sidebardata.type);
      urlParams.set('parking' , sidebardata.parking.toString());
      urlParams.set('furnished' , sidebardata.furnished.toString());
      urlParams.set('offer' , sidebardata.offer.toString());
      urlParams.set('sort' , sidebardata.sort);
      urlParams.set('order' , sidebardata.order);

      const searchQuery = urlParams.toString();
      navigate(`/search?${searchQuery}`)
    }

  

    console.log('sidebar' , listing)

  return (
    <>
    <div className='flex flex-col md:flex-row'>
        <div className='p-7 border-b-2 md:border-r-2 md:min-h-screen'>
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className='flex gap-5 items-center'>
                    <label className='whitespace-nowrap'>Search Term:</label>
                    <input placeholder='search here...' className='p-3 rounded-lg outline-none border w-full'
                    id='searchTerm'
                    value={sidebardata.searchTerm} onChange={handleChange}/>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label>Type :</label>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='all' className='w-5'
                    onChange={handleChange} checked={sidebardata.type == 'all'}/>
                    <span>Rent & Sale</span>
                    </div>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='rent' className='w-5'
                    onChange={handleChange} checked={sidebardata.type == 'rent'}/>
                    <span>Rent</span>
                    </div>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='sale' className='w-5' 
                    onChange={handleChange} checked={sidebardata.type == 'sale'}/>
                    <span>Sale</span>
                    </div>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='offer' className='w-5'
                    onChange={handleChange} checked={sidebardata.offer == true}/>
                    <span>Offer</span>
                    </div>
                </div>
                <div className='flex gap-2 flex-wrap items-center'>
                    <label>Amenities :</label>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='parking' className='w-5 '
                    onChange={handleChange} checked={sidebardata.parking == true}/>
                    <span>Parking</span>
                    </div>
                    <div className='flex gap-2'>
                    <input type='checkbox' id='furnished' className='w-5' 
                    onChange={handleChange} checked={sidebardata.furnished == true}/>
                    <span>Furnished</span>
                    </div>
                </div>

                <div className='flex items-center gap-4'>
                    <label>Sort:</label>
                    <select id='sort_order' className='border rounded-lg p-2'
                    onChange={handleChange} defaultValue={'created_at_desc'}>
                        <option value='regularPrice_desc'>Price high to low</option>
                        <option value='regularPrice_asc'>Price low to high</option>
                        <option value='createdAt_desc'>Latest</option>
                        <option value='createdAt_asc'>Oldest</option>
                    </select>

                </div>

                <button className='text-white bg-slate-700 p-3 rounded-lg hover:opacity-90 uppercase'>Search</button>

            </form>
        </div>
        <div >
            <h1 className='text-3xl font-semibold border-b p-3 text-slate-700 mt-5'>Listing Results:</h1>
            
            <div className='p-7 flex flex-wrap gap-4'>
              {loading && (
                <h2 className='text-center tex-2xl'>Loading...</h2>
              )}
              {!loading && listing.length === 0 && (
                <h2 className='p-3 text-slate-700 my-10 font-semibold'>No Listing Found!</h2>
              ) }
              {!loading && listing && listing.map((item : any) => 
              <ListingCards key={item._id} data = {item}/>
              )}

              
            </div>

            
        </div>
        
    </div>
    </>
    
  )
}

export default search