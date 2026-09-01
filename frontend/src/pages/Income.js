import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Income() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    // ==========================================
    // STATE
    // ==========================================

    const [incomes, setIncomes] = useState([]);
    const [search, setSearch] = useState("");

    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [isReportActive, setIsReportActive] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [income, setIncome] = useState({
        source: "",
        amount: "",
        incomeDate: ""
    });

    // ==========================================
    // ANALYTICS
    // ==========================================

    const [monthlyIncome, setMonthlyIncome] = useState(0);

    const [selectedMonth, setSelectedMonth] =
        useState(new Date().getMonth() + 1);

    const [yearlyIncome, setYearlyIncome] =
        useState({});

    // ==========================================
    // MONTH NAMES
    // ==========================================

    const monthNames = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    // ==========================================
    // INITIAL LOAD
    // ==========================================

    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
            return;
        }

        loadAllIncomeData();
    }, [userId, navigate]);

    // ==========================================
    // LOAD ALL DATA
    // ==========================================

    const loadAllIncomeData = async () => {
        if (!userId) return;

        setLoading(true);

        try {
            await Promise.all([
                loadIncome(),
                loadYearlyIncome(),
                loadMonthlyIncome(selectedMonth)
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // LOAD INCOME
    // ==========================================

    const loadIncome = async () => {
        if (!userId) return;

        try {
            const response = await api.get(
                "/income/user/" + userId
            );

            setIncomes(response.data || []);
            setIsReportActive(false);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Error",
                text: "Unable to load income."
            });
        }
    };

    // ==========================================
    // LOAD MONTHLY INCOME
    // ==========================================

    const loadMonthlyIncome = async (month) => {
        if (!userId) return;

        try {
            const response = await api.get(
                `/income/monthly/${userId}?month=${month}`
            );

            setMonthlyIncome(
                Number(response.data || 0)
            );
        } catch (error) {
            console.error(error);
            setMonthlyIncome(0);
        }
    };

    // ==========================================
    // LOAD YEARLY INCOME
    // ==========================================

    const loadYearlyIncome = async () => {
        if (!userId) return;

        try {
            const response = await api.get(
                "/income/yearly/" + userId
            );

            const yearlyData = {};

            (response.data || []).forEach((row) => {
                if (
                    Array.isArray(row) &&
                    row.length >= 2
                ) {
                    yearlyData[
                        Number(row[0])
                    ] = Number(row[1] || 0);
                }
            });

            setYearlyIncome(yearlyData);
        } catch (error) {
            console.error(error);
            setYearlyIncome({});
        }
    };

    // ==========================================
    // DATE REPORT
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
                `/income/report/${userId}?startDate=${fromDate}&endDate=${toDate}`
            );

            setIncomes(response.data || []);
            setIsReportActive(true);
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Report Error",
                text: "Unable to generate income report."
            });
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // CLEAR REPORT
    // ==========================================

    const clearReport = async () => {
        setFromDate("");
        setToDate("");
        setIsReportActive(false);

        setLoading(true);

        try {
            await loadIncome();
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // CLEAR FORM
    // ==========================================

    const clearForm = () => {
        setIncome({
            source: "",
            amount: "",
            incomeDate: ""
        });

        setEditingId(null);
        setIsEditing(false);
    };

    // ==========================================
    // VALIDATE INCOME
    // ==========================================

    const validateIncome = () => {
        if (income.source.trim() === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Source",
                text: "Please enter an income source."
            });

            return false;
        }

        if (
            income.amount === "" ||
            !Number.isFinite(Number(income.amount)) ||
            Number(income.amount) <= 0
        ) {
            Swal.fire({
                icon: "warning",
                title: "Invalid Amount",
                text: "Amount must be greater than 0."
            });

            return false;
        }

        if (income.incomeDate === "") {
            Swal.fire({
                icon: "warning",
                title: "Missing Date",
                text: "Please select an income date."
            });

            return false;
        }

        return true;
    };

    // ==========================================
    // ADD INCOME
    // ==========================================

    const addIncome = async () => {
        if (!validateIncome()) return;

        setSaving(true);

        try {
            await api.post(
                "/income/" + userId,
                {
                    source: income.source.trim(),
                    amount: Number(income.amount),
                    incomeDate: income.incomeDate
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Income Added",
                text: "Income added successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            clearForm();
            await loadAllIncomeData();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Add Failed",
                text:
                    error?.response?.data?.message ||
                    "Unable to add income."
            });
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // START EDIT
    // ==========================================

    const startEdit = (selectedIncome) => {
        setIncome({
            source: selectedIncome.source || "",
            amount: selectedIncome.amount ?? "",
            incomeDate:
                selectedIncome.incomeDate || ""
        });

        setEditingId(
            selectedIncome.incomeId
        );

        setIsEditing(true);

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // ==========================================
    // UPDATE INCOME
    // ==========================================

    const updateIncome = async () => {
        if (!validateIncome()) return;

        if (!editingId) {
            Swal.fire({
                icon: "error",
                title: "Update Error",
                text: "No income selected for editing."
            });

            return;
        }

        setSaving(true);

        try {
            await api.put(
                "/income/" + userId + "/" + editingId,
                {
                    source: income.source.trim(),
                    amount: Number(income.amount),
                    incomeDate: income.incomeDate
                }
            );

            await Swal.fire({
                icon: "success",
                title: "Income Updated",
                text: "Income updated successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            clearForm();
            await loadAllIncomeData();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Update Failed",
                text:
                    error?.response?.data?.message ||
                    "Unable to update income."
            });
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // DELETE INCOME
    // ==========================================

    const deleteIncome = async (id) => {
        const result = await Swal.fire({
            title: "Delete Income?",
            text: "Are you sure you want to delete this income?",
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
                "/income/" + userId + "/" + id
            );

            await Swal.fire({
                icon: "success",
                title: "Deleted",
                text: "Income deleted successfully.",
                timer: 1200,
                showConfirmButton: false
            });

            if (editingId === id) {
                clearForm();
            }

            await loadAllIncomeData();
        } catch (error) {
            console.error(error);

            Swal.fire({
                icon: "error",
                title: "Delete Failed",
                text:
                    error?.response?.data?.message ||
                    "Unable to delete income."
            });
        }
    };

    // ==========================================
    // SEARCH
    // ==========================================

    const filteredIncome = useMemo(() => {
        const keyword =
            search.trim().toLowerCase();

        if (keyword === "") {
            return incomes;
        }

        return incomes.filter((item) =>
            (item.source || "")
                .toLowerCase()
                .includes(keyword)
        );
    }, [incomes, search]);

    // ==========================================
    // TOTAL INCOME
    // ==========================================

    const totalDisplayedIncome = useMemo(() => {
        return filteredIncome.reduce(
            (total, item) =>
                total + Number(item.amount || 0),
            0
        );
    }, [filteredIncome]);

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
    // REPORT TEXT
    // ==========================================

    const reportText = isReportActive
        ? `Report: ${fromDate} → ${toDate}`
        : "All Income";

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <div className="container">
                <h1>💵 Income Management</h1>

                <p className="subtitle">
                    Loading your income data...
                </p>

                <div
                    className="card"
                    style={{
                        textAlign: "center",
                        marginTop: "20px"
                    }}
                >
                    <h3>⏳ Loading Income...</h3>
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
                    <h1>💵 Income Management</h1>

                    <p className="subtitle">
                        Track, manage and analyse your income.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/dashboard")
                    }
                >
                    ⬅ Dashboard
                </button>

            </div>

            <hr />

            {/* SEARCH + REPORT */}

            <div className="light-card card">

                <h2>🔍 Find Income</h2>

                <div className="toolbar">

                    <input
                        type="text"
                        placeholder="Search income source..."
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                    />

                    <input
                        type="date"
                        value={fromDate}
                        onChange={(event) =>
                            setFromDate(
                                event.target.value
                            )
                        }
                    />

                    <input
                        type="date"
                        value={toDate}
                        onChange={(event) =>
                            setToDate(
                                event.target.value
                            )
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
                        🔄 Show All
                    </button>

                </div>

                {isReportActive && (
                    <p>
                        <strong>
                            {reportText}
                        </strong>
                    </p>
                )}

            </div>

            {/* ADD / EDIT FORM */}

            <div className="light-card card">

                <h2>
                    {isEditing
                        ? "✏️ Edit Income"
                        : "➕ Add Income"}
                </h2>

                <div className="toolbar">

                    <input
                        type="text"
                        placeholder="Income Source"
                        value={income.source}
                        onChange={(event) =>
                            setIncome({
                                ...income,
                                source:
                                    event.target.value
                            })
                        }
                    />

                    <input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="Amount"
                        value={income.amount}
                        onChange={(event) =>
                            setIncome({
                                ...income,
                                amount:
                                    event.target.value
                            })
                        }
                    />

                    <input
                        type="date"
                        value={income.incomeDate}
                        onChange={(event) =>
                            setIncome({
                                ...income,
                                incomeDate:
                                    event.target.value
                            })
                        }
                    />

                </div>

                <div className="action-grid">

                    {isEditing ? (
                        <>
                            <button
                                onClick={updateIncome}
                                disabled={saving}
                            >
                                {saving
                                    ? "⏳ Updating..."
                                    : "💾 Update Income"}
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
                            onClick={addIncome}
                            disabled={saving}
                        >
                            {saving
                                ? "⏳ Adding..."
                                : "➕ Add Income"}
                        </button>
                    )}

                </div>

            </div>

            {/* SUMMARY */}

            <div className="stats">

                <div className="card">
                    <h3>Income Entries</h3>
                    <p>{filteredIncome.length}</p>
                </div>

                <div className="card">
                    <h3>Total Displayed Income</h3>
                    <p>
                        ₹ {formatMoney(
                            totalDisplayedIncome
                        )}
                    </p>
                </div>

                <div className="card">
                    <h3>Average Income</h3>
                    <p>
                        ₹{" "}
                        {formatMoney(
                            filteredIncome.length
                                ? totalDisplayedIncome /
                                  filteredIncome.length
                                : 0
                        )}
                    </p>
                </div>

            </div>

            {/* MONTHLY ANALYTICS */}

            <div className="light-card card">

                <h2>
                    📊 Monthly Income Analytics
                </h2>

                <div className="toolbar">

                    <select
                        value={selectedMonth}
                        onChange={async (event) => {

                            const month =
                                Number(
                                    event.target.value
                                );

                            setSelectedMonth(month);

                            await loadMonthlyIncome(
                                month
                            );
                        }}
                    >

                        {monthNames.map(
                            (month, index) => (
                                <option
                                    key={month}
                                    value={index + 1}
                                >
                                    {month}
                                </option>
                            )
                        )}

                    </select>

                </div>

                <div
                    className="card"
                    style={{
                        marginTop: "15px",
                        textAlign: "center"
                    }}
                >

                    <h3>
                        {monthNames[
                            selectedMonth - 1
                        ]} Income
                    </h3>

                    <p>
                        ₹{" "}
                        {formatMoney(
                            monthlyIncome
                        )}
                    </p>

                </div>

            </div>

            {/* YEARLY ANALYTICS */}

            <div className="light-card card">

                <h2>
                    📅 Yearly Income Analytics
                </h2>

                <div className="table-wrap">

                    <table>

                        <thead>
                            <tr>
                                <th>Year</th>
                                <th>Total Income</th>
                            </tr>
                        </thead>

                        <tbody>

                            {Object.keys(
                                yearlyIncome
                            ).length === 0 ? (

                                <tr>
                                    <td
                                        colSpan="2"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "25px"
                                        }}
                                    >
                                        No Yearly Income Data
                                    </td>
                                </tr>

                            ) : (

                                Object.entries(
                                    yearlyIncome
                                ).map(
                                    ([year, amount]) => (

                                        <tr key={year}>

                                            <td>
                                                <strong>
                                                    {year}
                                                </strong>
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {formatMoney(
                                                    amount
                                                )}
                                            </td>

                                        </tr>
                                    )
                                )
                            )}

                        </tbody>

                    </table>

                </div>

            </div>

            {/* INCOME LIST */}

            <div className="light-card card">

                <div className="topbar">

                    <div>

                        <h2>
                            📋 {reportText}
                        </h2>

                        <p>
                            {filteredIncome.length} income
                            {filteredIncome.length === 1
                                ? ""
                                : "s"} displayed.
                        </p>

                    </div>

                </div>

                <div className="table-wrap">

                    <table>

                        <thead>

                            <tr>
                                <th>Source</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredIncome.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="4"
                                        style={{
                                            textAlign:
                                                "center",
                                            padding:
                                                "30px"
                                        }}
                                    >
                                        No Income Found
                                    </td>

                                </tr>

                            ) : (

                                filteredIncome.map(
                                    (item) => (

                                        <tr
                                            key={
                                                item.incomeId
                                            }
                                        >

                                            <td>
                                                <strong>
                                                    {
                                                        item.source
                                                    }
                                                </strong>
                                            </td>

                                            <td>
                                                ₹{" "}
                                                {formatMoney(
                                                    item.amount
                                                )}
                                            </td>

                                            <td>
                                                {
                                                    item.incomeDate
                                                }
                                            </td>

                                            <td>

                                                <button
                                                    onClick={() =>
                                                        startEdit(
                                                            item
                                                        )
                                                    }
                                                >
                                                    ✏ Edit
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        deleteIncome(
                                                            item.incomeId
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
                                    )
                                )
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
                        navigate("/expense")
                    }
                >
                    💸 Expenses
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

export default Income;