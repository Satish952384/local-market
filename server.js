const express = require("express");
const path = require("path");
const mongoose = require("mongoose");

const app = express();

// ===== MIDDLEWARE =====
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// ===== MONGODB CONNECT (FIXED) =====
mongoose.connect("mongodb+srv://kumarsatish97_db_user:abc%40123@cluster0.09vltwc.mongodb.net/localmarket?retryWrites=true&w=majority")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log(err));

// ===== SCHEMA =====
const userSchema = new mongoose.Schema({
  email: String,
  location: String
});

const orderSchema = new mongoose.Schema({
  user: String,
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
});

const User = mongoose.model("User", userSchema);
const Order = mongoose.model("Order", orderSchema);

// ===== LOGIN API =====
app.post("/login", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email });
    await user.save();
  }

  res.json({ success: true, user });
});

// ===== SAVE LOCATION =====
app.post("/location", async (req, res) => {
  const { email, location } = req.body;

  await User.updateOne({ email }, { location });

  res.json({ success: true });
});

// ===== ORDER API =====
app.post("/order", async (req, res) => {
  const { user, items, total } = req.body;

  const newOrder = new Order({ user, items, total });
  await newOrder.save();

  res.json({ message: "Order saved in DB ✅" });
});

// ===== GET ORDERS =====
app.get("/orders/:user", async (req, res) => {
  const orders = await Order.find({ user: req.params.user });
  res.json(orders);
});

// ===== START SERVER =====
app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});