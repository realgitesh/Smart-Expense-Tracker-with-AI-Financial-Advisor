import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Register() {

    const navigate = useNavigate();

    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: ""
    });

    const registerUser = async () => {

        if (
            user.fullName.trim() === "" ||
            user.email.trim() === "" ||
            user.password.trim() === ""
        ) {

            Swal.fire({
                icon: "warning",
                title: "Missing Details",
                text: "Please fill all fields.",
                confirmButtonColor: "#2563eb"
            });

            return;
        }

        try {

            await api.post("/auth/register", user);

            await Swal.fire({
                icon: "success",
                title: "Registration Successful",
                text: "You can now login.",
                confirmButtonColor: "#2563eb"
            });

            navigate("/");

        } catch (error) {

            console.log(error);

            if (error.response) {

                Swal.fire({
                    icon: "error",
                    title: "Registration Failed",
                    text: error.response.data.message || "Unable to register.",
                    confirmButtonColor: "#2563eb"
                });

            } else {

                Swal.fire({
                    icon: "warning",
                    title: "Server Error",
                    text: "Cannot connect to Spring Boot Server.",
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
                <div className="brand-mark">₹</div>
                <div>
                    <div className="brand-name">SmartSpend</div>
                    <div className="brand-caption">Personal finance</div>
                </div>
            </div>

            <h2>📝 Register</h2>

            <input
                type="text"
                placeholder="Full Name"
                value={user.fullName}
                onChange={(e) =>
                    setUser({ ...user, fullName: e.target.value })
                }
            />

            <input
                type="email"
                placeholder="Email"
                value={user.email}
                onChange={(e) =>
                    setUser({ ...user, email: e.target.value })
                }
            />

            <input
                type="password"
                placeholder="Password"
                value={user.password}
                onChange={(e) =>
                    setUser({ ...user, password: e.target.value })
                }
            />

            <button onClick={registerUser}>
                Register
            </button>

            <br /><br />

            <Link to="/">
                Already have an account? Login
            </Link>

                </div>
            </div>
        </div>

    );

}

export default Register;