const mongoose = require("mongoose");
const BookModel = require("../models/BookModel");
const UserModel = require("../models/UserModel");
const reviewModel = require("../models/reviewModel");

const isvalid = function(value){
    if(typeof value === 'undefined' || value  === null )
    return false
    if(typeof value === 'string' && value.trim().length === 0)
    return false
}

const isValidRequestBody = function (request){
    return(Object.keys(request).length > 0)
}

const isValidObjectId = function(ObjectId){
    return mongoose.Types.ObjectId.isValid(ObjectId)
}

const titleRegex = /^[a-zA-Z ]{2,45}$/
const ISBNRegex = /^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/



const  createBook = async function (req, res) {
  try {
    let bookData = req.body;
    let { title, excrept, userId, ISBN, category, subcategory } = bookData;

    //************Validation***********/
    if(!isValidRequestBody(bookData))
    return res.status(400).send({status:false,message:"No input user"})

    if(!isvalid(title))
    return res.status(400).send({status:false,message:"Title is required"})

    if(!isvalid(expcerpt))
    return res.status(400).send({status:false,message:"Excerpt is required"})

    if(!isvalid(userId))
    return res.status(400).send({status:false,message:"user id  is required"})

    
    if(!isvalid(ISBN))
    return res.status(400).send({status:false,message:"ISBN number is required"})

    if(!isvalid(category))
    return res.status(400).send({status:false,message:"category is required"})

    if(!isvalid(subcategory))
    return res.status(400).send({status:false,message:"subcategory is required"})

    if(!titleRegex.test(title))
    return res.status(400).send({status: false,message:"please valid tilte enter the Alphabet  only"})

    if(!ISBNRegex.test(ISBN))
    return res.status(400).send({status: false,message:"please enter the ISBN of 13 digit"})

    if(!isValidObjectId(userId))
    return res.status(400).send({status: false,message:"please provide valid book id"})
 
    const  findUser = await UserModel.findOne({_id:userId})
  
    if(!findUser)
    return res.status(404).send({status: false,message:"No such user found with this id"})
  
    const duplicateTilte = await BookModel.findOne({title})
    if(duplicateTilte)
    return res.status(400).send({status: false,message:"Title is alerady Exists"})

    const duplicateISBN = await BookModel.findOne({ISBN})
    if(duplicateISBN)
    return res.status(400).send({status: false,message:"ISBN is alerady Exists"})


    let newBookData = {
      title: title,
      excrept: excrept,
      userId: userId,
      ISBN: ISBN,
      category: category,
      subcategory: subcategory,
      releasedAt: date,
    };
    let newBook = await BookModel.create(newBookData);
    return res
      .status(201)
      .send({
        status: true,
        message: "new book created sccussfull",
        data: newBook,
      });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, message: "Error", error: err.message });
  }
};

module.exports.createBook =createBook