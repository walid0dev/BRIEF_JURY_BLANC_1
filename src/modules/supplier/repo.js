import Supplier from "./model.js";
import { Types } from "mongoose";
import { BadRequestError } from "../../utils/errors.js";
class SupplierRepo {
    constructor(model) { this.model = model; }

    async create(data) {
        return await this.model.create(data);
    }

    async findAll(userId = "") {
        const suppliers = await this.model.find({ userId });
        return suppliers;
    }

    async findById(id) {
        if (!Types.ObjectId.isValid(supplierId)) throw new BadRequestError("Invalid supplier ID");
        const supplier = await this.model
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
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }



    toSafeDocument(supplier) {
        const { _id, name, contact, email, phone, address, createdAt } = supplier;
        return { id: _id, name, contact, email, phone, address, createdAt };
    }

}

const supplierRepo = new SupplierRepo(Supplier);

export default supplierRepo;