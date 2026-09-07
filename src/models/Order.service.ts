import mongoose from "mongoose";
import { shapeIntoMongooseObjectId } from "../libs/config";
import Errors, { HttpCode, Message } from "../libs/Error";
import { Member } from "../libs/types/member";
import { Order, OrderInquiry, OrderItemInput, OrderUpdateInput } from "../libs/types/order";
import { T } from "../libs/types/common";
import OrderModel from "../schema/Order.model";
import OrderItemModel from "../schema/OrderItem.model";
import MemberService from "./Member.service";
import { OrderStatus } from "../libs/enums/order.enum";

class OrderService {
  private readonly orderModel;
  private readonly orderItemModel;
  private readonly memberService;

  constructor() {
    this.orderModel = OrderModel;
    this.orderItemModel = OrderItemModel;
    this.memberService = new MemberService();
  }

  public async createOrder(member: Member, input: OrderItemInput[]): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const amount = input.reduce((accumulator: number, item: OrderItemInput) => {
      return accumulator + item.itemPrice * item.itemQuantity;
    }, 0);
    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder = await this.orderModel.create({
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        memberId: memberId,
      });
      const orderId = newOrder._id;
      await this.recordOrderItem(orderId, input);

      return newOrder as unknown as Order;
    } catch (err) {
      console.log("Error, model:createOrder:", err);
      throw new Errors(HttpCode.BAD_REQUEST, Message.CREATE_FAILED);
    }
  }

  private async recordOrderItem(
    orderId: mongoose.Types.ObjectId,
    input: OrderItemInput[],
  ): Promise<void> {
    const promisedList = input.map(async (item: OrderItemInput) => {
      item.orderId = orderId;
      item.bookId = shapeIntoMongooseObjectId(item.bookId);
      await this.orderItemModel.create(item);
      return "INSERTED";
    });

    const orderItemsState = await Promise.all(promisedList);
    console.log("orderItemsState:", orderItemsState);
  }

  public async getMyOrders(member: Member, inquiry: OrderInquiry): Promise<Order[]> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const match: T = { memberId: memberId };
    if (inquiry.orderStatus) match.orderStatus = inquiry.orderStatus;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } }, // burak'da "updateAt" (yozuv xatosi) bo'lgan, saralash ishlamas edi
        { $skip: (inquiry.page - 1) * inquiry.limit },
        { $limit: inquiry.limit },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "orderItems.bookId",
            foreignField: "_id",
            as: "bookData",
          },
        },
      ])
      .exec();

    return result as unknown as Order[];
  }

  public async updateOrder(member: Member, input: OrderUpdateInput): Promise<Order> {
    const memberId = shapeIntoMongooseObjectId(member._id);
    const orderId = shapeIntoMongooseObjectId(input.orderId);
    const orderStatus = input.orderStatus;

    const result = await this.orderModel
      .findOneAndUpdate(
        { memberId: memberId, _id: orderId }, // faqat o'zining buyurtmasini o'zgartira oladi
        { orderStatus: orderStatus },
        { returnDocument: "after" },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(memberId, 1);
    }
    return result as unknown as Order;
  }

  /** SSR */
  public async getAllOrders(): Promise<Order[]> {
    const result = await this.orderModel
      .aggregate([
        { $sort: { createdAt: -1 } },
        {
          $lookup: {
            from: "orderItems",
            localField: "_id",
            foreignField: "orderId",
            as: "orderItems",
          },
        },
        {
          $lookup: {
            from: "books",
            localField: "orderItems.bookId",
            foreignField: "_id",
            as: "bookData",
          },
        },
        {
          $lookup: {
            from: "members",
            localField: "memberId",
            foreignField: "_id",
            as: "memberData",
          },
        },
      ])
      .exec();

    return result as unknown as Order[];
  }

  public async updateOrderStatus(id: string, orderStatus: OrderStatus): Promise<Order> {
    const orderId = shapeIntoMongooseObjectId(id);
    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: orderId }, // do'kon egasi istalgan buyurtmani o'zgartira oladi, memberId cheklovisiz
        { orderStatus: orderStatus },
        { returnDocument: "after" },
      )
      .exec();

    if (!result) throw new Errors(HttpCode.NOT_MODIFIED, Message.UPDATE_FAILED);
    if (orderStatus === OrderStatus.PROCESS) {
      await this.memberService.addUserPoint(result.memberId, 1);
    }
    return result as unknown as Order;
  }
}

export default OrderService;
