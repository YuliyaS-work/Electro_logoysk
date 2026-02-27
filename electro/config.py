from decouple import config

class BaseConfig:
    SECRET_KEY = config('SECRET_KEY')
    # SQLALCHEMY_TRACK_MODIFICATIONS = False


class DevelopmentConfig(BaseConfig):
    DEBUG = True
    # SQLALCHEMY_DATABASE_URI = config('DEVELOPMENT_DATABASE_URI')


class TestingConfig(BaseConfig):
    DEBUG = True
    # SQLALCHEMY_DATABASE_URI = config('TESTING_DATABASE_URI')


class ProductionConfig(BaseConfig):
    DEBUG = False
    # SQLALCHEMY_DATABASE_URI = config('PRODUCTION_DATABASE_URI')