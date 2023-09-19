document.addEventListener("DOMContentLoaded", () => {
    const forgotPasswordForm = document.getElementById("forgotPasswordForm");
    const message = document.getElementById("message");
    const updatePasswordLink = document.getElementById("updatePasswordLink");

    forgotPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(forgotPasswordForm);
        const email = formData.get("email");

        try {
            const response = await axios.post("http://localhost:8800/user/sendEmail", { email });

            if (response.status === 200) {
                message.textContent = "Reset code sent successfully. Check your email.";
                message.className = "success";
                updatePasswordLink.classList.remove("hidden");
            } else {
                message.textContent = response.data.message || "Failed to send reset code.";
                message.className = "error";
            }
        } catch (error) {
            message.textContent = "An error occurred.";
            message.className = "error";
        }

        message.classList.remove("hidden");
    });
});