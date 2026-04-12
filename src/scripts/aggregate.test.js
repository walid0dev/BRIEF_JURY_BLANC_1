import Supplier from "../modules/supplier/model.js";
import { connectDB } from "../config/db.js";
import { Types } from "mongoose";
import { writeFile } from "node:fs/promises";

await connectDB();

const [supplierStats] = await Supplier.aggregate()
  .match({ _id: new Types.ObjectId("69d64d51f2888daab91385e0") })
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
        { $gt: [{ $ifNull: [{ $first: "$clientTotals.totalAmount" }, 0] }, 0] },
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


await writeFile("./supplierStats.json", JSON.stringify(supplierStats));
process.exit(0);
