import { NextFunction, Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { MemberInput, LoginInput, AdminRequest } from "../libs/types/member";
import { MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Error";

const storeController: T = {};
storeController.goHome = (req: Request, res: Response) => {
  try {
    console.log("goHome");
    res.render("home");
  } catch (err) {
    console.log("Error, goHome:", err);
  }
};

storeController.getLogin = (req: Request, res: Response) => {
  try {
    console.log("getLogin");
    res.render("login");
  } catch (err) {
    console.log("Error, getLogin:", err);
  }
};

storeController.getSignup = (req: Request, res: Response) => {
  try {
    console.log("getSignup");
    res.render("signup");
  } catch (err) {
    console.log("Error, getSignup:", err);
  }
};

storeController.processLogin = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processLogin");
    console.log("body:", req.body);
    const input: LoginInput = req.body;
    const memberService = new MemberService();
    const result = await memberService.processLogin(input);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/book/all"); // login'dan keyin to'g'ridan-to'g'ri kontent-sahifasiga
    });
  } catch (err) {
    console.log("Error, processLogin:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/login') </script>`,
    );
  }
};

storeController.processSignup = async (req: AdminRequest, res: Response) => {
  try {
    console.log("processSignup");
    console.log("body", req.body);
    const file = req.file;
    if (!file) throw new Errors(HttpCode.BAD_REQUEST, Message.SOMETHING_WENT_WRONG); // rasm yuklanmagan bo'lsa signup rad etiladi

    const newMember: MemberInput = req.body;
    newMember.memberImage = file?.path.replace(/\\/g, "/"); // Windows'da multer "\" bilan qaytaradi, URL uchun "/" kerak
    newMember.memberType = MemberType.STORE;
    const memberService = new MemberService();
    const result = await memberService.processSignup(newMember);

    req.session.member = result;
    req.session.save(function () {
      res.redirect("/admin/book/all");
    });
  } catch (err) {
    console.log("Error, processSignup:", err);
    const message =
      err instanceof Errors ? err.message : Message.SOMETHING_WENT_WRONG;
    res.send(
      `<script> alert("${message}"); window.location.replace('/admin/signup') </script>`,
    );
  }
};

storeController.checkAuthSession = async (req: AdminRequest, res: Response) => {
  try {
    console.log("checkAuthSession");
    if (req.session?.member) res.send(req.session.member); // session'da member bor bo'lsa, o'zini qaytaradi
    else res.send(Message.NOT_AUTHENTICATED); // session'da member yo'q bo'lsa, xabar qaytaradi
  } catch (err) {
    console.log("Error, checkAuthSession:", err);
    res.send(err);
  }
};

storeController.logout = async (req: AdminRequest, res: Response) => {
  try {
    console.log("logout");
    req.session.destroy(function () {
      res.redirect("/admin"); // session butunlay o'chirilgach, home'ga qaytaradi
    });
  } catch (err) {
    console.log("Error, logout:", err);
    res.redirect("/admin"); // xato bo'lsa ham foydalanuvchini osilib qolishiga yo'l qo'ymaydi
  }
};

storeController.verifyStore = (req: AdminRequest, res: Response, next: NextFunction) => {
  if (req.session?.member?.memberType === MemberType.STORE) {
    req.member = req.session.member; // controller ichida req.member orqali qulay foydalanish uchun
    next();
  } else {
    res.redirect("/admin/login"); // ruxsatsiz kirishga urinilsa, login sahifasiga qaytaradi
  }
};

export default storeController;
