import bleach
import re
from pydantic import BaseModel, EmailStr, Field, field_validator
import phonenumbers
from pydantic_core import PydanticCustomError


class Feedback(BaseModel):
    name: str = Field(..., min_length=2, max_length=50)
    phone: str
    email: EmailStr | None = None
    subject: str = Field("Без темы", max_length=50)
    message: str = Field(..., max_length=500)

    @field_validator("name", mode="before")
    def validate_name(cls, v):
        pattern = r"^[A-Za-zА-Яа-яЁё0-9 ,\'\-]{2,50}$"
        if not re.match(pattern, v):
            raise PydanticCustomError(
                'name.invalid',
                'Имя может содержать только буквы, цифры, пробелы, запятые, апостроф и дефис.'
            )
        return v

    # @field_validator("email", mode="before")
    # def convert_empty_to_none(cls, v):
    #     return v or None

    # @field_validator("email", mode="before")
    # def convert_empty_to_none(cls, v):
    #     # Минимальная проверка, чтобы поймать ошибку ДО EmailStr
    #     if "@" not in v or "." not in v:
    #         raise PydanticCustomError(
    #             'email.invalid',
    #             'Email введён некорректно.Пожалуйста, проверьте формат.'
    #         )
    #     return v

    @field_validator("email", mode="before")
    def convert_empty_to_none(cls, v):
        if not v:  # пустая строка → None, EmailStr пропустит
            return None
        if "@" not in v or "." not in v:
            raise PydanticCustomError('email.invalid', '...')
        return v

    @field_validator("phone", mode="before")
    def check_phone(cls, ph):
        # allowed = set("0123456789()- ")
        # if any(ch not in allowed for ch in ph):
        #     raise PydanticCustomError(
        #         'phone.invalid_symbol',
        #         'Номер содержит недопустимые символы. Введите номер в формате +375 XX XXX XXXX.'
        #     )
        #
        # if not ph.startswith("375"):
        #     raise PydanticCustomError(
        #         'phone.invalid_format',
        #         'Введите номер в формате +375 XX XXX XXXX.'
        #     )
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

    @field_validator("message", "subject", mode="after")
    def sanitize_message(cls, t):
        cleaned_text = bleach.clean(t, tags=[], attributes={}, strip=True)
        return cleaned_text.strip()