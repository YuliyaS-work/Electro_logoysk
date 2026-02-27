from pydantic import BaseModel, EmailStr, Field
from pydantic_extra_types.phone_numbers import PhoneNumber


class Feedback(BaseModel):
    name: str=Field(..., max_length=50)
    phone: PhoneNumber
    email: EmailStr | None = None
    subject: str = Field("Без темы", max_length=50)
    message: str=Field(..., max_length=500)


