import express from "express";
import { deleteUser, getUserListing, test, updateUser } from "../controllers/userController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get('/test' , test) // we can separate the logic also to controller folder 

// or otherwise we can write like this
// router.get('/test' , (req, res) => {
//     res.json({message: "send test sample api response"})
// })

router.put('/update/:id', verifyUser , updateUser)
router.delete('/delete/:id', verifyUser , deleteUser)
router.get('/listing/:id' , verifyUser, getUserListing)


export default router;