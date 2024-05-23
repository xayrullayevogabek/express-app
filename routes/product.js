import { Router } from "express";
import Product from "../models/Product.model.js";
import authMiddleware from "../middlewares/auth.js";
import userMiddleware from "../middlewares/user.js";
const router = Router();

router.get("/", async (req, res) => {
  const products = await Product.find().lean();

  res.render("index", {
    title: "Express - App",
    products: products.reverse(),
    userId: req.userId ? req.userId.toString() : null,
  });
});

router.get("/add", authMiddleware, (req, res) => {
  res.render("add", {
    errorAddProduct: req.flash("errorAddProduct"),
    successAddProduct: req.flash("successAddProduct"),
  });
});

router.post("/add-product", userMiddleware, async (req, res) => {
  const { title, description, image, price } = req.body;
  if (!title || !description || !image || !price) {
    req.flash("errorAddProduct", "All field should be filled");
    res.redirect("/add");
    return;
  }
  await Product.create({ ...req.body, user: req.userId });
  req.flash("successAddProduct", "Product successfully added");
  res.redirect("/add");
});

router.get("/products", async (req, res) => {
  const user = req.userId ? req.userId.toString() : null;
  const products = await Product.find({ user }).populate("user").lean();
  res.render("products", {
    products,
  });
});

export default router;
