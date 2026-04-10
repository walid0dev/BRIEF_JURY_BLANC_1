import { AppError, ConflictError, NotFoundError , BadRequestError} from "../../utils/errors.js";
import { Types } from "mongoose";
import Invoice from "./model.js";
import supplierService from "../supplier/service.js";

const findById = async (id) => {
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new NotFoundError("Invoice not found");
    return invoice;
};

const createInvoice = async (userId, data) => {
    const { supplierId } = data;
    await supplierService.findById(supplierId, userId);
    const invoice = await Invoice.create({ ...data, userId });
    if (!invoice) throw new AppError("Failed to create invoice", 500);
    return invoice;
};

const updateInvoice = async (id, data) => {
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new NotFoundError("Invoice not found");
    if (invoice.status === "paid") throw new ConflictError("Cannot update a paid invoice");
    Object.assign(invoice, data);
    await invoice.save();
    return invoice;
};

const getInvoices = async (userId) => {
    const invoices = await Invoice
        .aggregate([
            { $match: { userId: new Types.ObjectId(userId) } },
            {
                $lookup: {
                    from: "payments",
                    localField: "_id",
                    foreignField: "invoiceId",
                    as: "payments"
                }
            },
            {
                $lookup: {
                    from: "suppliers",
                    localField: "supplierId",
                    foreignField: "_id",
                    as: "supplier"
                }
            },
            { $unwind: { path: "$supplier", preserveNullAndEmptyArrays: true } },
            {
                $addFields: {
                    supplierName: "$supplier.name",
                    totalPaid: { $sum: "$payments.amount" },
                    remainingAmount: {
                        $subtract: ["$amount", { $sum: "$payments.amount" }]
                    }
                }
            },
            { $project: { supplier: 0, payments: 0 } } 
        ])
        .exec();
    return invoices;
};

const deleteInvoice = async (id) => {
    const invoice = await Invoice.findById(id);
    if (!invoice) throw new NotFoundError("Invoice not found");
    if (invoice.status === "paid") throw new ConflictError("Cannot delete a paid invoice");
    const deleted =  invoice.deleteOne();
    if (!deleted) throw new AppError("Failed to delete invoice", 500);
    return deleted
};



export default {
    createInvoice,
    getInvoices,
    findById,
    updateInvoice,
    deleteInvoice,
};