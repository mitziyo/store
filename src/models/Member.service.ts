import { MemberStatus, MemberType } from "../libs/enums/member.enum";
import Errors, { HttpCode, Message } from "../libs/Error";
import { MemberInput, Member, LoginInput, MemberUpdateInput } from "../libs/types/member";
import MemberModel from "../schema/Member.model";
import { shapeIntoMongooseObjectId } from "../libs/config";

class MemberService {
  private readonly memberModel;
  constructor() {
    this.memberModel = MemberModel;
  }

  public async processSignup(input: MemberInput): Promise<Member> {
    const exist = await this.memberModel
      .findOne({ memberType: MemberType.STORE })
      .exec();
    console.log("exist:", exist);
    if (exist) throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    try {
      const result = await this.memberModel.create(input);

      result.memberPassword = "";
      return result as unknown as Member;
    } catch (err) {
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  public async processLogin(input: LoginInput): Promise<Member> {
    const member = await this.memberModel
      .findOne(
        {
          memberNick: input.memberNick,
          memberStatus: { $ne: MemberStatus.DELETE }, // o'chirilgan a'zo umuman topilmagandek ko'rsatiladi
        },
        { memberNick: 1, memberPassword: 1, memberStatus: 1 },
      )
      .exec();
    if (!member) throw new Errors(HttpCode.NOT_FOUND, Message.NO_MEMBER_NICK);
    if (member.memberStatus === MemberStatus.BLOCK) {
      throw new Errors(HttpCode.FORBIDDEN, Message.BLOCKED_USER);
    }

    const isMatch = input.memberPassword === member.memberPassword;

    if (!isMatch) {
      throw new Errors(HttpCode.UNAUTHORIZED, Message.WRONG_PASSWORD);
    }

    return (await this.memberModel
      .findById(member._id)
      .exec()) as unknown as Member;
  }

  public async getUsers(): Promise<Member[]> {
    const result = await this.memberModel
      .find({ memberType: MemberType.USER })
      .exec();
    return result as unknown as Member[]; // bo'sh ro'yxat ham to'g'ri holat, xato emas — shuning uchun bo'sh-tekshiruv yo'q
  }

  public async updateChosenUser(input: MemberUpdateInput): Promise<Member> {
    const objectId = shapeIntoMongooseObjectId(input._id);
    const result = await this.memberModel
      .findOneAndUpdate({ _id: objectId }, input, { returnDocument: "after" }) // burak'da findByIdAndUpdate'ga obyekt berilgan edi — xato, hech qanday hujjatga mos kelmasdi
      .exec();
    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    return result as unknown as Member;
  }
}

export default MemberService;
