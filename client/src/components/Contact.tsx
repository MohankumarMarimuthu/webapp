import { ChangeEvent, useEffect, useState } from "react"
import { Link } from "react-router-dom"

const Contact = ({listing} : any) => {

 const [landlordData, setLandlordData] = useState<any>()
 const [message, setMessage] = useState('')


 
 useEffect(() => {

    const fetchUser = async() => {
    try{
        const res = await fetch(`/api/list/${listing.userRef}`)
        const data = await res.json();
        setLandlordData(data);
    }
    catch(error){
        console.log('error' , error)
    }
    }

    fetchUser()
   
 },[listing.userRef])


 const messageChange = (e:  ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
 }

 console.log('listing' , landlordData)


  return (
    <>
    {
        landlordData && (
            <div className="flex flex-col gap-5">
                <p>contact : <span className="font-semibold">{landlordData.username}</span> for 
                <span className="font-semibold"> {listing.name.toLowerCase()}</span>
                </p>

                <textarea name="message" id="message" rows={4} value={message} placeholder="enter your message"
                onChange={messageChange} className="w-full border p-3 rounded-lg outline-none"></textarea>

                <Link to={`mailto:${landlordData.email}?subject=Regarding${listing.name}&body=${message}`}
                className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-85">
                  Send Message
                </Link>
            </div>
        )
    }
    </>
  )
}

export default Contact