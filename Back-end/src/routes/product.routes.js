import{Router} from 'express';
import {registerProduct,updateProduct,updateImage} from '../controllers/product.controllers.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router=Router();
router.route('/registerProduct').post(verifyJWT,upload.fields([
    {
        name: "Image",
        maxCount: 1
    }
]),registerProduct);
router.route('/updateProduct').post(verifyJWT,updateProduct);
router.route('/updateImage').post(verifyJWT,upload.fields([{ name: "Image", maxCount: 1 }]),updateImage);

export default router;