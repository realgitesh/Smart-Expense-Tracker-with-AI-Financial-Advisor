import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    // Clear old login session when Login page is opened
    useEffect(() => {
        localStorage.clear();
    }, []);

    const loginUser = async () => {

        try {

            const response = await api.post("/auth/login", {
                email: email,
                password: password
            });

            localStorage.setItem("userId", response.data.userId);
            localStorage.setItem("fullName", response.data.fullName);

            await Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: "Welcome " + response.data.fullName,
                confirmButtonColor: "#2563eb"
            });

            navigate("/dashboard");

        } catch (error) {

            console.log("Full Error:", error);
            console.log("Response:", error.response);

            if (error.response) {

                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text:
                        error.response.data.message ||
                        "Invalid Email or Password",
                    confirmButtonColor: "#2563eb"
                });

            } else {

                Swal.fire({
                    icon: "warning",
                    title: "Server Error",
                    text: "Cannot connect to Spring Boot Server",
                    confirmButtonColor: "#2563eb"
                });

            }
        }
    };

    return (

        <div className="auth-page">

            <div className="auth-card">

                <div className="container">

                    <div className="auth-brand">

                        <div className="brand-mark">
                            ₹
                        </div>

                        <div>
                            <div className="brand-name">
                                SmartSpend
                            </div>

                            <div className="brand-caption">
                                Personal finance
                            </div>
                        </div>

                    </div>

                    <h2>🔐 Login</h2>

                    <input
                        type="email"
                        placeholder="Enter Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Enter Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button onClick={loginUser}>
                        Login
                    </button>

                    <br />
                    <br />

                    <Link to="/register">
                        New User? Register Here
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Login;