import express from "express";
const routerAdmin = express.Router();
import storeController from "./controllers/store.controller";
import bookController from "./controllers/book.controller";
// Start 2
import makeUploader from "./libs/utils/uploader";
// End 2

/** Store */
routerAdmin.get("/", storeController.goHome);
routerAdmin
  .get("/login", storeController.getLogin)
  .post("/login", storeController.processLogin);

routerAdmin
  .get("/signup", storeController.getSignup)
  // Start 2
  .post(
    "/signup",
    makeUploader("members").single("memberImage"), // formadagi memberImage faylini ./uploads/members'ga saqlaydi
    storeController.processSignup,
  );
// End 2

routerAdmin.get("/check-me", storeController.checkAuthSession); // joriy session'da qaysi member login qilganini tekshirish
routerAdmin.get("/logout", storeController.logout); // session'ni tugatish

routerAdmin.get("/book/all", storeController.verifyStore, bookController.getAllBooks);
// Start 2
routerAdmin.post(
  "/book/create",
  storeController.verifyStore,
  makeUploader("books").array("bookImages", 5), // 5 tagacha rasmni ./uploads/books'ga saqlaydi
  bookController.createNewBook,
);
routerAdmin.post("/book/:id", storeController.verifyStore, bookController.updatedChosenBook);
// End 2

/** User */

export default routerAdmin;
