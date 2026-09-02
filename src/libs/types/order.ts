import mongoose from "mongoose";
import { OrderStatus } from "../enums/order.enum";
import { Book } from "./book";

export interface OrderItem {
  _id: mongoose.Types.ObjectId;
  itemQuantity: number;
  itemPrice: number;
  orderId?: mongoose.Types.ObjectId;
  bookId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  _id: mongoose.Types.ObjectId;
  orderTotal: number;
  orderDelivery: number;
  orderStatus: OrderStatus;
  memberId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  /** from aggregations **/
  orderItems: OrderItem[];
  bookData: Book[];
}

export interface OrderItemInput {
  itemQuantity: number;
  itemPrice: number;
  bookId: mongoose.Types.ObjectId;
  orderId?: mongoose.Types.ObjectId;
}

export interface OrderInquiry {
  page: number;
  limit: number;
  orderStatus?: OrderStatus;
}

export interface OrderUpdateInput {
  orderId: string;
  orderStatus: OrderStatus;
}
