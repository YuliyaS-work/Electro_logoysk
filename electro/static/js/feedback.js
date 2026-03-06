document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("feedback-form");
    const errorBox = document.getElementById("response-message-error_feedback");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // очищаем общую ошибку
        errorBox.textContent = "";

        // очищаем ошибки под полями
        document.querySelectorAll(".error").forEach(el => el.textContent = "");

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

            alert("Ваше сообщение успешно отправлено!");
            form.reset();

        } catch (err) {
            errorBox.textContent = "Произошла ошибка. Попробуйте позже.";
            console.error(err);
        }
    });
});
//document.addEventListener("DOMContentLoaded", () => {
//  const form     = document.getElementById("feedback-form");
//  const errorBox = document.getElementById("response-message-error_feedback");
//
//  // ── ВАЛИДАЦИЯ ──
//  const validators = {
//    name:      v => v.trim().length >= 2,
//    phone:     v => /^[\d\s\+\-\(\)]{7,}$/.test(v.trim()),
//    email:     v => v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
//    subject:   () => true,
//    message:   v => v.trim().length >= 5,
//    agreement: (_, field) => field.checked,
//  };
//
//  const messages = {
//    name:      'Введите имя (минимум 2 символа)',
//    phone:     'Введите корректный номер телефона',
//    email:     'Введите корректный email',
//    message:   'Сообщение слишком короткое',
//    agreement: 'Необходимо согласие на обработку данных',
//  };
//
//  function setError(field, msg) {
//    const wrap = field.closest('.f-field');
//    wrap.classList.add('f-field--error');
//    wrap.classList.remove('f-field--ok');
//    let hint = wrap.querySelector('.f-hint');
//    if (!hint) {
//      hint = document.createElement('span');
//      hint.className = 'f-hint';
//      wrap.appendChild(hint);
//    }
//    hint.textContent = msg;
//  }
//
//  function setOk(field) {
//    const wrap = field.closest('.f-field');
//    wrap.classList.remove('f-field--error');
//    wrap.classList.add('f-field--ok');
//    const hint = wrap.querySelector('.f-hint');
//    if (hint) hint.textContent = '';
//  }
//
//  function validateField(field) {
//    const name = field.name;
//    if (!validators[name]) return true;
//    const valid = validators[name](field.value, field);
//    if (!valid) setError(field, messages[name] || '');
//    else setOk(field);
//    return valid;
//  }
//
//  function validateAll() {
//    let valid = true;
//    form.querySelectorAll('.f-input').forEach(field => {
//      if (!validateField(field)) valid = false;
//    });
//    return valid;
//  }
//
//  // blur + живая проверка если уже есть ошибка
//  form.querySelectorAll('.f-input').forEach(field => {
//    field.addEventListener('blur', () => validateField(field));
//    field.addEventListener('input', () => {
//      if (field.closest('.f-field')?.classList.contains('f-field--error')) {
//        validateField(field);
//      }
//    });
//    field.addEventListener('change', () => validateField(field)); // для чекбокса
//  });
//
//  // ── САБМИТ ──
//  form.addEventListener("submit", async (e) => {
//    e.preventDefault();
//    errorBox.textContent = "";
//
//    if (!validateAll()) return;
//
//    const url = form.dataset.url;
//    const payload = {
//      name:    form.name.value.trim(),
//      phone:   form.phone.value.trim(),
//      email:   form.email.value.trim(),
//      subject: form.subject.value.trim(),
//      message: form.message.value.trim(),
//    };
//
//    try {
//      const response = await fetch(url, {
//        method: "POST",
//        headers: { "Content-Type": "application/json" },
//        body: JSON.stringify(payload),
//      });
//
//      const result = await response.json();
//
//      if (!response.ok) {
//        errorBox.textContent = result.errors || "Ошибка отправки";
//        return;
//      }
//
//      alert("Ваше сообщение успешно отправлено!");
//      form.reset();
//      form.querySelectorAll('.f-field').forEach(w => {
//        w.classList.remove('f-field--ok', 'f-field--error');
//      });
//
//    } catch (err) {
//      errorBox.textContent = "Произошла ошибка. Попробуйте позже.";
//      console.error(err);
//    }
//  });
//});