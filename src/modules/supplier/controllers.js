import supplierRepo from "./repo.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import catchAsync from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/response.js";
const getAllSuppliers = catchAsync(async (req, res) => {
  const suppliers = await supplierRepo.findAll(req.user.id);
  sendResponse(res, 200, suppliers.map(supplierRepo.toSafeDocument));
});

const getSupplierById = catchAsync(async (req, res) => {
  const supplier = await supplierRepo.findById(req.params.id);
  if (!supplier || supplier.userId.toString() !== req.user.id) {
    throw new NotFoundError("Supplier not found");
  }
  sendResponse(res, 200, supplierRepo.toSafeDocument(supplier));
});

const updateSupplier = catchAsync(async (req, res) => {
  const supplierData = req.body;
  const supplierId = req.params.id;
  const supplier = await supplierRepo.update(supplierId, supplierData);
  if (!supplier) throw new NotFoundError("Supplier not found");
  sendResponse(
    res,
    200,
    supplierRepo.toSafeDocument(supplier),
    "Supplier updated successfully",
  );
});

const deleteSupplier = catchAsync(async (req, res) => {
  const supplierId = req.params.id;
  const supplier = await supplierRepo.delete(supplierId);
  if (!supplier) throw new NotFoundError("Supplier not found");
  sendResponse(res, 200, supplierRepo.toSafeDocument(supplier), "Supplier deleted successfully");
});


const createSupplier = catchAsync(async (req, res) => {
    const supplierData = req.body;
    supplierData.userId = req.user.id;
    const supplier = await supplierRepo.create(supplierData);
    if(!supplier) throw new BadRequestError("Failed to create supplier");
    sendResponse(res, 201, supplierRepo.toSafeDocument(supplier), "Supplier created successfully");

});

export default {
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  createSupplier
};
