import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function AIAdvice() {

    const navigate = useNavigate();

    const [advice, setAdvice] = useState("");

    const [loading, setLoading] = useState(false);

    const userId = localStorage.getItem("userId");

    const getAdvice = async () => {

        try {

            setLoading(true);

            setAdvice("Generating AI Advice...\n\nPlease wait...");

            const response = await api.get("/ai/advice/" + userId);

            setAdvice(response.data);

            Swal.fire({
                icon: "success",
                title: "AI Advice Ready",
                text: "Financial advice generated successfully.",
                timer: 1500,
                showConfirmButton: false
            });

        } catch (error) {

            console.log(error);

            if (error.response) {

                Swal.fire({
                    icon: "error",
                    title: "Server Error",
                    text: "Error Code: " + error.response.status,
                    confirmButtonColor: "#2563eb"
                });

            } else {

                Swal.fire({
                    icon: "error",
                    title: "Connection Failed",
                    text: "Unable to connect to Spring Boot Server.",
                    confirmButtonColor: "#2563eb"
                });

            }

        } finally {

            setLoading(false);

        }

    };

    return (

        <div className="container">

            <h2>🤖 AI Financial Advisor</h2>

            <button
                onClick={getAdvice}
                disabled={loading}
            >
                {loading ? "⏳ Generating..." : "✨ Generate AI Advice"}
            </button>

            {" "}

            <button
                onClick={() => navigate("/dashboard")}
            >
                ⬅ Back
            </button>

            <br /><br />

            <textarea
                rows="15"
                value={advice}
                readOnly
                placeholder="Your AI financial advice will appear here..."
            />

        </div>

    );

}

export default AIAdvice;