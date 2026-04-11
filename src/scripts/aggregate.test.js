import Supplier from "../modules/supplier/model.js"
import {connectDB} from "../config/db.js"

await connectDB()

const supplierStats = await  Supplier
  .aggregate()
  .match({})
  .exec()

console.table(supplierStats)

