import { isObjectIdOrHexString, Types } from "mongoose";
import {
  BadRequestError,
  UnauthorizedError,
  AppError,
  NotFoundError,
} from "../../utils/errors.js";
import Supplier from "./model.js";

const createSupplier = async (data) => {
  const created = await Supplier.create(data);
  if (!created) throw new AppError("Failed to create supplier");
  return created;
};

const findAllSuppliers = async (userId) => {
  const suppliers = await Supplier.find({ userId });
  return suppliers;
};

const supplierExists = async (id) => {
  const exists = await Supplier.exists({ _id: id });
  return exists;
};
const findById = async (id, userId) => {
  const [supplier] = await Supplier.aggregate()
    .match({ _id: new Types.ObjectId(id) })
    .lookup({
      from: "invoices",
      localField: "_id",
      foreignField: "supplierId",
      as: "invoices",
    })
    .addFields({
      invoiceCount: { $size: "$invoices" },
    })
    .exec();
  if (!supplier) throw new NotFoundError("Supplier not found");
  if (!supplier.userId.equals(userId))
    throw new UnauthorizedError("Unauthorized access to supplier");
  return supplier;
};

const updateSupplier = async (id, data, userId) => {
  if (!isObjectIdOrHexString(id))
    throw new BadRequestError("Invalid supplier ID");
  const supplier = await Supplier.findById(id);
  if (!supplier) throw new NotFoundError("Supplier not found");
  if (!supplier.userId.equals(userId))
    throw new UnauthorizedError("Unauthorized access to supplier");
  Object.assign(supplier, data);
  await supplier.save();
  return supplier;
};

const deleteSupplier = async (id, userId) => {
  if (!isObjectIdOrHexString(id))
    throw new BadRequestError("Invalid supplier ID");
  const supplier = await Supplier.findById(id);
  if (!supplier) throw new BadRequestError("Supplier not found");
  if (!supplier.userId.equals(userId))
    throw new UnauthorizedError("Unauthorized access to supplier");
  const deleted = await Supplier.findByIdAndDelete(id);
  if (!deleted) throw new AppError("Failed to delete supplier");
  return deleted;
};

const getSupplierStats = async (supplierId, userId) => {
  const supplier = await findById(supplierId, userId);
  if (!supplier) throw new NotFoundError("Supplier not found");
  const [supplierStats] = await Supplier.aggregate()
    .match({ _id: new Types.ObjectId(supplierId) })
    .lookup({
      from: "invoices",
      localField: "_id",
      foreignField: "supplierId",
      as: "invoices",
    })
    .lookup({
      from: "payments",
      localField: "invoices._id",
      foreignField: "invoiceId",
      as: "payments",
    })
    .lookup({
      from: "invoices",
      let: { userId: "$userId" },
      pipeline: [
        {
          $match: {
            $expr: { $eq: ["$userId", "$$userId"] },
          },
        },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: "$amount" },
          },
        },
      ],
      as: "clientTotals",
    })
    .addFields({
      totalInvoices: { $size: "$invoices" },
      totalAmount: { $sum: "$invoices.amount" },
      totalPaid: { $sum: "$payments.amount" },
      clientTotalAmount: {
        // clientTotals is an array, we take the first element's totalAmount or default to 0
        $ifNull: [{ $first: "$clientTotals.totalAmount" }, 0],
      },
      supplierSpendPercentage: {
        $cond: [
          {
            $gt: [{ $ifNull: [{ $first: "$clientTotals.totalAmount" }, 0] }, 0],
          },
          {
            $round: [
              {
                $multiply: [
                  {
                    $divide: [
                      { $sum: "$invoices.amount" },
                      { $ifNull: [{ $first: "$clientTotals.totalAmount" }, 0] },
                    ],
                  },
                  100,
                ],
              },
              2,
            ],
          },
          0,
        ],
      },
      invoicesByStatus: {
        $arrayToObject: {
          $map: {
            input: ["paid", "unpaid", "partially_paid"],
            as: "status",
            in: {
              k: "$$status",
              v: {
                $filter: {
                  input: "$invoices",
                  as: "invoice",
                  cond: { $eq: ["$$invoice.status", "$$status"] },
                },
              },
            },
          },
        },
      },
    })
    .addFields({
      totalRemaining: { $subtract: ["$totalAmount", "$totalPaid"] },
    })
    .project({
      payments: 0,
      invoices: 0,
      clientTotals: 0,
      __v: 0,
    })
    .exec();

  if (!supplierStats)
    throw new AppError(500, undefined, "Couldn't calculate supplier stats");
  return supplierStats;
};

const toSafeDocument = (supplier) => {
  const { _id, name, contact, email, phone, address, createdAt } = supplier;
  return { id: _id, name, contact, email, phone, address, createdAt };
};

export default {
  createSupplier,
  findAllSuppliers,
  findById,
  updateSupplier,
  deleteSupplier,
  toSafeDocument,
  supplierExists,
  getSupplierStats
};
