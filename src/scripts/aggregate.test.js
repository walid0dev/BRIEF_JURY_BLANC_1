import Supplier from "../modules/supplier/model.js";
import { connectDB } from "../config/db.js";
import { Types } from "mongoose";
await connectDB();

const supplierStats = await Supplier.aggregate()
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
  .addFields({
    totalInvoices: { $size: "$invoices" },
    totalAmount: { $sum: "$invoices.amount" },
    totalPaid: { $sum: "$payments.amount" },
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
  .exec();

console.log(supplierStats[0].invoicesByStatus);

process.exit(0);
