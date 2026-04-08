import Supplier from "./model.js";
import { Types } from "mongoose";
import { BadRequestError } from "../../utils/errors.js";
class SupplierRepo {
    constructor(model) { this.model = model; }

    async create(data) {
        return await this.model.create(data);
    }

    async findAll(userId = "") {
        if (userId && !Types.ObjectId.isValid(userId)) {
            throw new BadRequestError("Invalid user ID");
        }
        return await this.model.find({ userId });
    }

    async findById(id) {    
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid supplier ID");
        }
        return await this.model.findById(id);
    }

    async update(id, data) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid supplier ID");
        }
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        if (!Types.ObjectId.isValid(id)) {
            throw new BadRequestError("Invalid supplier ID");
        }
        return await this.model.findByIdAndDelete(id);
    }

    toSafeDocument(supplier) {
        const { _id, name, contact, email, phone, address , createdAt } = supplier;
        return { id: _id, name, contact, email, phone, address, createdAt };
    }

}

const supplierRepo = new SupplierRepo(Supplier);

export default supplierRepo;