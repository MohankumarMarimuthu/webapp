import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Profile from "./pages/Profile"
import SignIn from "./pages/SignIn"
import SignUp from "./pages/SignUp"
import Header from "./components/Header"
import ProtectedRoute from "./components/ProtectedRoute"
import CreateListing from "./pages/CreateListing"
import EditListing from "./pages/EditListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"

const App = () => {
  return (
    <BrowserRouter>
      <Header />
    <Routes>
       <Route path="/" element={<Home />} />
       <Route path="/about" element={<About />} />
       <Route path="/listing/:listingId" element={<Listing />} />
       <Route path="/search" element={<Search />} />
       <Route element={<ProtectedRoute />}>
       <Route path="/profile" element={<Profile />} />
       <Route path="/create-listing" element={<CreateListing />} />
       <Route path="/edit-listing/:listingId" element={<EditListing />} />
       </Route>
       <Route path="/sign-in" element={<SignIn />} />
       <Route path="/sign-up" element={<SignUp />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App