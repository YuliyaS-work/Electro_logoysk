function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const errorBox = document.getElementById("response-message-error_feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // очищаем общий блок ошибок
        errorBox.textContent = "";

        // очищаем ошибки под полями
        document.querySelectorAll(".error-field").forEach(el => el.textContent = "");

        const url = form.dataset.url;

        const payload = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        const csrfToken = getCookie("csrftoken");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken
                },
                body: JSON.stringify(payload)
            });

            let result;
            try {
                result = await response.json();
                console.log("SERVER RESPONSE:", result);
            } catch {
                errorBox.textContent = "Ошибка сервера. Попробуйте позже.";
                return;
            }

            // ---- ОБРАБОТКА ОШИБОК ----
            if (!response.ok) {

                // Если detail — массив ошибок Pydantic
                if (Array.isArray(result.detail)) {
                    result.detail.forEach(err => {
                        const field = err.loc.at(-1);   // например "name"
                        const message = err.msg;

                        const fieldError = document.getElementById(`${field}-error`);
                        if (fieldError) {
                            fieldError.textContent = message;
                        }
                    });
                    return;
                }

                // Если detail — строка
                if (typeof result.detail === "string") {
                    errorBox.textContent = result.detail;
                    return;
                }

                // Если что-то странное
                errorBox.textContent = "Ошибка отправки.";
                return;
            }

            // ---- УСПЕХ ----
            document.getElementById('feedback-alert-message').textContent =
                'Ваше сообщение успешно отправлено!';
            document.getElementById('feedback-alert').classList.add('active');

            setTimeout(() => {
                document.getElementById('feedback-alert').classList.remove('active');
            }, 4000);

            form.reset();

        } catch (err) {
            errorBox.textContent = "Произошла ошибка. Попробуйте позже.";
            console.error(err);
        }
    });
});