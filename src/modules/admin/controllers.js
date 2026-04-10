import catchAsync from '../../utils/catchAsync.js';
import adminService from './service.js';
import { sendResponse } from '../../utils/response.js';

const getClients = catchAsync(async (req, res) => {
  const clients = await adminService.getClients();
  sendResponse(res, 200, clients, 'Clients retrieved successfully');
});

const getClientSuppliers = catchAsync(async (req, res) => {
  const { id } = req.params;
  const suppliers = await adminService.getClientSuppliers(id);
  sendResponse(res, 200, suppliers, 'Client suppliers retrieved successfully');
});

const getClientInvoices = catchAsync(async (req, res) => {
  const { id } = req.params;
  const invoices = await adminService.getClientInvoices(id);
  sendResponse(res, 200, invoices, 'Client invoices retrieved successfully');
});

const getClientPayments = catchAsync(async (req, res) => {
  const { id } = req.params;
  const payments = await adminService.getClientPayments(id);
  sendResponse(res, 200, payments, 'Client payments retrieved successfully');
});

export default {
  getClients,
  getClientSuppliers,
  getClientInvoices,
  getClientPayments,
};
