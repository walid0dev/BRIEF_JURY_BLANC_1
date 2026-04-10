import { isObjectIdOrHexString, Types } from "mongoose";
import { BadRequestError, UnauthorizedError, AppError, NotFoundError } from "../../utils/errors.js";
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
    if (!isObjectIdOrHexString(id)) throw new BadRequestError("Invalid supplier ID");
    const exists = await Supplier.exists({ _id: id });
    return exists;
};
const findById = async (id, userId) => {
    if (!isObjectIdOrHexString(id)) throw new BadRequestError("Invalid supplier ID");
    const [supplier] = await Supplier
        .aggregate()
        .match({ _id: new Types.ObjectId(id) })
        .lookup({
            from: "invoices",
            localField: "_id",
            foreignField: "supplierId",
            as: "invoices"
        })
        .addFields({
            invoiceCount: { $size: "$invoices" }
        })
        .exec();
    if (!supplier) throw new NotFoundError("Supplier not found");
    if (!supplier.userId.equals(userId)) throw new UnauthorizedError("Unauthorized access to supplier");
    return supplier;
};

const updateSupplier = async (id, data, userId) => {
    if (!isObjectIdOrHexString(id)) throw new BadRequestError("Invalid supplier ID");
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new NotFoundError("Supplier not found");
    if (!supplier.userId.equals(userId)) throw new UnauthorizedError("Unauthorized access to supplier");
    Object.assign(supplier, data);
    await supplier.save();
    return supplier;
};

const deleteSupplier = async (id, userId) => {
    if (!isObjectIdOrHexString(id)) throw new BadRequestError("Invalid supplier ID");
    const supplier = await Supplier.findById(id);
    if (!supplier) throw new BadRequestError("Supplier not found");
    if (!supplier.userId.equals(userId)) throw new UnauthorizedError("Unauthorized access to supplier");
    const deleted = await Supplier.findByIdAndDelete(id);
    if (!deleted) throw new AppError("Failed to delete supplier");
    return deleted;
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
    supplierExists
};
