import User from '../auth/model.js';
import Supplier from '../supplier/model.js';
import Invoice from '../invoice/model.js';
import Payment from '../payment/model.js';
import { NotFoundError } from '../../utils/errors.js';

const ensureClientExists = async (clientId) => {
  const client = await User.findOne({ _id: clientId, role: 'client' });
  if (!client) {
    throw new NotFoundError('Client not found');
  }
};

const getClients = async () => {
  return User.find({ role: 'client' });
};

const getClientSuppliers = async (clientId) => {
  await ensureClientExists(clientId);
  return Supplier.find({ createdBy: clientId });
};

const getClientInvoices = async (clientId) => {
  await ensureClientExists(clientId);
  return Invoice.find({ createdBy: clientId });
};

const getClientPayments = async (clientId) => {
  await ensureClientExists(clientId);
  return Payment.find({ createdBy: clientId });
};

export default {
  getClients,
  getClientSuppliers,
  getClientInvoices,
  getClientPayments,
};


