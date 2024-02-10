import { useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux'
import { signInStart , signInSuccess , signInFailure } from "../redux/user/userSlice"
import OAuth from "../components/OAuth"


const SignIn = () => {

  const [formData, setFormData] = useState<Object>({})
  // const [error, setError] = useState(null)
  // const [loading, setLoading] = useState<any>(false) i am going to replace this with useSelector
  const { loading , error } = useSelector((state : any) => state.user)
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    })
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setLoading(false or true) and setError(error.message or data.message) are replaced with dispatches
    try{
      dispatch(signInStart())
      const res = await fetch('/api/auth/sign-in' , {
        method : 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })   // i used the proxy to call the api 
      const data = await res.json();
      if(data.success === false){ // if it encounter any error
        dispatch(signInFailure(data.message))
        return;
      }
      dispatch(signInSuccess(data))
      // console.log('data' , data)
      navigate("/")
    }
    catch(error : any){
      dispatch(signInFailure(error.message))    
    } 
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign In</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input className="border p-3 rounded-lg outline-none" placeholder="email" id="email" type="email" onChange={handleChange}/>
        <input className="border p-3 rounded-lg outline-none" placeholder="password" id="password" type="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : 'Sign In'}</button>
        <OAuth />
      </form>
      <div className="flex gap-3 mt-5">
        <p>Dont have an account?</p>
        <Link to={"/sign-up"}><span className="text-blue-700">Sign Up</span></Link>
      </div>
      {error && <p className="text-red-500 text-base">{error}</p>}
    </div>
  )
}

export default SignIn