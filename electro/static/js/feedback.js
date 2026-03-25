function getCookie(name) {
    return document.cookie
        .split("; ")
        .find(row => row.startsWith(name + "="))
        ?.split("=")[1];
}

document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const errorBox = document.getElementById("response-message-error_feedback");

// ── ВАЛИДАЦИЯ ──
  const validators = {
    name: v => /^[A-Za-zА-Яа-яЁё0-9 ,'-]{2,50}$/.test(v.trim()),
    phone: v => {
      // 1. Плюс обязателен (в начале или где угодно — как скажешь)
      if (!v.includes('+')) return false;

      // 2. Разрешаем только цифры, пробелы, скобки, дефисы и плюс
      if (!/^[\d\s()+-]+$/.test(v)) return false;

      // 3. Проверяем, что цифр ровно 12
      const digits = v.replace(/\D/g, '');
      return digits.length === 12;
  },

    email:     v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
    subject:   () => true,
    message:   v => v.trim().length >= 2,
    agreement: (_, field) => field.checked,
  };

  const messages = {
    name:      'Введите имя (минимум 2 символа)',
    phone:     'Введите номер телефонв в формате +375 XX XXX XXXX',
    email:     'Введите корректный email',
    message:   'Сообщение слишком короткое',
    agreement: 'Необходимо согласие на обработку данных',
  };

  function setError(field, msg) {
    const wrap = field.closest('.f-field');
    wrap.classList.add('f-field--error');
    wrap.classList.remove('f-field--ok');
    let hint = wrap.querySelector('.f-hint');
    if (!hint) {
      hint = document.createElement('span');
      hint.className = 'f-hint';
      wrap.appendChild(hint);
    }
    hint.textContent = msg;
  }

  function setOk(field) {
    const wrap = field.closest('.f-field');
    wrap.classList.remove('f-field--error');
    wrap.classList.add('f-field--ok');
    const hint = wrap.querySelector('.f-hint');
    if (hint) hint.textContent = '';
  }

  function validateField(field) {
    const name = field.name;
    if (!validators[name]) return true;
    const valid = validators[name](field.value, field);
    if (!valid) setError(field, messages[name] || '');
    else setOk(field);
    return valid;
  }

  function validateAll() {
    let valid = true;
    form.querySelectorAll('.f-input').forEach(field => {
      if (!validateField(field)) valid = false;
    });
    return valid;
  }

  // blur + живая проверка если уже есть ошибка
  form.querySelectorAll('.f-input').forEach(field => {
    field.addEventListener('blur', () => validateField(field));
    field.addEventListener('input', () => {
      if (field.closest('.f-field')?.classList.contains('f-field--error')) {
        validateField(field);
      }
    });
    field.addEventListener('change', () => validateField(field)); // для чекбокса
  });

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        errorBox.textContent = "";
        document.querySelectorAll(".error").forEach(el => el.textContent = "");

        if (!validateAll()) return;

        const url = form.dataset.url;

        const payload = {
            name: form.name.value.trim(),
            phone: form.phone.value.trim(),
            email: form.email.value.trim(),
            subject: form.subject.value.trim(),
            message: form.message.value.trim()
        };

        // 👉 получаем токен
        const csrfToken = getCookie("csrftoken");

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-Token": csrfToken   // 👉 добавляем токен
                },
                body: JSON.stringify(payload)
            });

            let result;

            try {
                result = await response.json();
            } catch {
                errorBox.textContent = "Ошибка сервера. Попробуйте позже.";
                return;
            }

            if (!response.ok) {
                if (Array.isArray(result.detail)) {
                    result.detail.forEach(err => {
                        const field = err.loc.at(-1);
                        const message = err.msg;

                        const fieldError = document.querySelector(`#${field}-error`);
                        if (fieldError) {
                            fieldError.textContent = message;
                        }
                    });
                    return;
                }

                errorBox.textContent = "Ошибка отправки.";
                return;
            }

//            alert("Ваше сообщение успешно отправлено!");
            document.getElementById('feedback-alert-message').textContent = 'Ваше сообщение успешно отправлено!';
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