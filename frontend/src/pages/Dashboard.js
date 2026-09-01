import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
} from "chart.js";

import { Bar, Line } from "react-chartjs-2";
import api from "../services/api";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    Tooltip,
    Legend
);

function Dashboard() {
    const navigate = useNavigate();

    const userId = localStorage.getItem("userId");
    const fullName = localStorage.getItem("fullName") || "User";

    const [dashboard, setDashboard] = useState({
        totalIncome: 0,
        totalExpense: 0,
        balance: 0,
        totalIncomeTransactions: 0,
        totalExpenseTransactions: 0,
        currentMonthBudget: 0,
        currentMonthExpense: 0,
        currentMonthBudgetRemaining: 0,
        currentMonthBudgetUsagePercentage: 0
    });

    const [transactions, setTransactions] = useState([]);
    const [monthly, setMonthly] = useState({});
    const [yearly, setYearly] = useState({});
    const [budgetProgress, setBudgetProgress] = useState([]);

    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
            return;
        }

        load();
    }, [userId, navigate]);

    const load = async () => {
        setLoading(true);

        try {
            const [
                summary,
                recent,
                monthlyData,
                yearlyData,
                budgetData
            ] = await Promise.all([
                api.get(`/dashboard/${userId}`),
                api.get(`/dashboard/recent/${userId}`),
                api.get(`/dashboard/monthly/${userId}`),
                api.get(`/dashboard/yearly/${userId}`),
                api.get(`/dashboard/budget-progress/${userId}`)
            ]);

            setDashboard({
                totalIncome: Number(summary.data.totalIncome || 0),
                totalExpense: Number(summary.data.totalExpense || 0),
                balance: Number(summary.data.balance || 0),

                totalIncomeTransactions:
                    Number(summary.data.totalIncomeTransactions || 0),

                totalExpenseTransactions:
                    Number(summary.data.totalExpenseTransactions || 0),

                currentMonthBudget:
                    Number(summary.data.currentMonthBudget || 0),

                currentMonthExpense:
                    Number(summary.data.currentMonthExpense || 0),

                currentMonthBudgetRemaining:
                    Number(summary.data.currentMonthBudgetRemaining || 0),

                currentMonthBudgetUsagePercentage:
                    Number(
                        summary.data.currentMonthBudgetUsagePercentage || 0
                    )
            });

            setTransactions(recent.data || []);
            setMonthly(monthlyData.data || {});
            setYearly(yearlyData.data || {});
            setBudgetProgress(budgetData.data || []);

        } catch (error) {
            console.error(error);

            Swal.fire(
                "Dashboard Error",
                error.response?.data?.message ||
                "Unable to load dashboard.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    const refresh = async () => {
        setRefreshing(true);

        try {
            await load();
        } finally {
            setRefreshing(false);
        }
    };

    const logout = async () => {
        const result = await Swal.fire({
            title: "Logout?",
            text: "Are you sure you want to logout?",
            icon: "question",
            showCancelButton: true,
            confirmButtonText: "Yes, Logout"
        });

        if (!result.isConfirmed) return;

        localStorage.clear();

        navigate("/", {
            replace: true
        });
    };

    const money = (value) =>
        Number(value || 0).toLocaleString("en-IN", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });

    const status =
        dashboard.balance > 0
            ? "You are saving money"
            : dashboard.balance < 0
                ? "Expenses are higher than income"
                : "Income and expenses are equal";

    const statusIcon =
        dashboard.balance > 0
            ? "↗"
            : dashboard.balance < 0
                ? "↘"
                : "→";

    const expenseRatio =
        dashboard.totalIncome > 0
            ? Math.min(
                (dashboard.totalExpense / dashboard.totalIncome) * 100,
                100
            )
            : 0;

    const monthlyData = useMemo(
        () => ({
            labels: Object.keys(monthly),

            datasets: [
                {
                    label: "Monthly Expense",
                    data: Object.values(monthly).map(Number),
                    borderWidth: 2,
                    borderRadius: 8
                }
            ]
        }),
        [monthly]
    );

    const yearlyData = useMemo(
        () => ({
            labels: Object.keys(yearly),

            datasets: [
                {
                    label: "Yearly Expense",
                    data: Object.values(yearly).map(Number),
                    borderWidth: 3,
                    tension: 0.35,
                    pointRadius: 4
                }
            ]
        }),
        [yearly]
    );

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
            legend: {
                display: false
            }
        },

        scales: {
            x: {
                grid: {
                    display: false
                }
            },

            y: {
                beginAtZero: true,

                grid: {
                    color: "rgba(148, 163, 184, 0.12)"
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="container dashboard-page">
                <div className="dashboard-loading">
                    <div className="loading-icon">₹</div>

                    <h2>Loading your dashboard</h2>

                    <p>
                        Preparing your financial overview...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="container wide dashboard-page">

            {/* =====================================================
                DASHBOARD HEADER
            ===================================================== */}

            <div className="dashboard-hero">

                <div>
                    <div className="eyebrow">
                        PERSONAL FINANCE
                    </div>

                    <h1>
                        Good to see you, {fullName.split(" ")[0]} 👋
                    </h1>

                    <p className="dashboard-subtitle">
                        Here's your financial overview for today.
                    </p>
                </div>

                <button
                    className="dashboard-refresh-btn"
                    onClick={refresh}
                    disabled={refreshing}
                >
                    {refreshing
                        ? "⏳ Refreshing..."
                        : "↻ Refresh"}
                </button>

            </div>


            {/* =====================================================
                MAIN FINANCIAL CARDS
            ===================================================== */}

            <div className="dashboard-stats">

                <div className="finance-card income-card">

                    <div className="finance-card-top">
                        <span className="finance-icon">
                            ↗
                        </span>

                        <span className="finance-label">
                            TOTAL INCOME
                        </span>
                    </div>

                    <div className="finance-value">
                        ₹ {money(dashboard.totalIncome)}
                    </div>

                    <div className="finance-footer">
                        {dashboard.totalIncomeTransactions} income entries
                    </div>

                </div>


                <div className="finance-card expense-card">

                    <div className="finance-card-top">
                        <span className="finance-icon">
                            ↘
                        </span>

                        <span className="finance-label">
                            TOTAL EXPENSE
                        </span>
                    </div>

                    <div className="finance-value">
                        ₹ {money(dashboard.totalExpense)}
                    </div>

                    <div className="finance-footer">
                        {dashboard.totalExpenseTransactions} expense entries
                    </div>

                </div>


                <div className="finance-card balance-card">

                    <div className="finance-card-top">
                        <span className="finance-icon">
                            ₹
                        </span>

                        <span className="finance-label">
                            AVAILABLE BALANCE
                        </span>
                    </div>

                    <div className="finance-value">
                        ₹ {money(dashboard.balance)}
                    </div>

                    <div className="finance-footer">
                        After income and expenses
                    </div>

                </div>

            </div>


            {/* =====================================================
                FINANCIAL STATUS
            ===================================================== */}

            <div className="dashboard-two-column">

                <div className="dashboard-panel status-panel">

                    <div className="panel-heading">

                        <div>
                            <span className="panel-kicker">
                                FINANCIAL HEALTH
                            </span>

                            <h2>
                                Your financial status
                            </h2>
                        </div>

                        <div className="status-circle">
                            {statusIcon}
                        </div>

                    </div>

                    <div
                        className={
                            dashboard.balance >= 0
                                ? "health-status positive"
                                : "health-status negative"
                        }
                    >
                        <span className="health-dot" />

                        {status}
                    </div>

                    <p className="panel-description">
                        Your current available balance is{" "}
                        <strong>
                            ₹ {money(dashboard.balance)}
                        </strong>.
                    </p>

                    <div className="income-expense-bar">

                        <div className="bar-label-row">
                            <span>
                                Income
                            </span>

                            <strong>
                                ₹ {money(dashboard.totalIncome)}
                            </strong>
                        </div>

                        <div className="financial-progress">
                            <div
                                className="financial-progress-income"
                                style={{
                                    width: "100%"
                                }}
                            />
                        </div>


                        <div className="bar-label-row">
                            <span>
                                Expenses
                            </span>

                            <strong>
                                ₹ {money(dashboard.totalExpense)}
                            </strong>
                        </div>

                        <div className="financial-progress expense-progress">
                            <div
                                className="financial-progress-expense"
                                style={{
                                    width: `${expenseRatio}%`
                                }}
                            />
                        </div>

                    </div>

                </div>


                {/* =================================================
                    QUICK ACTIONS
                ================================================= */}

                <div className="dashboard-panel quick-actions-panel">

                    <div className="panel-heading">

                        <div>
                            <span className="panel-kicker">
                                QUICK ACTIONS
                            </span>

                            <h2>
                                Manage your money
                            </h2>
                        </div>

                    </div>


                    <div className="quick-action-grid">

                        <button
                            className="quick-action income-action"
                            onClick={() => navigate("/income")}
                        >
                            <span className="quick-action-icon">
                                +
                            </span>

                            <span>
                                <strong>
                                    Add Income
                                </strong>

                                <small>
                                    Record new income
                                </small>
                            </span>
                        </button>


                        <button
                            className="quick-action expense-action"
                            onClick={() => navigate("/expense")}
                        >
                            <span className="quick-action-icon">
                                −
                            </span>

                            <span>
                                <strong>
                                    Add Expense
                                </strong>

                                <small>
                                    Track spending
                                </small>
                            </span>
                        </button>


                        <button
                            className="quick-action budget-action"
                            onClick={() => navigate("/budget")}
                        >
                            <span className="quick-action-icon">
                                ₹
                            </span>

                            <span>
                                <strong>
                                    Manage Budget
                                </strong>

                                <small>
                                    Control your limits
                                </small>
                            </span>
                        </button>


                        <button
                            className="quick-action report-action"
                            onClick={() => navigate("/reports")}
                        >
                            <span className="quick-action-icon">
                                ≡
                            </span>

                            <span>
                                <strong>
                                    View Reports
                                </strong>

                                <small>
                                    Analyze finances
                                </small>
                            </span>
                        </button>

                    </div>

                </div>

            </div>


            {/* =====================================================
                CURRENT MONTH BUDGET
            ===================================================== */}

            <div className="dashboard-panel budget-panel">

                <div className="panel-heading budget-heading">

                    <div>
                        <span className="panel-kicker">
                            MONTHLY BUDGET
                        </span>

                        <h2>
                            Current month spending
                        </h2>
                    </div>

                    <button
                        className="small-outline-btn"
                        onClick={() => navigate("/budget")}
                    >
                        Manage Budget →
                    </button>

                </div>


                <div className="budget-summary-grid">

                    <div className="budget-stat">
                        <span>
                            Budget
                        </span>

                        <strong>
                            ₹ {money(dashboard.currentMonthBudget)}
                        </strong>
                    </div>


                    <div className="budget-stat">
                        <span>
                            Spent
                        </span>

                        <strong>
                            ₹ {money(dashboard.currentMonthExpense)}
                        </strong>
                    </div>


                    <div className="budget-stat">
                        <span>
                            Remaining
                        </span>

                        <strong
                            className={
                                dashboard.currentMonthBudgetRemaining < 0
                                    ? "danger-text"
                                    : "success-text"
                            }
                        >
                            ₹ {money(dashboard.currentMonthBudgetRemaining)}
                        </strong>
                    </div>


                    <div className="budget-stat">
                        <span>
                            Used
                        </span>

                        <strong>
                            {dashboard.currentMonthBudgetUsagePercentage.toFixed(1)}%
                        </strong>
                    </div>

                </div>


                <div className="overall-budget-progress">

                    <div className="budget-progress-header">

                        <span>
                            Overall budget usage
                        </span>

                        <strong>
                            {dashboard.currentMonthBudgetUsagePercentage.toFixed(1)}%
                        </strong>

                    </div>

                    <div className="progress-track large">

                        <div
                            className="progress-bar"
                            style={{
                                width: `${Math.min(
                                    dashboard.currentMonthBudgetUsagePercentage,
                                    100
                                )}%`
                            }}
                        />

                    </div>

                </div>


                {budgetProgress.length > 0 && (

                    <div className="category-budget-list">

                        {budgetProgress.map((item) => (

                            <div
                                className="category-budget-item"
                                key={item.budgetId}
                            >

                                <div className="category-budget-top">

                                    <strong>
                                        {item.category}
                                    </strong>

                                    <span
                                        className={
                                            item.status === "OVER_BUDGET"
                                                ? "category-danger"
                                                : item.status === "WARNING"
                                                    ? "category-warning"
                                                    : "category-safe"
                                        }
                                    >
                                        {item.status}
                                    </span>

                                </div>


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

                            </div>

                        ))}

                    </div>

                )}

            </div>


            {/* =====================================================
                CHARTS
            ===================================================== */}

            <div className="dashboard-section-title">

                <div>
                    <span className="panel-kicker">
                        ANALYTICS
                    </span>

                    <h2>
                        Spending overview
                    </h2>
                </div>

                <span>
                    Track how your expenses change over time
                </span>

            </div>


            <div className="dashboard-chart-grid">

                <div className="dashboard-panel chart-panel">

                    <div className="chart-header">

                        <div>
                            <h3>
                                Monthly Expenses
                            </h3>

                            <p>
                                Expense trends by month
                            </p>
                        </div>

                        <span className="chart-badge">
                            MONTHLY
                        </span>

                    </div>

                    <div className="chart-container">
                        <Bar
                            data={monthlyData}
                            options={chartOptions}
                        />
                    </div>

                </div>


                <div className="dashboard-panel chart-panel">

                    <div className="chart-header">

                        <div>
                            <h3>
                                Yearly Expenses
                            </h3>

                            <p>
                                Long-term spending trend
                            </p>
                        </div>

                        <span className="chart-badge">
                            YEARLY
                        </span>

                    </div>

                    <div className="chart-container">
                        <Line
                            data={yearlyData}
                            options={chartOptions}
                        />
                    </div>

                </div>

            </div>


            {/* =====================================================
                RECENT TRANSACTIONS
            ===================================================== */}

            <div className="dashboard-panel transactions-panel">

                <div className="panel-heading">

                    <div>
                        <span className="panel-kicker">
                            TRANSACTIONS
                        </span>

                        <h2>
                            Recent activity
                        </h2>
                    </div>

                    <div className="transaction-actions">

                        <button
                            className="small-outline-btn"
                            onClick={() => navigate("/expense")}
                        >
                            Expenses →
                        </button>

                        <button
                            className="small-outline-btn"
                            onClick={() => navigate("/income")}
                        >
                            Income →
                        </button>

                    </div>

                </div>


                <div className="transaction-table-wrap">

                    <table className="dashboard-table">

                        <thead>

                            <tr>
                                <th>
                                    Type
                                </th>

                                <th>
                                    Transaction
                                </th>

                                <th>
                                    Amount
                                </th>

                                <th>
                                    Category
                                </th>

                                <th>
                                    Date
                                </th>
                            </tr>

                        </thead>


                        <tbody>

                            {transactions.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="empty-table"
                                    >
                                        <div className="empty-state">

                                            <div className="empty-icon">
                                                ₹
                                            </div>

                                            <strong>
                                                No recent transactions
                                            </strong>

                                            <span>
                                                Add an income or expense to see it here.
                                            </span>

                                        </div>
                                    </td>

                                </tr>

                            ) : (

                                transactions.map((t, i) => {

                                    const isIncome =
                                        String(t.type || "")
                                            .toLowerCase()
                                            .includes("income");

                                    return (

                                        <tr key={i}>

                                            <td>

                                                <span
                                                    className={
                                                        isIncome
                                                            ? "transaction-type income-type"
                                                            : "transaction-type expense-type"
                                                    }
                                                >
                                                    {isIncome
                                                        ? "Income"
                                                        : "Expense"}
                                                </span>

                                            </td>


                                            <td>

                                                <div className="transaction-title">
                                                    {t.title}
                                                </div>

                                            </td>


                                            <td>

                                                <strong
                                                    className={
                                                        isIncome
                                                            ? "income-amount"
                                                            : "expense-amount"
                                                    }
                                                >
                                                    {isIncome ? "+" : "-"} ₹{" "}
                                                    {money(t.amount)}
                                                </strong>

                                            </td>


                                            <td>
                                                <span className="category-pill">
                                                    {t.category || "General"}
                                                </span>
                                            </td>


                                            <td>
                                                {t.date}
                                            </td>

                                        </tr>

                                    );
                                })

                            )}

                        </tbody>

                    </table>

                </div>

            </div>


            {/* =====================================================
                BOTTOM NAVIGATION
            ===================================================== */}

            <div className="dashboard-bottom-actions">

                <button
                    onClick={() => navigate("/advice")}
                >
                    🤖 AI Financial Advice
                </button>

                <button
                    onClick={() => navigate("/profile")}
                >
                    👤 Profile
                </button>

                <button
                    className="danger-outline-btn"
                    onClick={logout}
                >
                    ↪ Sign Out
                </button>

            </div>

        </div>
    );
}

export default Dashboard;