const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors"); // 🔥 ADD

const app = express();

// ===== MIDDLEWARE =====
app.use(cors()); // 🔥 VERY IMPORTANT
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// STATIC FILES
app.use(express.static(path.join(__dirname, "public")));

// ===== MONGODB CONNECT =====
mongoose.connect(
  "mongodb+srv://kumarsatish97_db_user:abc%40123@cluster0.09vltwc.mongodb.net/localmarket?retryWrites=true&w=majority"
)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Error:", err));

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

// ===== LOGIN =====
app.post("/login", async (req, res) => {
  const { email } = req.body;

  let user = await User.findOne({ email });

  if (!user) {
    user = new User({ email });
    await user.save();
  }

  res.json({ success: true, user });
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
    console.log("ORDER API HIT 🔥");

    const { user, items, total } = req.body;

    // 🔥 validation (important)
    if (!user || !items || !total) {
      return res.status(400).json({ message: "Missing data ❌" });
    }

    const newOrder = new Order({
      user,
      items,
      total
    });

    await newOrder.save();

    console.log("✅ Order Saved");

    res.json({ message: "Order saved in DB ✅" });

  } catch (err) {
    console.log("❌ ERROR:", err); // 🔥 ये असली problem दिखाएगा
    res.status(500).json({ message: "Server error ❌" });
  }
});

// ===== GET ORDERS =====
app.get("/orders/:user", async (req, res) => {
  const orders = await Order.find({ user: req.params.user });
  res.json(orders);
});

// ===== DEFAULT =====
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ===== PORT =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});