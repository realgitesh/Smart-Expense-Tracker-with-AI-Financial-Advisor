
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../services/api";

function Profile() {
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    const [profile, setProfile] = useState({
        fullName: "",
        email: ""
    });

    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!userId) {
            navigate("/", { replace: true });
            return;
        }
        loadProfile();
    }, [userId, navigate]);

    const loadProfile = async () => {
        try {
            const response =
                await api.get(`/profile/${userId}`);

            setProfile({
                fullName: response.data.fullName || "",
                email: response.data.email || ""
            });
        } catch (error) {
            Swal.fire("Error", "Unable to load profile.", "error");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async () => {
        if (!profile.fullName.trim() || !profile.email.trim()) {
            Swal.fire("Invalid details", "Name and email are required.", "warning");
            return;
        }

        setSaving(true);

        try {
            const response =
                await api.put(`/profile/${userId}`, {
                    fullName: profile.fullName.trim(),
                    email: profile.email.trim()
                });

            localStorage.setItem(
                "fullName",
                response.data.fullName
            );

            Swal.fire({
                icon: "success",
                title: "Profile Updated",
                timer: 1200,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire(
                "Update Failed",
                error.response?.data?.message ||
                "Unable to update profile.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    const changePassword = async () => {
        if (
            !passwords.currentPassword ||
            passwords.newPassword.length < 6
        ) {
            Swal.fire(
                "Invalid password",
                "Enter the current password and a new password of at least 6 characters.",
                "warning"
            );
            return;
        }

        setSaving(true);

        try {
            await api.put(
                `/profile/${userId}/password`,
                passwords
            );

            setPasswords({
                currentPassword: "",
                newPassword: ""
            });

            Swal.fire({
                icon: "success",
                title: "Password Changed",
                text: "Your password is now stored using secure BCrypt hashing.",
                timer: 1600,
                showConfirmButton: false
            });
        } catch (error) {
            Swal.fire(
                "Password Change Failed",
                error.response?.data?.message ||
                "Unable to change password.",
                "error"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="container">
                <h1>👤 Profile</h1>
                <h3>Loading...</h3>
            </div>
        );
    }

    return (
        <div className="container">
            <h1>👤 Profile Management</h1>

            <div className="card light-card">
                <h2>Personal Details</h2>

                <label>Full Name</label>
                <input
                    value={profile.fullName}
                    onChange={(e) =>
                        setProfile({
                            ...profile,
                            fullName: e.target.value
                        })
                    }
                />

                <label>Email</label>
                <input
                    type="email"
                    value={profile.email}
                    onChange={(e) =>
                        setProfile({
                            ...profile,
                            email: e.target.value
                        })
                    }
                />

                <button
                    disabled={saving}
                    onClick={updateProfile}
                >
                    💾 Save Profile
                </button>
            </div>

            <div className="card light-card">
                <h2>🔐 Change Password</h2>

                <input
                    type="password"
                    placeholder="Current Password"
                    value={passwords.currentPassword}
                    onChange={(e) =>
                        setPasswords({
                            ...passwords,
                            currentPassword: e.target.value
                        })
                    }
                />

                <input
                    type="password"
                    placeholder="New Password (minimum 6 characters)"
                    value={passwords.newPassword}
                    onChange={(e) =>
                        setPasswords({
                            ...passwords,
                            newPassword: e.target.value
                        })
                    }
                />

                <button
                    disabled={saving}
                    onClick={changePassword}
                >
                    🔑 Change Password
                </button>
            </div>

            <button onClick={() => navigate("/dashboard")}>
                🏠 Dashboard
            </button>
        </div>
    );
}

export default Profile;
