import { Router } from 'express';
import adminController from './controllers.js';
import { authenticate, authorize, requireToken } from '../../shared/middlewares/auth.js';
import { validateParams } from '../../shared/middlewares/validators.js';
import { objectIdParamSchema } from '../../utils/validators.js';

const adminRouter = Router();

adminRouter.use(requireToken, authenticate);

adminRouter.get('/clients', authorize(['admin']), adminController.getClients);
adminRouter.get('/clients/:id/suppliers', authorize(['admin']), validateParams(objectIdParamSchema), adminController.getClientSuppliers);
adminRouter.get('/clients/:id/invoices', authorize(['admin']), validateParams(objectIdParamSchema), adminController.getClientInvoices);
adminRouter.get('/clients/:id/payments', authorize(['admin']), validateParams(objectIdParamSchema), adminController.getClientPayments);


export default adminRouter;
