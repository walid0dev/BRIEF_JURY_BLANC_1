import { Schema, model, Types } from "mongoose";

const invoiceSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      ref: "users",
      required: true,
    },
    supplierId: {
      type: Types.ObjectId,
      ref: "suppliers",
      required: true,
    },
    amount: {
      type: Number,
      min: 0,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["paid", "partially_paid", "unpaid"],
      default: "unpaid",
    },
    description: {
      type: String,
      max: 254,
      trim: true,
    },
  },
  { timestamps: true },
);

const Invoice = model("Invoice", invoiceSchema);

export default Invoice;
