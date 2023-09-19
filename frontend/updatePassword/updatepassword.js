document.addEventListener("DOMContentLoaded", () => {
    const updatePasswordForm = document.getElementById("updatePasswordForm");
    const message = document.getElementById("message");

    updatePasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(updatePasswordForm);
        const email = formData.get("email");
        const code = formData.get("code");
        const newPassword = formData.get("newPassword");

        try {
            const response = await axios.post("http://localhost:8800/user/updatePassword", {
                email,
                code,
                newPassword,
            });

            if (response.status === 200) {
                message.textContent = "Password updated successfully!";
                message.className = "success";

                setTimeout(() => {
                    window.location.href = "../logIn/login.html";
                }, 2000);
            } else {
                message.textContent = response.data.message || "Failed to update password.";
                message.className = "error";
            }
        } catch (error) {
            message.textContent = "An error occurred.";
            message.className = "error";
        }

        message.classList.remove("hidden");
    });
});
