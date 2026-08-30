import express from "express";
const routerAdmin = express.Router();
import storeController from "./controllers/store.controller";
import bookController from "./controllers/book.controller";

/** Store */
routerAdmin.get("/", storeController.goHome);
routerAdmin
  .get("/login", storeController.getLogin)
  .post("/login", storeController.processLogin);

routerAdmin
  .get("/signup", storeController.getSignup)
  .post("/signup", storeController.processSignup);

routerAdmin.get("/check-me", storeController.checkAuthSession); // joriy session'da qaysi member login qilganini tekshirish
routerAdmin.get("/logout", storeController.logout); // session'ni tugatish

// Start 5
routerAdmin.get("/book/all", bookController.getAllBooks);
routerAdmin.get("/book/create", bookController.createNewBook); // hozircha GET — Step 24'da multer bilan POST'ga o'tkaziladi
routerAdmin.get("/book/:id", bookController.updatedChosenBook); // hozircha GET — Step 24'da POST'ga o'tkaziladi
// End 5

/** User */

export default routerAdmin;
