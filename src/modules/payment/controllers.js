import { sendResponse } from "../../utils/response.js";
import paymentService from "./service.js";

const createPayment = async (req, res) => {
  const userId = req.user.id;
  const paymentInfo = req.body;
  const invoiceId = req.params.id;
  const payment = await paymentService.createPayment(userId, {
    ...paymentInfo,
    invoiceId,
  });

  sendResponse(res, 201, payment);
};

const getInvoicePayments = async (req, res) => {
  const invoiceId = req.params.id;
  const payments = await paymentService.getInvoicePayments(invoiceId);
  sendResponse(res, 200, payments);
};

export default { createPayment, getInvoicePayments };
