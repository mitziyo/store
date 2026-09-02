import Errors, { HttpCode } from "../libs/Error";
import { T } from "../libs/types/common";
import { ExtendedRequest } from "../libs/types/member";
import { Request, Response } from "express";
import OrderService from "../models/Order.service";
import { OrderInquiry, OrderUpdateInput } from "../libs/types/order";
import { OrderStatus } from "../libs/enums/order.enum";

const orderService = new OrderService();

const orderController: T = {};

/** SPA */
orderController.createOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("createOrder");
    const result = await orderService.createOrder(req.member, req.body);
    res.status(HttpCode.CREATED).json(result);
  } catch (err) {
    console.log("Error, createOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.getMyOrders = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("getMyOrders");
    const { page, limit, orderStatus } = req.query;
    const inquiry: OrderInquiry = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 8,
    };
    if (orderStatus) inquiry.orderStatus = orderStatus as OrderStatus;

    const result = await orderService.getMyOrders(req.member, inquiry);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, getMyOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrder = async (req: ExtendedRequest, res: Response) => {
  try {
    console.log("updateOrder");
    const input: OrderUpdateInput = req.body;
    const result = await orderService.updateOrder(req.member, input);
    res.status(HttpCode.OK).json(result);
  } catch (err) {
    console.log("Error, updateOrder:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

/** SSR */
orderController.getAllOrders = async (req: Request, res: Response) => {
  try {
    console.log("getAllOrders");
    const data = await orderService.getAllOrders();
    res.render("orders", { orders: data });
  } catch (err) {
    console.log("Error, getAllOrders:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

orderController.updateOrderStatus = async (req: Request, res: Response) => {
  try {
    console.log("updateOrderStatus");
    const id = req.params.id as string;
    const orderStatus: OrderStatus = req.body.orderStatus;
    const result = await orderService.updateOrderStatus(id, orderStatus);
    res.status(HttpCode.OK).json({ data: result });
  } catch (err) {
    console.log("Error, updateOrderStatus:", err);
    if (err instanceof Errors) res.status(err.code).json(err);
    else res.status(Errors.standard.code).json(Errors.standard);
  }
};

export default orderController;
