document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const errorBox = document.getElementById("response-message-error_feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorBox.textContent = "";

        const url = form.dataset.url;

        const payload = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (!response.ok) {
                errorBox.textContent = result.errors || "Ошибка отправки";
                return;
            }

            alert("Ваше сообщение успешно отправлено!");
            form.reset();

        } catch (err) {
            errorBox.textContent = "Произошла ошибка. Попробуйте позже.";
            console.error(err);
        }
    });
});
