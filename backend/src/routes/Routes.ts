import express from 'express';
import { getUserProfile, login, logout, signupcust } from '../controllers/SignUp_LoginCust';
import { getReviewByProdId, getReviewofCust, postReviewOnProduct } from '../controllers/ReviewController';
import { getSellerProfile, loginSeller, signupseller } from '../controllers/SignUp_LoginSeller';
import upload from '../middleware/multer';
import { GetAllProducts, ProductControllerWithImage, addProductToCart, deleteCartItems, deleteWholeCart, getProductByCategory, getProductById, getProductByName, getProductPagination } from '../controllers/ProductController';
import { fetchOrderByStatus, postOrder } from '../controllers/OrderController';

const router: express.Router = express.Router();

router.post('/signupcustomer', signupcust);
router.post('/signupseller', signupseller)
router.post('/logincust', login)
router.post('/loginseller', loginSeller);
router.post('/uploadreview', postReviewOnProduct)
router.post('/upload', upload.single('image'), ProductControllerWithImage)
router.post('/addtocart', addProductToCart);
router.post('/createorder', postOrder)
router.post('/getorder', fetchOrderByStatus)
router.post('/logout', logout)

router.post('/deletecartItems', deleteCartItems)
router.post('/deletewholecart', deleteWholeCart)


router.get('/productPagination', getProductPagination)


router.get('/custprofile/:custId', getUserProfile);
router.get('/sellerprofile/:sellerId', getSellerProfile)
router.get('/getallproducts', GetAllProducts);
router.get('/byname/:searchQuery', getProductByName)
router.get('/bycategory/:categoryQuery', getProductByCategory)
router.get('/getreviewbyprodid/:prodId', getReviewByProdId)
router.get('/getreviewbycustid/:custId', getReviewofCust)
router.get('/getproductbyid/:prodId', getProductById)


export default router;