import { sendResponse } from "../../utils/response.js";
import paymentService from "./service.js";
import catchAsync from "../../utils/catchAsync.js";

const createPayment = catchAsync(async (req, res) => {
  const userId = req.user.id;
  const paymentInfo = req.body;
  const invoiceId = req.params.id;
  console.log(userId, paymentInfo, invoiceId);
  const payment = await paymentService.createPayment(userId, {
    ...paymentInfo,
    invoiceId,
  });

  sendResponse(res, 201, payment);
});

const getInvoicePayments = catchAsync(async (req, res) => {
  const invoiceId = req.params.id;
  console.log(invoiceId);
  const payments = await paymentService.getInvoicePayments(invoiceId);
  sendResponse(res, 200, payments);
});

export default { createPayment, getInvoicePayments };
