
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Reports() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);

    const [startDate, setStartDate] =
        useState(firstDay.toISOString().slice(0, 10));
    const [endDate, setEndDate] =
        useState(today.toISOString().slice(0, 10));
    const [loading, setLoading] = useState(false);

    const validate = () => {
        if (!startDate || !endDate) {
            Swal.fire("Missing dates", "Select both dates.", "warning");
            return false;
        }
        if (startDate > endDate) {
            Swal.fire("Invalid dates", "Start date cannot be after end date.", "warning");
            return false;
        }
        return true;
    };

    const downloadReport = async (type) => {
        if (!validate()) return;

        setLoading(true);

        try {
            const response = await api.get(
                `/reports/${type}/${userId}?startDate=${startDate}&endDate=${endDate}`,
                { responseType: "blob" }
            );

            const blob = new Blob([response.data]);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download =
                type === "pdf"
                    ? "financial-report.pdf"
                    : "financial-report.xlsx";

            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            Swal.fire({
                icon: "success",
                title: "Report Ready",
                text: `${type.toUpperCase()} report downloaded.`,
                timer: 1200,
                showConfirmButton: false
            });
        } catch (error) {
            console.error(error);
            Swal.fire(
                "Export Failed",
                "Unable to generate the report. Check the backend server.",
                "error"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>📄 Financial Reports</h1>
            <p className="subtitle">
                Export income and expense data for any date range.
            </p>

            <div className="card light-card">
                <h2>📅 Report Period</h2>

                <label>From Date</label>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />

                <label>To Date</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>

            <div className="action-grid">
                <button
                    disabled={loading}
                    onClick={() => downloadReport("pdf")}
                >
                    {loading ? "⏳ Preparing..." : "📕 Export PDF"}
                </button>

                <button
                    disabled={loading}
                    onClick={() => downloadReport("excel")}
                >
                    {loading ? "⏳ Preparing..." : "📗 Export Excel"}
                </button>
            </div>

            <hr />

            <button onClick={() => navigate("/dashboard")}>
                🏠 Dashboard
            </button>

            <button onClick={() => navigate("/expense")}>
                💸 Expenses
            </button>

            <button onClick={() => navigate("/income")}>
                💵 Income
            </button>

            <button onClick={() => navigate("/profile")}>
                👤 Profile
            </button>
        </div>
    );
}

export default Reports;
