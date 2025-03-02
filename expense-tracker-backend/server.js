const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Expense Schema and Model
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  description: String,
  transactionType: String,
  date: String,
});

const Expense = mongoose.model("Expense", expenseSchema);

// Routes
app.use("/api/users", userRoutes);

// Get all expenses
app.get("/api/expenses", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: "Error fetching expenses" });
  }
});

// Add new expense
app.post("/api/expenses", async (req, res) => {
  try {
    const newExpense = new Expense(req.body);
    await newExpense.save();
    res.json(newExpense);
  } catch (error) {
    res.status(500).json({ error: "Error adding expense" });
  }
});

// Delete expense
app.delete("/api/expenses/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: "Expense deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting expense" });
  }
});

// Update expense
app.put("/api/expenses/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: "Error updating expense" });
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));