import express from "express";
import { productController } from "../controller/productController";

const productRouter = express.Router();

productRouter.get("/list", productController.getProducts);
productRouter.get("/detail/:id", productController.getProductsDetail);
productRouter.post("/add", productController.addProduct);
productRouter.put("/update/:id", productController.updateProduct);
productRouter.delete("/delete/:id", productController.deleteProduct);

export { productRouter };
