import supplierService from "./service.js";
import { BadRequestError, NotFoundError } from "../../utils/errors.js";
import { sendResponse } from "../../utils/response.js";

const getAllSuppliers = async (req, res) => {
  const suppliers = await supplierService.findAllSuppliers(req.user.id);
  sendResponse(res, 200, suppliers.map(supplierService.toSafeDocument));
};

const getSupplierById = async (req, res) => {
  const supplier = await supplierService.findById(req.params.id, req.user.id);
  if (!supplier) {
    throw new NotFoundError("Supplier not found");
  }
  sendResponse(res, 200, supplierService.toSafeDocument(supplier));
};

const updateSupplier = async (req, res) => {
  const supplierData = req.body;
  const supplierId = req.params.id;
  const supplier = await supplierService.updateSupplier(supplierId, supplierData, req.user.id);
  if (!supplier) throw new NotFoundError("Supplier not found");
  sendResponse(
    res,
    200,
    supplierService.toSafeDocument(supplier),
    "Supplier updated successfully",
  );
};

const deleteSupplier = async (req, res) => {
  const supplierId = req.params.id;
  const supplier = await supplierService.deleteSupplier(supplierId, req.user.id);
  if (!supplier) throw new NotFoundError("Supplier not found");
  sendResponse(res, 200, supplierService.toSafeDocument(supplier), "Supplier deleted successfully");
};


const createSupplier = async (req, res) => {
    const supplierData = req.body;
    supplierData.userId = req.user.id;
    const supplier = await supplierService.createSupplier(supplierData);
    if(!supplier) throw new BadRequestError("Failed to create supplier");
    sendResponse(res, 201, supplierService.toSafeDocument(supplier), "Supplier created successfully");
};

const getSupplierStats = async (req, res) => {
  const supplierId = req.params.id;
  const stats = await supplierService.getSupplierStats(supplierId, req.user.id);
  sendResponse(res, 200, stats);
};

export default {
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
  createSupplier,
  getSupplierStats
};
