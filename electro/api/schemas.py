import bleach
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
import phonenumbers
from pydantic_core import PydanticCustomError


class Feedback(BaseModel):
    name: str = Field(..., min_length=2, max_length=50, description="User name")
    phone: str = Field(..., description="PhoneNumber")
    email: EmailStr | None = Field(..., description="Email")
    subject: str | None = Field(..., description="Subject")
    message: str = Field(..., max_length=500, description="Message from user")


    @field_validator("name", mode="before")
    def validate_name(cls, v):
        """
        Валидация входящего значения имени.
        Имя может содеражить только буквы разного регистра, цифры, пробелы, запятые, апостроф и дефис.
        """
        pattern = r"^[A-Za-zА-Яа-яЁё0-9 ,\'\-]{2,50}$"
        if not re.match(pattern, v):
            raise PydanticCustomError(
                'name.invalid',
                'Имя может содержать только буквы, цифры, пробелы, запятые, апостроф и дефис.'
            )
        return v


    @field_validator("email", mode="before")
    def convert_empty_to_none(cls, v):
        """
        Валидация электронной почты пользователя с ошибками на русском языке.
        """
        if not v:  # пустая строка → None, EmailStr пропустит
            return None
        if "@" not in v or "." not in v:
            raise PydanticCustomError('email.invalid', 'Неверный формат почты. Проверьте, пожалуйста, данные.')
        return v


    @field_validator("phone", mode="before")
    def check_phone(cls, ph):
        """
        Валидация мобильного номера, регион Белаурсь.
        """
        ph = ph.strip()

        # Плюс разрешён только в начале, остальное — цифры, скобки, дефисы, пробелы
        if not re.match(r'^\+?[\d\s()\-]+$', ph):
            raise PydanticCustomError(
                'phone.invalid_symbol',
                'Номер содержит недопустимые символы. Введите номер в формате +375 XX XXX XXXX.'
            )

        number = ''.join(ch for ch in ph if ch.isdigit())
        if len(number) != 12:
            raise PydanticCustomError(
                'phone.invalid_format',
                'Введите номер в формате +375 XX XXX XXXX.'
            )

        if not number.startswith("375"):
            raise PydanticCustomError(
                'phone.invalid_format',
                'Введите номер в формате +375 XX XXX XXXX.'
            )

        try:
            numb = phonenumbers.parse(f'+{number}', 'BY')
            if not phonenumbers.is_valid_number(numb):
                raise PydanticCustomError(
                    'phone.not_valid',
                    'Введён некорректный номер.'
                )
        except phonenumbers.NumberParseException:
            raise PydanticCustomError(
                'phone.not_recognized',
                'Номер не распознан.'
            )

        return f'+{number}'


    @field_validator("subject")
    def validate_subject(cls, v):
        """
        Валидация темы сообщения.
        Возвращает тему сообщения или значение по умолчанию при незапонении поля формы.
        """
        if v == "":
            v = "Без темы"
        return v


    @field_validator("message", "subject", mode="after")
    def sanitize_message(cls, t):
        """
        Защита от  XSS‑атак и вредоносного HTML
        """
        cleaned_text = bleach.clean(t, tags=[], attributes={}, strip=True)
        return cleaned_text.strip()