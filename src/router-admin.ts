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

/** Book */
/** User */

export default routerAdmin;
