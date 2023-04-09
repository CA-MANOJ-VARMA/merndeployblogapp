const userModel = require('../models/userModel')
const generateWebToken = require('../utils/generateToken')
const bcrypt = require('bcrypt')
//create user register user
exports.registerController =async (req,res) =>{
    try{
        const {username,email, password} = req.body
        //valiation
        if (!username || !email || !password){
            return res.status(400).send({
                success:false,
                message:'Please fill all the Details',
                
            })
        }
        //existing user
        const existingUser = await userModel.findOne({email})
        if (existingUser){
            return res.status(401).send({
                success:false,
                message:'User already exists',
                
            })
        }
        //hasing password
        const hashedPassword = await bcrypt.hash(password,10)
        

        //save new user
        const user = new userModel({username,email,password:hashedPassword})
        await user.save()
        return res.status(201).send({
            success:true,
            message:'New User Created',
            user
        })


    }catch (error) {
        console.log(error)
        return res.status(500).send({
            message:'Error in register callback',
            success: false,
            error
        })
    }
};


//get all users
exports.getAllUsers = async(req,res) =>{
    try {
        const users = await userModel.find({})
        return res.status(200).send({
            userCount:users.length,
            success:true,
            message:"All users Data",
            users
        })
    } catch(error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in get all users',
            error
        })
};
}


//login
exports.loginController = async (req,res) =>{
    try{
        const {email,password} = req.body
        if (!email || !password){
            return res.status(401).send({
                success:false,
                message:'Email or Password is missing'

            })
        }
        //check the user if email and password is provided
        const user = await userModel.findOne({email})
        if (!user){
            return res.status(200).send({
                success:false,
                message:'Email is not registered'
            })
        }
        //check the password if email and password is provided
        const isMatch = await bcrypt.compare(password,user.password)
        if (!isMatch){
            return res.status(401).send({
                success:false,
                message:'Invalid Username or Password'
            })
        }
        return res.status(200).send({
            success:true,
            message:'Login Sucessful',
            token:generateWebToken(user._id),
            user
        })

    }catch(error){
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error in Login Callback',
            error
        })
    }
};