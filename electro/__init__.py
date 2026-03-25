from flask import Flask, render_template
from decouple import config as env_config
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

from .extensions import  mail

# limiter = Limiter(get_remote_address)
limiter = Limiter(
    key_func=get_remote_address,
    storage_uri="redis://localhost:6379"
)


def create_app(config_class='electro.config.DevelopmentConfig'):
    app = Flask(__name__)

    # Подключаем лимитер к приложению
    limiter.init_app(app)

    # Ограничение размера запроса
    app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024  # 1 MB

    # if config_class is None:
    #     config_class = 'electro.config.DevelopmentConfig'

    app.config.from_object(config_class)

    # Настройка почты
    app.config['MAIL_SERVER'] = env_config('MAIL_SERVER')
    app.config['MAIL_PORT'] = env_config('MAIL_PORT',  cast=int)
    app.config['MAIL_USE_TLS'] = env_config('MAIL_USE_TLS', cast=bool)
    app.config['MAIL_USERNAME'] = env_config('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = env_config('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = env_config('MAIL_DEFAULT_SENDER')

    mail.init_app(app)

    # Security headers
    @app.after_request
    def add_security_headers(resp):
        resp.headers["X-Frame-Options"] = "DENY"
        resp.headers["X-Content-Type-Options"] = "nosniff"
        resp.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        resp.headers["Permissions-Policy"] = "geolocation=(), microphone=(), camera=()"
        resp.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data: https:; "
        "frame-src https://yandex.by https://yandex.ru; "
        "connect-src 'self'; "
        "font-src 'self' data:; "
    )
        return resp

    from electro.main.routers import main_bp
    from electro.api.routers import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('404.html')

    return app
