import{Router} from 'express';
import {registerProduct} from '../controllers/product.controllers.js';
import {verifyJWT} from '../middlewares/auth.middleware.js';
import {upload} from '../middlewares/multer.middleware.js';

const router=Router();
router.route('/registerProduct').post(verifyJWT,upload.fields([
    {
        name: "Image",
        maxCount: 1
    }
]),registerProduct);

export default router;