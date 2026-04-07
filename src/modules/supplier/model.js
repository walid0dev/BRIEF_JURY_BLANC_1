import { Schema, Types , model } from "mongoose";

const supplierSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  contact: String,
  email: String,
  phone: String,
  address: String,
  userId: {
    type: Types.ObjectId,
    ref: "User",
    required: true,
  },
}, { timestamps: true });

const Supplier = model("Supplier", supplierSchema);

export default Supplier;

