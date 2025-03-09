import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaList } from "react-icons/fa";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import axios from "axios";
import "../styles/dashboard.css"; // Reuse styles

const ChartsPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);

  // Fetch Data
  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/expenses");
      console.log("Fetched Transactions:", res.data); // Debugging log
      setTransactions(res.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Logging transactions
  useEffect(() => {
    console.log("Updated Transactions:", transactions);
  }, [transactions]);

  // Process transactions for charts
  const incomeTransactions = transactions.filter(txn => txn.type === "income");
  const expenseTransactions = transactions.filter(txn => txn.type === "expense");

  const totalTransactions = transactions.length;
  const totalTurnover = transactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalIncome = incomeTransactions.reduce((sum, txn) => sum + txn.amount, 0);
  const totalExpense = expenseTransactions.reduce((sum, txn) => sum + txn.amount, 0);

  // Category-wise calculations
  const categorywiseExpense = expenseTransactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  const categorywiseIncome = incomeTransactions.reduce((acc, txn) => {
    acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
    return acc;
  }, {});

  // Convert to chart format
  const expenseChartData = Object.keys(categorywiseExpense).map((key, index) => ({
    id: index,
    name: key,
    value: categorywiseExpense[key],
  }));

  const incomeChartData = Object.keys(categorywiseIncome).map((key, index) => ({
    id: index,
    name: key,
    value: categorywiseIncome[key],
  }));

  console.log("Expense Chart Data:", expenseChartData);
  console.log("Income Chart Data:", incomeChartData);

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <h2 className="dashboard-title">Expense Tracker Charts</h2>
        <Button className="logout-button" onClick={() => navigate("/dashboard")}>
          <FaList /> Dashboard
        </Button>
      </header>

      {/* Charts */}
      {transactions.length === 0 ? (
        <h3>No transactions available</h3>
      ) : (
        <div className="charts-grid">
          {/* Total Transactions */}
          <div className="chart-card">
            <h3>Total Transactions: {totalTransactions}</h3>
            <PieChart width={200} height={200}>
              <Pie data={[{ name: "Income", value: totalIncome }, { name: "Expense", value: totalExpense }]} 
                   dataKey="value" 
                   cx="50%" 
                   cy="50%" 
                   outerRadius={60} 
                   fill="#8884d8">
                <Cell fill="green" />
                <Cell fill="red" />
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Total Turnover */}
          <div className="chart-card">
            <h3>Total Turnover: ₹{totalTurnover}</h3>
            <PieChart width={400} height={400}>
              <Pie data={expenseChartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
                {expenseChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? "red" : "blue"} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* Categorywise Income */}
          <div className="chart-card">
            <h3>Categorywise Income</h3>
            <BarChart width={500} height={300} data={incomeChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="green" />
            </BarChart>
          </div>

          {/* Categorywise Expense */}
          <div className="chart-card">
            <h3>Categorywise Expense</h3>
            <BarChart width={500} height={300} data={expenseChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="red" />
            </BarChart>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartsPage;
