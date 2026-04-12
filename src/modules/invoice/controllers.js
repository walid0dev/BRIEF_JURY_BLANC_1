import { sendResponse } from "../../utils/response.js";
import invoiceService from "./service.js";
const getInvoices = async (req, res) => {
  const invoices = await invoiceService.getInvoices(req.user.id);
  sendResponse(res, 200, { invoices }, "Invoices retrieved successfully");
};

const createInvoice = async (req, res) => {
  const invoice = await invoiceService.createInvoice(req.user.id, req.body);
  sendResponse(res, 201, { invoice }, "Invoice created successfully");
};

const getInvoice = async (req, res) => {
  const invoice = await invoiceService.findById(req.params.id);
  sendResponse(res, 200, { invoice }, "Invoice retrieved successfully");
};

const updateInvoice = async (req, res) => {
  const invoice = await invoiceService.updateInvoice(req.params.id, req.body);
  sendResponse(res, 200, { invoice }, "Invoice updated successfully");
};

const deleteInvoice = async (req, res) => {
  const deleted = await invoiceService.deleteInvoice(req.params.id);
  sendResponse(res, 200, { deleted }, "Invoice deleted successfully");
};

export default {
  getInvoices,
  createInvoice,
  getInvoice,
  updateInvoice,
  deleteInvoice
};

