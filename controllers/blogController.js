const mongoose = require('mongoose')
const blogModel = require('../models/blogModels.js')
const userModel = require('../models/userModel.js')

//GET ALL BLOGS
exports.getAllBlogsController = async (req,res) =>{
    try {
        const blogs = await blogModel.find({})
        if(!blogs){
            return res.status(200).send({
                success:false,
                message:'No Blogs Found'
            })
        }
        return res.status(200).send({
            success:true,
            BlogCount:blogs.length,
            message:'All Blogs List',
            blogs
        })

    } catch (error) {
        console.log(error)
        return res.status(500).send({
            success:false,
            message:'Error While Getting Blogs',
            error
        })
    }

}

//CREATE BLOG
exports.createBlogController = async (req,res) =>{
    try{
        const {title,description,image, user} = req.body 
        if(!title || !description || !image ||!user){
            return res.status(200).send({
                success:false,
                message:'Please Provide All Field'
            })
        }
        const existingUser = await userModel.findById(user)
        //validation
        if(!existingUser){
            return res.status(404).send({
                success:false,
                message:'Unable to find User'
            })
        }


        const newBlog = new blogModel({title,description,image,user})
        const session = await mongoose.startSession()
        session.startTransaction()
        await newBlog.save({session})
        existingUser.blogs.push(newBlog)
        await existingUser.save({session})
        await session.commitTransaction()  
        await newBlog.save()
        return res.status(201).send({
            success:true,
            message:'Blog Created',
            newBlog
        })
    }catch(error){
        return res.status(400).send({
            success:false,
            message:'Error While Creating a Blog',
            error

        })
    }
}

//UPDATE BLOG
exports.updateBlogController = async (req,res) =>{
    try{
        const {id} = req.params
        const {title,description,image} = req.body
        const blog = await blogModel.findByIdAndUpdate(id,{...req.body},{new:true})
        return res.status(200).send({
            success:true,
            message:'Blog Has Been Updated',
            blog
        })

    }catch(error){
        return res.status(400).send({
            success:false,
            message:'Error While Updating a Blog',
            error

        })
    }
}

//SINGLE BLOG DETAILS
exports.getBlogByIdController = async (req,res) =>{
    try{
        const {id} = req.params
        const {title,description,image} = req.body
        const blog = await blogModel.findById(id)
        return res.status(200).send({
            success:true,
            message:'Successfullt Fetched the Requested Blog',
            blog
        })

    }catch(error){
        return res.status(400).send({
            success:false,
            message:'Error While Getting the Requested Blog',
            error

        })
    }
}

//DELETE BLOG
exports.deleteBlogController = async (req,res) =>{
    try{
        const {id} = req.params
        console.log(id)
        const blog = await blogModel.findByIdAndDelete(id).populate("user")
        //pullling from the blogs array which means deleting
        console.log(blog)
        await blog.user.blogs.pull(blog)
        await blog.user.save()
        return res.status(200).send({
            success:true,
            message:'Blog Successfully Deleted',
            
        })

    }catch(error){
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'Error While Deleting the Blog',
            error

        })
    }
}

// GET User Blogs

exports.userBlogController = async (req,res) => {
    try {
        const {id} = req.params
        const userBlog = await userModel.findById(id).populate('blogs')
        if (!userBlog){
            return res.status(404).send({
                success:false,
                message:'blogs not found by this User'
            })
        }
        return res.status(200).send({
            success:true,
            message:'user blogs',
            userBlog
        })

    } catch (error) {
        console.log(error)
        return res.status(400).send({
            success:false,
            message:'Error in User Blog',
            error
        })
    }
}
