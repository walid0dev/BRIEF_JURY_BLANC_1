import { Schema, model, Types } from "mongoose";

const paymentSchema = new Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
      ref: "User",
    },
    invoiceId: {
      type: Types.ObjectId,
      required: true,
      ref: "Invoice",
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    note: {
      type: String,
    },
  },
  { timestamps: true },
);

const Payment = model("Payment", paymentSchema);
export default Payment;
