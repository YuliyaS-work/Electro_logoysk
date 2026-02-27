from flask import Blueprint, request, jsonify
from flask_mail import Message
from pydantic import ValidationError

from .schemas import Feedback
from electro.extensions import mail

api_bp = Blueprint('api', __name__)


@api_bp.route('/api/feedback', methods=['POST'], strict_slashes=False)
@api_bp.route('/contact/api/feedback', methods=['POST'], strict_slashes=False)
def post_feedback():
    try:
        data = request.get_json()

        validated_data = Feedback(**data)

        msg = Message(
            subject= f'{validated_data.subject} от {validated_data.name}, {validated_data.phone}, {validated_data.email}',
            recipients=['yuliyasorokinawork@gmail.com', 'tanyakuharskaya@gmail.com'],
            body= f'{validated_data.message}'
        )
        mail.send(msg)

        return jsonify({"status": "success", "message": "Письмо отправлено"}), 200
    except ValidationError as e:
        return jsonify({"status": "error", "errors": e.errors()}), 400
    except Exception as e:
        return jsonify({"status": "error", "errors": str(e)}), 500
