import express from "express";
const routerAdmin = express.Router();
import storeController from "./controllers/store.controller";
import bookController from "./controllers/book.controller";
import orderController from "./controllers/order.controller";
import makeUploader from "./libs/utils/uploader";

/** Store */
routerAdmin.get("/", storeController.goHome);
routerAdmin
  .get("/login", storeController.getLogin)
  .post("/login", storeController.processLogin);

routerAdmin.get("/signup", storeController.getSignup).post(
  "/signup",
  makeUploader("members").single("memberImage"), // formadagi memberImage faylini ./uploads/members'ga saqlaydi
  storeController.processSignup,
);

routerAdmin.get("/check-me", storeController.checkAuthSession); // joriy session'da qaysi member login qilganini tekshirish
routerAdmin.get("/logout", storeController.logout); // session'ni tugatish

routerAdmin.get(
  "/book/all",
  storeController.verifyStore,
  bookController.getAllBooks,
);
routerAdmin.post(
  "/book/create",
  storeController.verifyStore,
  makeUploader("books").array("bookImages", 5), // 5 tagacha rasmni ./uploads/books'ga saqlaydi
  bookController.createNewBook,
);
routerAdmin.post(
  "/book/:id",
  storeController.verifyStore,
  bookController.updatedChosenBook,
);

/** User */
routerAdmin.get("/user/all", storeController.verifyStore, storeController.getUsers);
routerAdmin.post("/user/edit", storeController.verifyStore, storeController.updateChosenUser);

/** Order */
routerAdmin.get("/order/all", storeController.verifyStore, orderController.getAllOrders);
routerAdmin.post("/order/:id", storeController.verifyStore, orderController.updateOrderStatus);

export default routerAdmin;
