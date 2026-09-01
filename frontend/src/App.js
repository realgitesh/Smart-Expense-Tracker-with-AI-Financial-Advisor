import { NavLink, BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import "./App.css";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expense from "./pages/Expense";
import Income from "./pages/Income";
import AIAdvice from "./pages/AIAdvice";
import Budget from "./pages/Budget";
import Reports from "./pages/Reports";
import Profile from "./pages/Profile";

import ProtectedRoute from "./components/ProtectedRoute";

const navigation = [
    { to: "/dashboard", icon: "⌂", label: "Dashboard" },
    { to: "/expense", icon: "↘", label: "Expenses" },
    { to: "/income", icon: "↗", label: "Income" },
    { to: "/budget", icon: "▣", label: "Budget" },
    { to: "/reports", icon: "▤", label: "Reports" },
    { to: "/advice", icon: "✦", label: "AI Advisor" },
    { to: "/profile", icon: "◉", label: "Profile" }
];

function AppLayout({ children }) {
    const navigate = useNavigate();
    const location = useLocation();
    const fullName = localStorage.getItem("fullName") || "User";
    const email = localStorage.getItem("email") || "";

    const logout = () => {
        localStorage.clear();
        navigate("/", { replace: true });
    };

    const current = navigation.find((item) => location.pathname === item.to);

    return (
        <div className="app-shell">
            <aside className="sidebar">
                <div className="brand-block">
                    <div className="brand-mark">₹</div>
                    <div>
                        <div className="brand-name">SmartSpend</div>
                        <div className="brand-caption">Personal finance</div>
                    </div>
                </div>

                <div className="profile-mini">
                    <div className="avatar">{fullName.charAt(0).toUpperCase()}</div>
                    <div className="profile-mini-copy">
                        <strong>{fullName}</strong>
                        <span>{email || "Your account"}</span>
                    </div>
                </div>

                <nav className="sidebar-nav" aria-label="Main navigation">
                    <span className="nav-label">WORKSPACE</span>
                    {navigation.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `sidebar-link ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="secure-note">
                        <span>●</span>
                        <div>
                            <strong>Local workspace</strong>
                            <small>Your financial data stays connected to your account.</small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        <span>↪</span> Sign out
                    </button>
                </div>
            </aside>

            <main className="main-content">
                <header className="mobile-header">
                    <div className="mobile-brand">
                        <div className="brand-mark">₹</div>
                        <strong>SmartSpend</strong>
                    </div>
                    <button className="mobile-signout" onClick={logout}>↪</button>
                </header>

                <div className="content-header">
                    <div>
                        <span className="eyebrow">PERSONAL FINANCE</span>
                        <h4>{current?.label || "Overview"}</h4>
                    </div>
                    <div className="header-status">
                        <span className="status-dot" />
                        <span>Account active</span>
                    </div>
                </div>

                {children}
            </main>
        </div>
    );
}

function ProtectedPage({ children }) {
    return (
        <ProtectedRoute>
            <AppLayout>{children}</AppLayout>
        </ProtectedRoute>
    );
}

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/dashboard" element={<ProtectedPage><Dashboard /></ProtectedPage>} />
                <Route path="/expense" element={<ProtectedPage><Expense /></ProtectedPage>} />
                <Route path="/income" element={<ProtectedPage><Income /></ProtectedPage>} />
                <Route path="/budget" element={<ProtectedPage><Budget /></ProtectedPage>} />
                <Route path="/advice" element={<ProtectedPage><AIAdvice /></ProtectedPage>} />
                <Route path="/reports" element={<ProtectedPage><Reports /></ProtectedPage>} />
                <Route path="/profile" element={<ProtectedPage><Profile /></ProtectedPage>} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
