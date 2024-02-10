import Listing from "../models/listingModel.js"
import User from "../models/userModel.js"
import { errorHandler } from "../utils/error.js"

export const createList = async(req, res, next) => {
    try{
      const listing = await Listing.create(req.body)
      return res.status(201).json(listing)
    }
    catch(error){
      next(error)
    }
}

export const delteListing = async(req, res, next) => {

  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404 , 'listing not found'))
  }

  if(req.user.id !== listing.userRef)
  return next(errorHandler(401, 'you can only delete your listings'))

  try{
   await Listing.findByIdAndDelete(req.params.id)
   return res.status(200).json({message: "listing has been delted"})
  }
  catch(error){
    next(error)
  }
}

export const editListing = async(req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if(!listing){
    return next(errorHandler(404 , 'listing not found'))
  }

  if(req.user.id !== listing.userRef)
  return next(errorHandler(401, 'you can only update your own listings'))

  try{
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true})
    return res.status(200).json(updatedListing)
  }
  catch(error){
    next(error)
  }
}

export const getListingById = async(req, res, next) => {

  try{

    const listing = await Listing.findById(req.params.id);

    if(!listing){
    return next(errorHandler(404 , 'listing not found'))
    }

    return res.status(200).json(listing);

  }
  catch(error){
    next(error)
  }
  
}

export const getUser = async(req, res, next) => {
  try{
    const user = await User.findById(req.params.id)

    if(!user) return next(errorHandler(404 , 'user not found'));

    const { password, ...rest} = user._doc;

    return res.status(200).json(rest)
  }
  catch(error){
    next(error)
  }
}

export const searchListings = async(req, res, next) => {

  try{
    
   const limit = parseInt(req.query.limit) || 8;
   const startIndex = parseInt(req.query.startIndex) || 0;

   let offer = req.query.offer;
   let furnished = req.query.furnished;
   let parking = req.query.parking;
   let type = req.query.type;

   if(offer === undefined || offer === "false"){
    offer = { $in: [false, true] }
   }

   if(furnished === undefined || furnished === "false"){
    furnished = { $in: [false, true] }
   }

   if(parking === undefined || parking === "false"){
    parking = { $in: [false, true] }
   }

   if(type === undefined || type=== "all"){
    type = { $in: ['sale' , 'rent']}
   }

   const searchTerm = req.query.searchTerm || '';
   const sort = req.query.sort || 'createdAt';
   const order = req.query.order || 'desc';
   
   const listings = await Listing.find({
    name : { $regex: searchTerm, $options: 'i'},
    offer,
    furnished,
    parking,
    type
   }).sort({ [sort] : order})
   .limit(limit)
   .skip(startIndex);

   console.log('Mongoose Query:', listings);

   return res.status(200).json(listings)
  }
  catch(error){
    next(error)
  }
}