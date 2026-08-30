import express from "express";
const routerAdmin = express.Router();
import storeController from "./controllers/store.controller";

/** Store */
routerAdmin.get("/", storeController.goHome);
routerAdmin
  .get("/login", storeController.getLogin)
  .post("/login", storeController.processLogin);

routerAdmin
  .get("/signup", storeController.getSignup)
  .post("/signup", storeController.processSignup);

routerAdmin.get("/check-me", storeController.checkAuthSession); // joriy session'da qaysi member login qilganini tekshirish

// Start 2
routerAdmin.get("/logout", storeController.logout); // session'ni tugatish
// End 2

/** Book */
/** User */

export default routerAdmin;
