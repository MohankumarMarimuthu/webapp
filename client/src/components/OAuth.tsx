import { GoogleAuthProvider , getAuth, signInWithPopup } from "firebase/auth";
import { app } from "../firebase";
import { useDispatch } from "react-redux";
import { signInSuccess } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const OAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const googleAuth = async() => {
        try{
            const provider = new GoogleAuthProvider();
            const auth = getAuth(app)
            const result = await signInWithPopup(auth, provider)
            const res = await fetch('/api/auth/google' , {
                method: 'POST',
                headers: {
                    "Content-Type" : "application/json",
                },
                body: JSON.stringify({
                    name: result.user.displayName,
                    email: result.user.email,
                    photo: result.user.photoURL, 
                })
            })
            const data = await res.json();
            dispatch(signInSuccess(data))
            navigate("/")
        }
        catch(error){
            console.log('cannot sign in with google' , error)
        }
    }
  return (
    <button className="text-white bg-red-600 p-3 uppercase rounded-lg hover:opacity-95" 
    type="button" onClick={googleAuth}>Sign In with google</button>
  )
}

export default OAuth