import { useState } from "react"
import { Link , useNavigate } from "react-router-dom"
import OAuth from "../components/OAuth"


const SignUp = () => {

  const [formData, setFormData] = useState<Object>({})
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState<any>(false)
  const navigate = useNavigate();

  const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id] : e.target.value,
    })
  }

  const handleSubmit = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try{
      setLoading(true)
      const res = await fetch('/api/auth/sign-up' , {
        method : 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json();
      if(data.success === false){ // if it encounter any error
        setError(data.message)
        setLoading(false)
        return;
      }
      setLoading(false)
      setError(null)
      // console.log('data' , data)
      navigate("/sign-in")
    }
    catch(error : any){
      setLoading(false)
      setError(error)
    } 
  }
  
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl text-center font-semibold my-7">Sign Up</h1>
      <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
        <input className="border p-3 rounded-lg outline-none" placeholder="username" id="username" type="text" onChange={handleChange}/>
        <input className="border p-3 rounded-lg outline-none" placeholder="email" id="email" type="email" onChange={handleChange}/>
        <input className="border p-3 rounded-lg outline-none" placeholder="password" id="password" type="password" onChange={handleChange}/>
        <button disabled={loading} className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">{loading ? 'loading...' : 'Sign Up'}</button>
        <OAuth />
      </form>
      <div className="flex gap-3 mt-5">
        <p>Already have an account?</p>
        <Link to={"/sign-in"}><span className="text-blue-700">Sign in</span></Link>
      </div>
      {error && <p className="text-red-500 text-base">{error}</p>}
    </div>
  )
}

export default SignUp