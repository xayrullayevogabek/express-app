import express from "express";
import { create } from "express-handlebars";
import * as dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";
import flash from "connect-flash";

// ROUTES
import AuthRouter from "./routes/auth.js";
import ProductRouter from "./routes/product.js";

dotenv.config();

const app = express();

const hbs = create({
  defaultLayout: "main",
  extname: "hbs",
});

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", "./views");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({ secret: "Secret", resave: false, saveUninitialized: false }));
app.use(flash());

// ROUTES
app.use(AuthRouter);
app.use(ProductRouter);

const startApp = () => {
  try {
    mongoose.set("strictQuery", false);
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log("MongoDb connected"))
      .catch((error) => console.log(error));

    const PORT = process.env.PORT || 1000;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

startApp();
