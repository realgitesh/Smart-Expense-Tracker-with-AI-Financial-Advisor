import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Expense() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [expenses, setExpenses] = useState([]);
    const [search, setSearch] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isReportActive, setIsReportActive] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [expense, setExpense] = useState({
        title: "",
        amount: "",
        category: "",
        description: "",
        expenseDate: ""
    });

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
            return;
        }

        loadExpenses();
    }, [userId, navigate]);

    // ==========================================
    // LOAD ALL EXPENSES
    // ==========================================

    const loadExpenses = async () => {
        if (!userId) return;

        setLoading(true);

        try {
            const response = await api.get(
                "/expenses/user/" + userId
            );

            setExpenses(response.data || []);
            setIsReportActive(false);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load expenses."
            });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // DATE-WISE REPORT
    // ==========================================

    const loadReport = async () => {
        if (!fromDate || !toDate) {
            Swal.fire({
                icon: "warning",
                title: "Select Dates",
                text: "Please select both From and To dates."
            });
            return;
        }

        if (fromDate > toDate) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Dates",
                text: "From date cannot be after To date."
            });
            return;
        }

        setLoading(true);

        try {
            const response = await api.get(
                `/expenses/report/${userId}?startDate=${fromDate}&endDate=${toDate}`
            );

            setExpenses(response.data || []);
            setIsReportActive(true);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Report Error",
                text: "Unable to generate expense report."
            });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // RESET REPORT
    // ==========================================

    const clearReport = async () => {
        setFromDate("");
        setToDate("");
        setIsReportActive(false);

        await loadExpenses();
    };

    // ==========================================
    // CLEAR FORM
    // ==========================================

    const clearForm = () => {
        setExpense({
            title: "",
            amount: "",
            category: "",
            description: "",
            expenseDate: ""
        });

        setEditingId(null);
        setIsEditing(false);
    };

    // ==========================================
    // VALIDATE EXPENSE
    // ==========================================

    const validateExpense = () => {
        if (expense.title.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Title",
                text: "Please enter an expense title."
            });

            return false;
        }

        if (
            expense.amount === "" ||
            !Number.isFinite(Number(expense.amount)) ||
            Number(expense.amount) <= 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: "Amount must be greater than 0."
            });

            return false;
        }

        if (expense.category.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Category",
                text: "Please enter an expense category."
            });

            return false;
        }

        if (expense.expenseDate === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Date",
                text: "Please select an expense date."
            });

            return false;
        }

        return true;
    };

    // ==========================================
    // ADD EXPENSE
    // ==========================================

    const addExpense = async () => {
        if (!validateExpense()) return;

        setSaving(true);

        try {
            await api.post(
                "/expenses/" + userId,
                {
                    title: expense.title.trim(),
                    amount: Number(expense.amount),
                    category: expense.category.trim(),
                    description: expense.description.trim(),
                    expenseDate: expense.expenseDate
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Expense Added",
                text: "Expense added successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            clearForm();
            await loadExpenses();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Unable to Add Expense",
                text:
                    error?.response?.data?.message ||
                    "Please check the backend."
            });
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // START EDIT
    // ==========================================

    const startEdit = (selectedExpense) => {
        setExpense({
            title: selectedExpense.title || "",
            amount: selectedExpense.amount ?? "",
            category: selectedExpense.category || "",
            description: selectedExpense.description || "",
            expenseDate: selectedExpense.expenseDate || ""
        });

        setEditingId(selectedExpense.expenseId);
        setIsEditing(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // UPDATE EXPENSE
    // ==========================================

    const updateExpense = async () => {
        if (!validateExpense()) return;

        if (!editingId) {
            Swal.fire({
                icon: "error",
                title: "Update Error",
                text: "No expense selected for editing."
            });

            return;
        }

        setSaving(true);

        try {
            await api.put(
                "/expenses/" + userId + "/" + editingId,
                {
                    title: expense.title.trim(),
                    amount: Number(expense.amount),
                    category: expense.category.trim(),
                    description: expense.description.trim(),
                    expenseDate: expense.expenseDate
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Expense Updated",
                text: "Expense updated successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            clearForm();
            await loadExpenses();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error?.response?.data?.message ||
                    "Unable to update expense."
            });
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // DELETE EXPENSE
    // ==========================================

    const deleteExpense = async (id) => {
        const result = await Swal.fire({
            title: "Delete Expense?",
            text: "Are you sure you want to delete this expense?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#d33",
            cancelButtonColor: "#2563eb"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(
                "/expenses/" + userId + "/" + id
            );

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Expense deleted successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            if (editingId === id) {
                clearForm();
            }

            await loadExpenses();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error?.response?.data?.message ||
                    "Unable to delete expense."
            });
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredExpenses = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (keyword === "") {
            return expenses;
        }

        return expenses.filter((item) =>
            (
                item.title ||
                ""
            )
                .toLowerCase()
                .includes(keyword) ||

            (
                item.category ||
                ""
            )
                .toLowerCase()
                .includes(keyword) ||

            (
                item.description ||
                ""
            )
                .toLowerCase()
                .includes(keyword)
        );
    }, [expenses, search]);

    // ==========================================
    // TOTAL EXPENSE
    // ==========================================

    const totalExpense = useMemo(() => {
        return filteredExpenses.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );
    }, [filteredExpenses]);

    // ==========================================
    // FORMAT MONEY
    // ==========================================

    const formatMoney = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="container">
                <h1>💸 Expense Management</h1>

                <p className="subtitle">
                    Loading your expense data...
                </p>

                <div
                    className="card"
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    <h3>⏳ Loading Expenses...</h3>
                </div>
            </div>
        );
    }

    // ==========================================
    // MAIN UI
    // ==========================================

    return (
        <div className="container wide">

            {/* HEADER */}
            <div className="topbar">
                <div>
                    <h1>💸 Expense Management</h1>

                    <p className="subtitle">
                        Track, manage and analyse your expenses.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/dashboard")}
                >
                    ⬅ Dashboard
                </button>
            </div>

            <hr />

            {/* SEARCH + DATE REPORT */}
            <div className="light-card card">

                <h2>🔍 Find Expenses</h2>

                <div className="toolbar">

                    <input
                        type="text"
                        placeholder="Search by title, category or description..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                    />

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(event) =>
                            setFromDate(event.target.value)
                        }
                    />

                    <input
                        type="date"
                        value={toDate}
                        onChange={(event) =>
                            setToDate(event.target.value)
                        }
                    />

                    <button onClick={loadReport}>
                        📊 Generate Report
                    </button>

                    <button
                        onClick={clearReport}
                        style={{
                            background: "#f8fafc",
                            color: "#475467",
                            border: "1px solid #dfe4ec",
                            boxShadow: "none"
                        }}
                    >
                        🔄 Reset
                    </button>

                </div>

                {isReportActive && (
                    <p>
                        <strong>
                            Report: {fromDate} → {toDate}
                        </strong>
                    </p>
                )}

            </div>

            {/* FORM */}
            <div className="light-card card">

                <h2>
                    {isEditing
                        ? "✏️ Edit Expense"
                        : "➕ Add Expense"}
                </h2>

                <div className="toolbar">

                    <input
                        type="text"
                        placeholder="Expense Title"
                        value={expense.title}
                        onChange={(event) =>
                            setExpense({
                                ...expense,
                                title: event.target.value
                            })
                        }
                    />

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        value={expense.amount}
                        onChange={(event) =>
                            setExpense({
                                ...expense,
                                amount: event.target.value
                            })
                        }
                    />

                    <input
                        type="text"
                        placeholder="Category e.g. Food, Travel"
                        value={expense.category}
                        onChange={(event) =>
                            setExpense({
                                ...expense,
                                category: event.target.value
                            })
                        }
                    />

                    <input
                        type="date"
                        value={expense.expenseDate}
                        onChange={(event) =>
                            setExpense({
                                ...expense,
                                expenseDate: event.target.value
                            })
                        }
                    />

                </div>

                <textarea
                    placeholder="Description (optional)"
                    value={expense.description}
                    onChange={(event) =>
                        setExpense({
                            ...expense,
                            description: event.target.value
                        })
                    }
                />

                <div className="action-grid">

                    {isEditing ? (
                        <>
                            <button
                                onClick={updateExpense}
                                disabled={saving}
                            >
                                {saving
                                    ? "⏳ Updating..."
                                    : "💾 Update Expense"}
                            </button>

                            <button
                                onClick={clearForm}
                                disabled={saving}
                                style={{
                                    background: "#f8fafc",
                                    color: "#475467",
                                    border: "1px solid #dfe4ec",
                                    boxShadow: "none"
                                }}
                            >
                                ❌ Cancel
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={addExpense}
                            disabled={saving}
                        >
                            {saving
                                ? "⏳ Adding..."
                                : "➕ Add Expense"}
                        </button>
                    )}

                </div>

            </div>

            {/* SUMMARY */}
            <div className="stats">

                <div className="card">
                    <h3>Expense Entries</h3>
                    <p>{filteredExpenses.length}</p>
                </div>

                <div className="card">
                    <h3>Total Displayed Expense</h3>
                    <p>₹ {formatMoney(totalExpense)}</p>
                </div>

                <div className="card">
                    <h3>Average Expense</h3>
                    <p>
                        ₹{" "}
                        {formatMoney(
                            filteredExpenses.length
                                ? totalExpense /
                                  filteredExpenses.length
                                : 0
                        )}
                    </p>
                </div>

            </div>

            {/* TABLE */}
            <div className="light-card card">

                <div className="topbar">
                    <div>
                        <h2>
                            📋 Expense List
                        </h2>

                        <p>
                            {isReportActive
                                ? `Showing expenses from ${fromDate} to ${toDate}`
                                : "Showing all your expenses"}
                        </p>
                    </div>
                </div>

                <div className="table-wrap">

                    <table>

                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount</th>
                                <th>Category</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredExpenses.length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="6"
                                        style={{
                                            textAlign: "center",
                                            padding: "30px"
                                        }}
                                    >
                                        No Expense Found
                                    </td>
                                </tr>

                            ) : (

                                filteredExpenses.map((item) => (

                                    <tr key={item.expenseId}>

                                        <td>
                                            <strong>
                                                {item.title}
                                            </strong>
                                        </td>

                                        <td>
                                            <strong>
                                                ₹{" "}
                                                {formatMoney(
                                                    item.amount
                                                )}
                                            </strong>
                                        </td>

                                        <td>
                                            {item.category}
                                        </td>

                                        <td>
                                            {item.description || "-"}
                                        </td>

                                        <td>
                                            {item.expenseDate}
                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    startEdit(item)
                                                }
                                            >
                                                ✏ Edit
                                            </button>

                                            <button
                                                onClick={() =>
                                                    deleteExpense(
                                                        item.expenseId
                                                    )
                                                }
                                                style={{
                                                    background:
                                                        "#fff1f2",
                                                    color:
                                                        "#be123c",
                                                    border:
                                                        "1px solid #fecdd3",
                                                    boxShadow:
                                                        "none"
                                                }}
                                            >
                                                🗑 Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* NAVIGATION */}
            <div className="nav-grid">

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    🏠 Dashboard
                </button>

                <button
                    onClick={() =>
                        navigate("/income")
                    }
                >
                    💵 Income
                </button>

                <button
                    onClick={() =>
                        navigate("/budget")
                    }
                >
                    💰 Budget
                </button>

                <button
                    onClick={() =>
                        navigate("/advice")
                    }
                >
                    🤖 AI Advice
                </button>

            </div>

        </div>
    );
}

export default Expense;