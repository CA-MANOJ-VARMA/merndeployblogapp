const express = require('express')
const { getAllBlogsController, createBlogController, updateBlogController, getBlogByIdController, deleteBlogController, userBlogController } = require('../controllers/blogController')
const authenticateToken = require('../middlewares/authMiddleware')

//router Object

const router = express.Router()

//routes
//GET || all-blogs
router.get('/all-blog',getAllBlogsController)

//POST || create-blog
router.post('/create-blog',authenticateToken ,createBlogController)
//PUT || update-blog
router.put('/update-blog/:id',authenticateToken , updateBlogController)

//GET || single-blog-details
router.get('/get-blog/:id',authenticateToken , getBlogByIdController)

//DELETE || delete-blog
router.delete('/delete-blog/:id',authenticateToken , deleteBlogController)

//GET || get-specific-blog
router.get('/user-blog/:id', userBlogController)

module.exports  = router