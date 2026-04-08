import catchAsync from "../../utils/catchAsync.js"
import {UnauthorizedError , NotFoundError , ForbiddenError, BadRequestError} from "../../utils/errors.js"

// a factory function to create ownership check middleware for different models and configurations
const createOwnershipChecker = (model, {resourceKey ,ownerKey , attachToRequest , requestPropName}) =>
  catchAsync(async (req, _, next) => {
  const resourceId = req.params[resourceKey]
  if(!resourceId) throw new BadRequestError(`Resource ID not found in request at key: ${resourceKey}`)
  if(!req.user || !req.user.id) throw new UnauthorizedError("Unauthorized access")

  const userId = req.user.id 
  const resource = await model.findById(resourceId)

  if(!resource) throw new NotFoundError(`${model.modelName} not found`)

  const resourceOwnerId = resource.get(ownerKey)
  if(!resourceOwnerId) throw new ForbiddenError("Can't access this resource")

  const ownerValue = typeof resourceOwnerId === "object" && "toString" in resourceOwnerId
    ? resourceOwnerId.toString()
    : String(resourceOwnerId)

  if(ownerValue !== userId) throw new ForbiddenError("Can't access this resource")

  if(attachToRequest) {
    req[requestPropName] = resource
  }

  next()
})

export default createOwnershipChecker
