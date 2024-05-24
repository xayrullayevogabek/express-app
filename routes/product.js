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

router.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).lean();
  res.render("detail", {
    product,
  });
});

router.get("/product/edit/:id", async (req, res) => {
  const id = req.params.id;
  const product = await Product.findById(id).lean();

  res.render("edit", {
    product,
    errorEditProduct: req.flash("errorEditProduct"),
  });
});

router.post("/edit-product/:id", async (req, res) => {
  const id = req.params.id;
  const { title, price, image, description } = req.body;
  if (!title || !price || !image || !description) {
    req.flash("errorEditProduct", "All fields should be filled");
    res.redirect(`/product/edit/${id}`);
    return;
  }
  await Product.findByIdAndUpdate(id, req.body);
  res.redirect("/products");
});

router.post("/delete/:id", async (req, res) => {
  const id = req.params.id;

  await Product.findByIdAndDelete(id);
  res.redirect("back");
});

export default router;
