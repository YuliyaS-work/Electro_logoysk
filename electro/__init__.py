from flask import Flask, render_template
from decouple import config as env_config
from flask_wtf import CSRFProtect

from .extensions import  mail


def create_app(config_class='electro.config.DevelopmentConfig'):
    app = Flask(__name__)
    #
    # if config_class is None:
    #     config_class = 'electro.config.DevelopmentConfig'

    app.config.from_object(config_class)

    app.config['MAIL_SERVER'] = env_config('MAIL_SERVER')
    app.config['MAIL_PORT'] = env_config('MAIL_PORT',  cast=int)
    app.config['MAIL_USE_TLS'] = env_config('MAIL_USE_TLS', cast=bool)
    app.config['MAIL_USERNAME'] = env_config('MAIL_USERNAME')
    app.config['MAIL_PASSWORD'] = env_config('MAIL_PASSWORD')
    app.config['MAIL_DEFAULT_SENDER'] = env_config('MAIL_DEFAULT_SENDER')

    mail.init_app(app)

    from electro.main.routers import main_bp
    from electro.api.routers import api_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp)

    @app.errorhandler(404)
    def page_not_found(error):
        return render_template('404.html')

    return app
