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

export default {
    getInvoices,
    createInvoice
};