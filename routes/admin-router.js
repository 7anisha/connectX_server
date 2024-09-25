const express = require ("express")
const adminController =require("../controller/admin-controller")
const adminMiddleware =require("../middlewares/admin-middleware")
const authMiddleware =require("../middlewares/auth-middleware")
const router = express.Router();

router.route("/user").get( adminController.getAllUsers)
// router.route("/Contact").get(authMiddleware,adminMiddleware,adminController.getAllContacts)
router.route("/Contact").get(adminController.getAllContacts)
router.route("/user/delete/:id").delete(adminController.deleteUserById)// :id getting from url using params in admin-controller
router.route("/contact/delete/:id").delete(adminController.deleteContactById)// :id getting from url using params in admin-controller
router.route("/user/:id").get(adminController.getUserById)
router.route("/user/update/:id").patch(adminController.updateUserById)
module.exports = router;