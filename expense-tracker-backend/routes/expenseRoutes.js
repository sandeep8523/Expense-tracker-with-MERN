const express = require("express");
const router = express.Router();
const Expense = require("../models/Expense");

// ➤ CREATE a new expense
router.post("/add", async (req, res) => {
  try {
    const { title, amount, type, category, date } = req.body;
    const newExpense = new Expense({ title, amount, type, category, date });
    await newExpense.save();
    res.status(201).json({ message: "Expense added successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ GET all expenses
router.get("/", async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ UPDATE an expense
router.put("/update/:id", async (req, res) => {
  try {
    const updatedExpense = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedExpense);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ DELETE an expense
router.delete("/delete/:id", async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Expense deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ➤ FILTER expenses by date & type
router.get("/filter", async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    let filter = {};

    if (type) filter.type = type;
    if (startDate && endDate) filter.date = { $gte: new Date(startDate), $lte: new Date(endDate) };

    const filteredExpenses = await Expense.find(filter);
    res.status(200).json(filteredExpenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
