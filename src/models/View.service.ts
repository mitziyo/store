import ViewModel from "../schema/View.model";
import Errors, { HttpCode, Message } from "../libs/Error";
import { View, ViewInput } from "../libs/types/view";

class ViewService {
  private readonly viewModel;

  constructor() {
    this.viewModel = ViewModel;
  }

  public async checkViewExistence(input: ViewInput): Promise<View | null> {
    return (await this.viewModel
      .findOne({ memberId: input.memberId, viewRefId: input.viewRefId })
      .exec()) as unknown as View | null;
  }

  public async insertMemberView(input: ViewInput): Promise<View> {
    try {
      const result = await this.viewModel.create(input);
      return result as unknown as View;
    } catch (err) {
      console.log("ERROR, model: insertMemberView", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }
}

export default ViewService;
