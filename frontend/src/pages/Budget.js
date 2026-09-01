
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December"
];

function Budget() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const now = new Date();
    const currentMonth = now.getMonth() + 1;
    const currentYear = now.getFullYear();

    const [budgets, setBudgets] = useState([]);
    const [progress, setProgress] = useState([]);
    const [search, setSearch] = useState("");
    const [month, setMonth] = useState(currentMonth);
    const [year, setYear] = useState(currentYear);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const emptyForm = {
        category: "",
        amount: "",
        month: currentMonth,
        year: currentYear
    };

    const [form, setForm] = useState(emptyForm);

    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
            return;
        }
        load();
    }, [userId, navigate]);

    useEffect(() => {
        if (userId) loadProgress();
    }, [month, year, userId]);

    const load = async () => {
        setLoading(true);
        try {
            const response =
                await api.get(`/budget/user/${userId}`);
            setBudgets(response.data || []);
            await loadProgress();
        } catch (error) {
            Swal.fire("Error", "Unable to load budgets.", "error");
        } finally {
            setLoading(false);
        }
    };

    const loadProgress = async () => {
        try {
            const response =
                await api.get(
                    `/budget/progress/${userId}?month=${month}&year=${year}`
                );
            setProgress(response.data || []);
        } catch (error) {
            console.error(error);
            setProgress([]);
        }
    };

    const formatMoney = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const resetForm = () => {
        setForm(emptyForm);
        setEditingId(null);
    };

    const saveBudget = async () => {
        const category = form.category.trim();
        const amount = Number(form.amount);

        if (
            !category ||
            !Number.isFinite(amount) ||
            amount <= 0 ||
            form.month < 1 ||
            form.month > 12 ||
            form.year < 2000
        ) {
            Swal.fire(
                "Invalid details",
                "Enter a category, positive amount, valid month and year.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            const payload = {
                category,
                amount,
                month: Number(form.month),
                year: Number(form.year)
            };

            if (editingId) {
                await api.put(`/budget/${editingId}`, payload);
            } else {
                await api.post(`/budget/${userId}`, payload);
            }

            Swal.fire({
                icon: "success",
                title: editingId ? "Budget Updated" : "Budget Added",
                timer: 1100,
                showConfirmButton: false
            });

            resetForm();
            await load();
        } catch (error) {
            Swal.fire(
                "Save Failed",
                error.response?.data?.message ||
                "Unable to save budget.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const editBudget = (b) => {
        setEditingId(b.budgetId);
        setForm({
            category: b.category || "",
            amount: b.amount ?? "",
            month: Number(b.month),
            year: Number(b.year)
        });
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const deleteBudget = async (id) => {
        const result = await Swal.fire({
            title: "Delete Budget?",
            text: "This budget will be permanently removed.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, Delete",
            confirmButtonColor: "#dc2626"
        });

        if (!result.isConfirmed) return;

        try {
            await api.delete(`/budget/${id}`);
            if (editingId === id) resetForm();
            await load();
        } catch (error) {
            Swal.fire("Delete Failed", "Unable to delete budget.", "error");
        }
    };

    const filteredBudgets = useMemo(() => {
        const q = search.toLowerCase().trim();
        return budgets.filter((b) =>
            !q || (b.category || "").toLowerCase().includes(q)
        );
    }, [budgets, search]);

    const selectedBudgetTotal =
        progress.reduce(
            (sum, item) => sum + Number(item.budgetAmount || 0),
            0
        );

    const selectedSpentTotal =
        progress.reduce(
            (sum, item) => sum + Number(item.spentAmount || 0),
            0
        );

    const selectedRemaining =
        selectedBudgetTotal - selectedSpentTotal;

    const selectedUsage =
        selectedBudgetTotal === 0
            ? 0
            : selectedSpentTotal / selectedBudgetTotal * 100;

    if (loading) {
        return (
            <div className="container">
                <h1>💰 Budget Planning</h1>
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>💰 Budget Planning</h1>
            <p className="subtitle">
                Plan spending, monitor actual expenses and detect overspending.
            </p>

            <div className="stats">
                <div className="card">
                    <h3>Budget</h3>
                    <p>₹ {formatMoney(selectedBudgetTotal)}</p>
                </div>
                <div className="card">
                    <h3>Spent</h3>
                    <p>₹ {formatMoney(selectedSpentTotal)}</p>
                </div>
                <div className="card">
                    <h3>Remaining</h3>
                    <p>₹ {formatMoney(selectedRemaining)}</p>
                </div>
                <div className="card">
                    <h3>Usage</h3>
                    <p>{selectedUsage.toFixed(1)}%</p>
                </div>
            </div>

            <div className="toolbar">
                <input
                    placeholder="🔍 Search category"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />

                <select
                    value={month}
                    onChange={(e) => setMonth(Number(e.target.value))}
                >
                    {months.map((m, i) => (
                        <option value={i + 1} key={m}>{m}</option>
                    ))}
                </select>

                <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                />
            </div>

            <div className="card light-card">
                <h2>{editingId ? "✏️ Edit Budget" : "➕ Add Budget"}</h2>

                <input
                    placeholder="Category e.g. Food"
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                />

                <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="Budget Amount"
                    value={form.amount}
                    onChange={(e) =>
                        setForm({ ...form, amount: e.target.value })
                    }
                />

                <select
                    value={form.month}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            month: Number(e.target.value)
                        })
                    }
                >
                    {months.map((m, i) => (
                        <option value={i + 1} key={m}>{m}</option>
                    ))}
                </select>

                <input
                    type="number"
                    min="2000"
                    max="2100"
                    value={form.year}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            year: Number(e.target.value)
                        })
                    }
                />

                <button disabled={saving} onClick={saveBudget}>
                    {saving
                        ? "⏳ Saving..."
                        : editingId
                            ? "💾 Update Budget"
                            : "➕ Add Budget"}
                </button>

                {editingId && (
                    <button onClick={resetForm}>
                        ❌ Cancel
                    </button>
                )}
            </div>

            <h2>
                📊 {months[month - 1]} {year} Budget Progress
            </h2>

            {progress.length === 0 ? (
                <div className="empty-state">
                    No budgets found for this period.
                </div>
            ) : (
                <div className="progress-list">
                    {progress.map((item) => (
                        <div className="progress-card" key={item.budgetId}>
                            <div className="progress-header">
                                <strong>{item.category}</strong>
                                <span className={`status ${item.status}`}>
                                    {item.status === "OVER_BUDGET"
                                        ? "🔴 Over Budget"
                                        : item.status === "WARNING"
                                            ? "🟡 Near Limit"
                                            : "🟢 On Track"}
                                </span>
                            </div>

                            <p>
                                Budget: ₹ {formatMoney(item.budgetAmount)}
                                {" | "}
                                Spent: ₹ {formatMoney(item.spentAmount)}
                                {" | "}
                                Remaining: ₹ {formatMoney(item.remainingAmount)}
                            </p>

                            <div className="progress-track">
                                <div
                                    className="progress-bar"
                                    style={{
                                        width: `${Math.min(
                                            Number(item.percentageUsed || 0),
                                            100
                                        )}%`
                                    }}
                                />
                            </div>

                            <small>
                                {Number(item.percentageUsed || 0).toFixed(1)}% used
                            </small>
                        </div>
                    ))}
                </div>
            )}

            <h2>📋 All Budgets</h2>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Month</th>
                            <th>Year</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBudgets.map((b) => (
                            <tr key={b.budgetId}>
                                <td>{b.category}</td>
                                <td>₹ {formatMoney(b.amount)}</td>
                                <td>{months[Number(b.month) - 1]}</td>
                                <td>{b.year}</td>
                                <td>
                                    <button onClick={() => editBudget(b)}>
                                        ✏ Edit
                                    </button>
                                    <button onClick={() => deleteBudget(b.budgetId)}>
                                        🗑 Delete
                                    </button>
                                </td>
                            </tr>
                        ))}

                        {filteredBudgets.length === 0 && (
                            <tr>
                                <td colSpan="5">No budgets found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <hr />

            <button onClick={() => navigate("/expense")}>💸 Expenses</button>
            <button onClick={() => navigate("/income")}>💵 Income</button>
            <button onClick={() => navigate("/reports")}>📄 Reports</button>
            <button onClick={() => navigate("/advice")}>🤖 AI Advice</button>
            <button onClick={() => navigate("/profile")}>👤 Profile</button>
            <button onClick={() => navigate("/dashboard")}>🏠 Dashboard</button>
        </div>
    );
}

export default Budget;
