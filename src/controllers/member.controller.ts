import { Request, Response } from "express";
import { T } from "../libs/types/common";
import MemberService from "../models/Member.service";
import { LoginInput, Member, MemberInput } from "../libs/types/member";
import Errors from "../libs/Error";
// Start 5
import AuthService from "../models/Auth.service";
// End 5

const memberController: T = {};
const memberService = new MemberService();
// Start 5
const authService = new AuthService();
// End 5

// Start 5
memberController.signup = async (req: Request, res: Response) => {
  try {
    console.log("signup");
    const input: MemberInput = req.body;
    const result: Member = await memberService.signup(input);
    const token = await authService.createToken(result);
    console.log("token =>", token);
    // todo TOKENS AUTHENTICATION
    res.json({ member: result });
  } catch (err) {
    console.log("Error, signup:", err);
    const message = err instanceof Errors ? err : Errors.standard;
    res.status(message.code).json(message);
  }
};

memberController.login = async (req: Request, res: Response) => {
  try {
    console.log("login");
    const input: LoginInput = req.body;
    const result = await memberService.login(input);
    const token = await authService.createToken(result);
    console.log("token =>", token);
    // todo TOKENS AUTHENTICATION
    res.json({ member: result });
  } catch (err) {
    console.log("Error, login:", err);
    const message = err instanceof Errors ? err : Errors.standard;
    res.status(message.code).json(message);
  }
};
// End 5

export default memberController;
