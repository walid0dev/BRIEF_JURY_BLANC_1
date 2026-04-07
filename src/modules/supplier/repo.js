import Supplier from "./model";
class SupplierRepo {
    constructor(model) { this.model = model; }

    async create(data) {
        return await this.model.create(data);
    }

    async findAll(userId = "") {
        return await this.model.find({ userId });
    }

    async findById(id) {
        return await this.model.findById(id);
    }

    async update(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }

    async delete(id) {
        return await this.model.findByIdAndDelete(id);
    }

    toSafeDocument(supplier) {
        const { _id, name, contact, email, phone, address , createdAt } = supplier;
        return { id: _id, name, contact, email, phone, address, createdAt };
    }

}

const supplierRepo = new SupplierRepo(Supplier);

export default supplierRepo;