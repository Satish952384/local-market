const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC
app.use(express.static(path.join(__dirname, "public")));

// ===== DB CONNECT =====
mongoose.connect(
  "mongodb+srv://kumarsatish97_db_user:abc%40123@cluster0.09vltwc.mongodb.net/localmarket?retryWrites=true&w=majority"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

// ===== SCHEMAS =====
const User = mongoose.model("User", new mongoose.Schema({
  email: String,
  location: String
}));

const Order = mongoose.model("Order", new mongoose.Schema({
  user: String,
  items: Array,
  total: Number,
  date: { type: Date, default: Date.now }
}));

// ===== LOGIN =====
app.post("/login", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });
  if (!user) {
    user = new User({ email });
    await user.save();
  }

  res.json({ success: true });
});

// ===== LOCATION =====
app.post("/location", async (req, res) => {
  const { email, location } = req.body;
  await User.updateOne({ email }, { location });
  res.json({ success: true });
});

// ===== ORDER =====
app.post("/order", async (req, res) => {
  try {
    console.log("NEW ORDER:", req.body);

    const { user, items, total } = req.body;

    if (!user || !items || !total) {
      return res.status(400).json({ message: "Missing data ❌" });
    }

    const newOrder = new Order({ user, items, total });
    await newOrder.save();

    res.json({ message: "Order saved in DB ✅" });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ===== GET ORDERS =====
app.get("/orders/:user", async (req, res) => {
  const orders = await Order.find({ user: req.params.user });
  res.json(orders);
});

// ===== HOME =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== START =====
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("🚀 Server running"));