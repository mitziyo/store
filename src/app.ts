import cors from "cors"; // boshqa portdagi (React) frontend'ga so'rov yuborishga ruxsat beradi
import express from "express"; // HTTP-server va routing framework
import path from "path"; // fayl yo'llarini (views/public) qurish uchun
import router from "./router"; // SPA/REST router ("/")
import routerAdmin from "./router-admin"; // SSR/EJS admin router ("/admin")
import morgan from "morgan"; // har bir HTTP-so'rovni konsolga log qiladi
import cookieParser from "cookie-parser"; // SPA'ning JWT-cookie'sini o'qish uchun
import session from "express-session"; // login-holatini cookie orqali saqlaydi
import MongoStore from "connect-mongo"; // sessiyalarni xotirada emas, MongoDB'da saqlash uchun
import { MORGAN_FORMAT } from "./libs/config"; // morgan log-formati
import { T } from "./libs/types/common"; // umumiy index-turi ({[key:string]:any})
import { Server as SocketIOServer } from "socket.io";
import http from "http";

const store = MongoStore.create({
  mongoUrl: String(process.env.MONGO_URL),
  collectionName: "sessions",
});

/** 1 - ENTRANCE **/
const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static("./uploads")); // signup/kitob rasmlari shu yerga saqlanadi, lekin public/ ichida emas edi
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors({ credentials: true, origin: true })); // ixtiyoriy domaindan serverga kelayotgan so'rovga ruxsat beradi
app.use(cookieParser());
app.use(morgan(MORGAN_FORMAT));
/** 2 - SESSION **/
app.use(
  session({
    secret: String(process.env.SESSION_SECRET), // cookie imzosini shifrlash uchun kalit
    cookie: {
      maxAge: 1000 * 3600 * 3, // bu session id ni
    }, // cookiesga yozish uchun ishlatiladi
    store: store, // sessionni xotira o'rniga MongoDB'da saqlaydi
    resave: true, // o'zgarmagan sessionni ham har so'rovda qayta saqlaydi
    saveUninitialized: true, // hali bo'sh (init qilinmagan) sessionni ham darhol saqlaydi
  }),
);

app.use(function (req, res, next) {
  const sessionInstance = req.session as T; // req.session'ni kengaytirilgan turga o'tkazish
  res.locals.member = sessionInstance.member; // EJS view'lar member'ni to'g'ridan-to'g'ri o'qiy olishi uchun
  next();
});
/** 3 - VIEWS **/
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

/** 4 - ROUTERS **/

app.use("/admin", routerAdmin); // SSR: EJS
app.use("/", router); // SPA: REACT / Middleware design patter

const server = http.createServer(app);
const io = new SocketIOServer(server, {
  // socketio inctance
  cors: {
    origin: true,
    credentials: true,
  },
});

let summaryClient = 0;
io.on("connections", (socket) => {
  summaryClient++;
  console.log(`Connection & total [${summaryClient}]`);

  socket.on("disconnection", () => {
    summaryClient--;
    console.log(`Disconnetion & total [${summaryClient}]`);
  });
});

export default server;
