document.addEventListener("DOMContentLoaded", () => {
    const registrationForm = document.getElementById("registrationForm");
    const message = document.getElementById("message");

    registrationForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const formData = new FormData(registrationForm);
        const userData = {
            name: formData.get("name"),
            email: formData.get("email"),
            password: formData.get("password"),
        };

        try {
            const response = await axios.post("http://localhost:8800/user/register", userData);

            if (response.status === 200) {
                message.textContent = "User registered successfully!";
                message.className = "success";
            } else {
                message.textContent = response.data.message || "Registration failed.";
                message.className = "error";
            }
        } catch (error) {
            message.textContent = "An error occurred.";
            message.className = "error";
        }

        message.classList.remove("hidden");
    });
});