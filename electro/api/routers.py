from flask import Blueprint, abort, request, jsonify
from flask_mail import Message
from pydantic import ValidationError

from .schemas import Feedback
from electro.extensions import mail
from electro.__init__ import limiter


api_bp = Blueprint('api', __name__)


@api_bp.route('/api/feedback', methods=['POST'], strict_slashes=False)
@limiter.limit("5/minute")
def post_feedback():

    # Проверка Content-Type
    if request.content_type != "application/json":
        abort(400)

    # Honeypot
    data = request.get_json(silent=True) or {}
    if data.get("website"):
        abort(400)

    # Проверка Origin
    origin = request.headers.get("Origin")
    if origin not in {
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "https://localhost",
        "https://127.0.0.1"
    }:
        abort(403)

    # CSRF проверка
    cookie_token = request.cookies.get("csrftoken")
    header_token = request.headers.get("X-CSRF-Token")

    if not cookie_token or cookie_token != header_token:
        abort(403, description="Invalid CSRF token")

    try:
        validated_data = Feedback(**data)

        msg = Message(
            subject= f'{validated_data.subject} от {validated_data.name}, {validated_data.phone}, {validated_data.email}',
            recipients=['electrologoysk@gmail.com'],
            body= f'{validated_data.message}'
        )
        mail.send(msg)

        return jsonify({"status": "success", "message": "Письмо отправлено"}), 200

    except ValidationError as e:
        return jsonify({"detail": e.errors()}), 400

    except Exception as e:
        return jsonify({
            "detail": [{
                "msg": e.args[0] if e.args else repr(e)
            }]
        }), 500
