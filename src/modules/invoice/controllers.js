import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/response.js";
import invoiceService from "./service.js";
const getInvoices = catchAsync(async (req, res) => {
  const invoices = await invoiceService.getInvoices(req.user.id);
  sendResponse(res, 200, invoices, "Invoices retrieved successfully");
});

const createInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.user.id, req.body);
  sendResponse(res, 201, invoice, "Invoice created successfully");
});

const getInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.findById(req.params.id);
  sendResponse(res, 200, invoice,);
});

const updateInvoice = catchAsync(async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  sendResponse(res, 200, invoice, "Invoice updated successfully");
});

const deleteInvoice = catchAsync(async (req, res) => {
  await invoiceService.deleteInvoice(req.params.id);
  sendResponse(res, 200, null, "Invoice deleted successfully");
});

export default {
  getInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice
};

