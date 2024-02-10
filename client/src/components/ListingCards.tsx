import { Link } from "react-router-dom"
import { FaMapMarkerAlt } from "react-icons/fa";

const ListingCards = ({data} : any) => {
    
  return (
    <div className="bg-white shadow-md hover:shadow-lg transition-shadow overflow-hidden rounded-lg w-full md:w-[300px]">
      <Link to={`/listing/${data._id}`}>
        <img src={data.imageUrls[0]} className="w-full object-cover h-[220px] md:h-[320px]
        hover:scale-105 transition-scale duration-300" alt="property"/>
        <div className="p-3 flex flex-col gap-4">
          <p className="text-lg font-semibold text-slate-700 truncate">{data.name}</p>
          <p className="flex items-center gap-3 text-slate-700 truncate text-base capitalize"><FaMapMarkerAlt className="text-green-700"/> {data.address}</p>
          <p className="text-gray-600 line-clamp-2 text-sm font-normal h-16">{data.description}</p>
          <p className="text-slate-500 font-semibold">{data.offer ? <span>${data.discountPrice}</span> : <span>${data.regularPrice}</span>}{data.type === "rent" && "/month"}</p>
          <div className="flex gap-4">
            {data.bedrooms > 1 ? <p className="text-base font-semibold text-slate-700">{data.bedrooms} Beds</p> : <p className="text-base font-semibold text-slate-700">{data.bedrooms} Bed</p>}
            {data.bathrooms > 1 ? <p className="text-base font-semibold text-slate-700">{data.bathrooms} Baths</p> : <p className="text-base font-semibold text-slate-700">{data.bathrooms} Bath</p>}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default ListingCards