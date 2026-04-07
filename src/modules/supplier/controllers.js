import supplierRepo from "./repo";
import { BadRequestError, NotFoundError } from "../../utils/errors";
import catchAsync from "../../utils/catchAsync";
import { sendResponse } from "../../utils/response";
const getAllSuppliers = catchAsync(async (req, res) => {
    const suppliers = await supplierRepo.findAll(req.user.id);
    sendResponse(res, 200, suppliers.map(supplierRepo.toSafeDocument ));
});

const getSupplierById = catchAsync(async (req, res) => {
    const supplier = await supplierRepo.findById(req.params.id);
    if (!supplier || supplier.userId.toString() !== req.user.id) {
        throw new NotFoundError("Supplier not found");
    }
    sendResponse(res, 200, supplierRepo.toSafeDocument(supplier));
});