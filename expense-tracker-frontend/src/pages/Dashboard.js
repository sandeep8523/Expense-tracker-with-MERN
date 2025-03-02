import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Select, MenuItem, FormControl, InputLabel, TextField, Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";
import { FaList, FaChartPie, FaSun, FaMoon } from "react-icons/fa";
import axios from "axios";
import "../styles/dashboard.css";

const Dashboard = () => {
  const [viewMode, setViewMode] = useState("list");
  const [frequency, setFrequency] = useState("week");
  const [type, setType] = useState("education");
  const [darkMode, setDarkMode] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [newExpense, setNewExpense] = useState({
    title: "",
    amount: "",
    category: "education",
    description: "",
    transactionType: "income",
    date: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      fetchExpenses();
    }
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setExpenses(res.data);
    } catch (error) {
      console.error("Error fetching expenses:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleAddNew = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleInputChange = (e) => {
    setNewExpense({ ...newExpense, [e.target.name]: e.target.value });
  };




  const handleSubmit = async () => {
    try {
      if (editExpense) {
        // Update existing expense
        await axios.put(`http://localhost:5000/api/expenses/${editExpense._id}`, newExpense, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        setExpenses((prev) =>
          prev.map((expense) =>
            expense._id === editExpense._id ? newExpense : expense
          )
        );
      } else {
        // Add new expense
        const res = await axios.post("http://localhost:5000/api/expenses", newExpense, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
  
        setExpenses([...expenses, res.data]); // Add to UI
      }
  
      // Close modal and reset state
      setOpenModal(false);
      setNewExpense({ title: "", amount: "", category: "education", description: "", transactionType: "income", date: "" });
      setEditExpense(null); // Reset edit mode
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  



  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`);
      setExpenses(expenses.filter((expense) => expense._id !== id)); // Remove from UI
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };
  const handleEdit = (expense) => {
    setEditExpense(expense); // Set selected expense for editing
    setNewExpense(expense);  // Pre-fill modal with expense details
    setOpenModal(true);      // Open the modal
  };
  

  const [editExpense, setEditExpense] = useState(null); // Track selected expense for editing

  
  

  return (
    <div className={`dashboard-container ${darkMode ? "dark" : "light"}`}> 
      {/* Header */}
      <header className="dashboard-header">
        <Button className="theme-toggle" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FaSun /> : <FaMoon />}
        </Button>
        <h2 className="dashboard-title">Expense Tracker Dashboard</h2>
        <Button className="logout-button" onClick={handleLogout}>Logout</Button>
      </header>

      {/* Controls */}
      <div className="controls">
        <FormControl variant="outlined" size="small">
          <InputLabel>Frequency</InputLabel>
          <Select value={frequency} onChange={(e) => setFrequency(e.target.value)} className="custom-select">
            <MenuItem value="day" className="custom-menu-item">Today</MenuItem>
            <MenuItem value="week" className="custom-menu-item">This week</MenuItem>
            <MenuItem value="month" className="custom-menu-item">This Month</MenuItem>
          </Select>
        </FormControl>

        <FormControl variant="outlined" size="small">
          <InputLabel>Type</InputLabel>
          <Select value={type} onChange={(e) => setType(e.target.value)} className="custom-select">
            <MenuItem value="education" className="custom-menu-item">Education</MenuItem>
            <MenuItem value="furniture" className="custom-menu-item">Furniture</MenuItem>
            <MenuItem value="personal" className="custom-menu-item">Personal</MenuItem>
            <MenuItem value="entertainment" className="custom-menu-item">Entertainment</MenuItem>
            <MenuItem value="transportation" className="custom-menu-item">Transportation</MenuItem>
          </Select>
        </FormControl>

        <div>
          <Button variant={viewMode === "list" ? "contained" : "outlined"} onClick={() => setViewMode("list")}>
            <FaList />
          </Button>
          <Button variant={viewMode === "chart" ? "contained" : "outlined"} onClick={() => setViewMode("chart")}>
            <FaChartPie />
          </Button>
        </div>

        <Button className="add-new" onClick={handleAddNew}>Add New</Button>
      </div>

      {/* Expense Table */}
      <table className="expense-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Type</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td>{expense.title}</td>
                <td>${expense.amount}</td>
                <td>{expense.transactionType}</td>
                <td>{expense.category}</td>
                <td>
                    <button className="edit-btn" onClick={() => handleEdit(expense)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDelete(expense._id)}>Delete</button>

                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No expenses found</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Add Expense Modal */}
      <Dialog open={openModal} onClose={handleCloseModal}>
        <DialogTitle>Add Transaction Details</DialogTitle>
        <DialogContent>
          <TextField label="Title" name="title" fullWidth onChange={handleInputChange} margin="dense" />
          <TextField label="Amount" name="amount" fullWidth onChange={handleInputChange} margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Category</InputLabel>
            <Select name="category" onChange={handleInputChange}>
              <MenuItem value="education">Education</MenuItem>
              <MenuItem value="furniture">Furniture</MenuItem>
              <MenuItem value="personal">Personal</MenuItem>
              <MenuItem value="entertainment">Entertainment</MenuItem>
              <MenuItem value="transportation">Transportation</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Description" name="description" fullWidth onChange={handleInputChange} margin="dense" />
          <FormControl fullWidth margin="dense">
            <InputLabel>Transaction Type</InputLabel>
            <Select name="transactionType" onChange={handleInputChange}>
              <MenuItem value="income">Income</MenuItem>
              <MenuItem value="expense">Expense</MenuItem>
            </Select>
          </FormControl>
          <TextField label="Date" name="date" type="date" fullWidth onChange={handleInputChange} margin="dense" InputLabelProps={{ shrink: true }} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Close</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">Submit</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Dashboard;




