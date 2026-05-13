import { Types } from "mongoose";
import Invoice from "../invoice/model.js";
import Supplier from "../supplier/model.js";

const getDashboardSummary = async (userId) => {
  const userObjectId = new Types.ObjectId(userId);
  const now = new Date();

  const [invoiceSummary, totalSuppliers, topSuppliers] = await Promise.all([
    Invoice.aggregate([
      { $match: { userId: userObjectId } },
      {
        $lookup: {
          from: "payments",
          localField: "_id",
          foreignField: "invoiceId",
          as: "payments",
        },
      },
      {
        $addFields: {
          paidOnInvoice: { $sum: "$payments.amount" },
          effectiveStatus: {
            $cond: [
              {
                $and: [{ $ne: ["$status", "paid"] }, { $lt: ["$dueDate", now] }],
              },
              "overdue",
              "$status",
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
          totalPaid: { $sum: "$paidOnInvoice" },
          overdueCount: {
            $sum: { $cond: [{ $eq: ["$effectiveStatus", "overdue"] }, 1, 0] },
          },
          overdueAmount: {
            $sum: { $cond: [{ $eq: ["$effectiveStatus", "overdue"] }, "$amount", 0] },
          },
          unpaidCount: {
            $sum: { $cond: [{ $eq: ["$effectiveStatus", "unpaid"] }, 1, 0] },
          },
          partiallyPaidCount: {
            $sum: { $cond: [{ $eq: ["$effectiveStatus", "partially_paid"] }, 1, 0] },
          },
          paidCount: {
            $sum: { $cond: [{ $eq: ["$effectiveStatus", "paid"] }, 1, 0] },
          },
        },
      },
    ]),
    Supplier.countDocuments({ userId: userObjectId }),
    Invoice.aggregate([
      { $match: { userId: userObjectId } },
      {
        $group: {
          _id: "$supplierId",
          totalInvoices: { $sum: 1 },
          totalAmount: { $sum: "$amount" },
        },
      },
      { $sort: { totalAmount: -1 } },
      { $limit: 3 },
      {
        $lookup: {
          from: "suppliers",
          localField: "_id",
          foreignField: "_id",
          as: "supplier",
        },
      },
      {
        $unwind: {
          path: "$supplier",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 0,
          id: "$_id",
          name: "$supplier.name",
          totalInvoices: 1,
          totalAmount: 1,
        },
      },
    ]),
  ]);

  const summary = invoiceSummary[0] ?? {
    totalInvoices: 0,
    totalAmount: 0,
    totalPaid: 0,
    overdueCount: 0,
    overdueAmount: 0,
    unpaidCount: 0,
    partiallyPaidCount: 0,
    paidCount: 0,
  };

  return {
    totalSuppliers,
    totalInvoices: summary.totalInvoices,
    totalAmount: summary.totalAmount,
    totalPaid: summary.totalPaid,
    totalRemaining: summary.totalAmount - summary.totalPaid,
    overdueCount: summary.overdueCount,
    overdueAmount: summary.overdueAmount,
    invoicesByStatus: {
      unpaid: summary.unpaidCount,
      partially_paid: summary.partiallyPaidCount,
      paid: summary.paidCount,
      overdue: summary.overdueCount,
    },
    topSuppliers,
  };
};

export default {
  getDashboardSummary,
};
