import express from "express";
import { createList, delteListing, editListing, getListingById, getUser, searchListings } from "../controllers/listController.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/search" , searchListings)
router.post("/create", verifyUser , createList)
router.delete('/delete/:id' , verifyUser, delteListing)
router.post('/edit/:id' , verifyUser, editListing)
router.get('/get-listing-byId/:id' , getListingById)
router.get('/:id' , verifyUser , getUser )



export default router;