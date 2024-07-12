const express = require('express');
const router = express.Router();
const User = require('../models/user');
const bcrypt = require('bcrypt');
const { catchAsync } = require('../core/catchAsync');
const { BadRequestError} = require('../core/ApiError');
const {AuthenticationError} = require('../core/ApiError');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET;




// router.get('/fakeUser',async(req,res)=>{

//     const hash = await bcrypt.hash("1234",12);

//     const user = await User.create({
//         username: 'max',
//         hash: '1234',
//         email: 'max@gmail.com'
//     });

//     res.send(user);
// });


router.post('/register',catchAsync(async(req,res)=>{
    const {username, password, email} = req.body;

    //check for empty fields
    if(!username || !password || !email){
        throw new BadRequestError('Fields are missing');
    }


    //check if user with this username already exists

    const user = await User.findOne({username: username});

    if(user){
        throw new BadRequestError('User with this username already exists');
    }

    //hash the plain password
    const hashedPassword = await bcrypt.hash(password, 12);

    //create new user in the db
    const newUser = User.create({
        username,hash:hashedPassword,email
    });
    res.status(201).json(newUser);
}));


router.post('/login',catchAsync(async(req,res)=>{
    const {username,password} = req.body;

    if(!username || !password)
    {
        throw new BadRequestError('fields are missing');
    }

    //user with the given username should exists

    const user = await User.findOne({username:username});

    if(!user){
        throw new AuthenticationError('Username or password is incorrect');
    }

    const isPasswordValid = await bcrypt.compare(password, user.hash);

    if(!isPasswordValid){
        throw new AuthenticationError('username or password is incorrect');
    }

    const token = jwt.sign({userId:user._id},JWT_SECRET);

    res.cookie('token',token,{maxAge: 3*24*60*60*1000});

    res.status(200).json({message:'Logged in successfully'});
}));


router.get('/logout',(req,res)=>{
    res.cookie('token',"");
    res.status(200).json({message:"Logged out successfully"});
})

module.exports = router;