import Payment from "./model.js";
import {
  NotFoundError,
  BadRequestError,
  ConflictError,
  UnauthorizedError,
  AppError,
} from "../../utils/errors.js";
import invoiceServices from "../invoice/service.js";
import { Types } from "mongoose";

export const createPayment = async (userId, paymentInfo) => {
  const { amount, note, invoiceId } = paymentInfo;

  const invoice = await invoiceServices.findById(invoiceId);
  if (!invoice) {
    throw new NotFoundError("Invoice not found");
  }
  if (invoice.status === "paid") {
    throw new ConflictError("Invoice is already paid");
  }
  const invoiceTotalPaid = await getInvoiceTotalPaid(invoice.id);
  const remainingAmount = invoice.amount - invoiceTotalPaid;

  if (amount > remainingAmount) {
    throw new BadRequestError(
      `Payment amount exceeds invoice total`
    );
  }

  if (invoice.userId.toString() !== userId) {
    throw new UnauthorizedError("User is not authorized to pay this invoice");
  }

  const payment = await Payment.create({ amount, note, invoiceId, userId });
  if (!payment) {
    throw new AppError(500, "Failed to create payment");
  }

  const newTotalPaid = invoiceTotalPaid + amount;
  if (newTotalPaid === invoice.amount) {
    invoice.status = "paid";
  } else {
    invoice.status = "partially_paid";
  }
  await invoice.save();
  return payment;
};

const getInvoiceTotalPaid = async (invoiceId) => {
  const result = await Payment.aggregate([
    { $match: { invoiceId: new Types.ObjectId(invoiceId) } },
    { $group: { _id: null, totalPaid: { $sum: "$amount" } } },
  ]).exec();

  if (result.length > 0) {
    return result[0].totalPaid;
  }
  return 0;
};

const getInvoicePayments = async (invoiceId) => {
  const invoice = await invoiceServices.findById(invoiceId);
  const payments = await Payment.aggregate()
    .match({ invoiceId: invoice._id })
    .lookup({
      from: "invoices",
      localField: "invoiceId",
      foreignField: "_id",
      as: "invoice",
    })
    .unwind("$invoice")
    .project({
      _id: 1,
      amount: 1,
      note: 1,
      invoiceId: 1,
      userId: 1,
      createdAt: 1,
      updatedAt: 1,
      invoiceStatus: "$invoice.status",
    });
  if (!payments)
    throw new AppError(500, "Failed to retrieve payments for invoice");
  return payments;
};

export default {
  createPayment,
  getInvoicePayments,
};
