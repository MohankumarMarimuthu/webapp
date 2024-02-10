import { FaSearch } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link , useNavigate } from "react-router-dom";
import logo from "../images/logo.svg";
import { useEffect, useState } from "react";

const Header = () => {
  
  const { currentUser } = useSelector((state : any) => state.user)
  const [searchTerm, setSearchTerm] = useState<any>('')
  const navigate = useNavigate();
  
  

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm' , searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if(searchTermFromUrl){
      setSearchTerm(searchTermFromUrl);
    }

  },[location.search])
  
  return (
    <header className="bg-slate-200 shadow-md">
        <div className="mx-auto container"> 
        <div className="flex justify-between gap-1 max-w-6xl p-3 items-center">
 
           <div> 
            <Link to="/">
              {/* <h1 className="font-bold text-sm sm:text-xl"><span>mERn</span>ESTATE</h1> */}
              <img src={logo} alt="" className="w-20 h-20 rounded-xl object-contain"/>
            </Link>
           </div>

           <form className="bg-slate-100 p-3 rounded-lg flex items-center" onSubmit={handleSearchSubmit}>
           <input type="text" placeholder="search..." className="bg-transparent outline-none"
           onChange={(e) => setSearchTerm(e.target.value)} value={searchTerm}/>
           <button >
           <FaSearch className="text-slate-600" />
           </button>
           </form>
   
           <ul className="flex gap-4 items-center">
            <Link to="/">
            <li className="hidden lg:block cursor-pointer hover:underline text-slate-700">Home</li>
            </Link>
            <Link to="/about">
            <li className="hidden lg:block cursor-pointer hover:underline text-slate-700">About</li>
            </Link>
            {currentUser ? (
               <Link className="h-10 w-10" to={"/profile"}>
                <img alt="profile-pic" src={currentUser.avatar}  className="rounded-[1.5rem]"/>
               </Link>
            ) : (
               <Link to="/sign-in">
               <li className="cursor-pointer hover:underline text-slate-700">Sign In</li>
               </Link>
            )}
           
            </ul> 

        </div>
        </div>
    </header>
  )
}

export default Header