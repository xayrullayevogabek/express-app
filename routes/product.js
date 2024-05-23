import { Router } from "express";
import Product from "../models/Product.model.js";
import authMiddleware from "../middlewares/auth.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find().lean();
  console.log(products);

  res.render("index", {
    title: "Express - App",
    products: products.reverse(),
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    errorAddProduct: req.flash("errorAddProduct"),
    successAddProduct: req.flash("successAddProduct"),
  });
});

router.post("/add-product", async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("errorAddProduct", "All field should be filled");
    res.redirect("/add");
    return;
  }
  await Product.create(req.body);
  req.flash("successAddProduct", "Product successfully added");
  res.redirect("/add");
});

router.get("/products", (req, res) => {
  res.render("products");
});

export default router;
