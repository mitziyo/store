import express from "express"; // HTTP-server va routing framework
import path from "path"; // fayl yo'llarini (views/public) qurish uchun
import router from "./router"; // SPA/REST router ("/")
import routerAdmin from "./router-admin"; // SSR/EJS admin router ("/admin")
import morgan from "morgan"; // har bir HTTP-so'rovni konsolga log qiladi
import session from "express-session"; // login-holatini cookie orqali saqlaydi
import ConnectMongoDB from "connect-mongodb-session"; // sessiyalarni xotirada emas, MongoDB'da saqlash uchun
import { MORGAN_FORMAT } from "./libs/config"; // morgan log-formati
import { T } from "./libs/types/common"; // umumiy index-turi ({[key:string]:any})

const MongoDBStore = ConnectMongoDB(session);
const store = new MongoDBStore({
  uri: String(process.env.MONGO_URL),
  collection: "sessions",
});

/** 1 - ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan(MORGAN_FORMAT));
/** 2 - SESSION **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET),
    cookie: {
      maxAge: 1000 * 3600 * 3,
    },
    store: store,
    resave: true,
    saveUninitialized: true,
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T;
  res.locals.member = sessionInstance.member;
  next();
});
/** 3 - VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
/** 4 - ROUTERS **/
app.use("/admin", routerAdmin); // SSR: EJS
app.use("/", router); // SPA: REACT / Middleware design patter

export default app;
