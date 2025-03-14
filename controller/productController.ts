import mongoose from "mongoose";
import { Request, Response, RequestHandler } from "express";
import Product, { IProduct } from "../model/Product";

const PAGE_SIZE = 5;

export const productController = {
  getProducts: (async (req: Request, res: Response) => {
    try {
      const { page, name } = req.query as { page?: string; name?: string };
      const pageNumber = page ? parseInt(page, 10) : 1;

      const cond = name
        ? { name: { $regex: name, $options: "i" }, isDeleted: false }
        : { isDeleted: false };

      let query = Product.find(cond);
      let response: {
        status: string;
        totalPageNum?: number;
        data?: IProduct[];
      } = { status: "success" };

      if (page) {
        query = query.skip((pageNumber - 1) * PAGE_SIZE).limit(PAGE_SIZE);

        // 전체 제품 및 페이지네이션
        const totalItemNum = await Product.countDocuments(cond);
        const totalPageNum = Math.ceil(totalItemNum / PAGE_SIZE);
        response.totalPageNum = totalPageNum;
      }

      const productList = await query.exec();
      response.data = productList;

      return res.status(200).json(response);
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }) as RequestHandler,
  getProductsDetail: (async (req: Request, res: Response) => {
    try {
      const { id } = req.params as { id: string };

      const product = await Product.findById(id);
      if (!product) {
        return res
          .status(404)
          .json({ status: "fail", message: "No item found" });
      }

      return res.status(200).json({ status: "success", data: product });
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }) as RequestHandler,
  addProduct: (async (req: Request, res: Response) => {
    try {
      const {
        sku,
        name,
        size,
        thumbnail,
        detailImages,
        category,
        description,
        price,
        stock,
        status,
      } = req.body;

      // SKU 중복 여부
      const existingProduct = await Product.findOne({ sku });
      if (existingProduct) {
        return res.status(400).json({
          status: "fail",
          error: `A product with SKU '${sku}' already exists.`,
        });
      }

      const newProduct: IProduct = new Product({
        sku,
        name,
        size,
        thumbnail,
        detailImages,
        category,
        description,
        price,
        stock,
        status,
      });

      await newProduct.save();
      return res.status(200).json({ status: "success", newProduct });
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }) as RequestHandler,
  updateProduct: (async (req: Request, res: Response) => {
    try {
      return res.status(200).json({ status: "success", data: [] });
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }) as RequestHandler,
  deleteProduct: (async (req: Request, res: Response) => {
    try {
      return res.status(200).json({ status: "success", data: [] });
    } catch (error: unknown) {
      res.status(500).json({
        status: "fail",
        error:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  }) as RequestHandler,
};
