import secrets

from flask import Blueprint, render_template, make_response

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def get_main_page():
    token = secrets.token_hex(16)
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
    ]
    resp = make_response(render_template('main_page.html', breadcrumb_list=breadcrumb_list))
    resp.set_cookie(
        "csrftoken",
        token,
        httponly=False,
        samesite="Strict",
        secure=False
    )
    return resp

@main_bp.route('/contact')
def get_contact():
    token = secrets.token_hex(16)
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Контакты", "url": "https://electro-logoysk.by/contacts"}
    ]
    resp = make_response(render_template('contact.html', breadcrumb_list=breadcrumb_list))
    resp.set_cookie(
        "csrftoken",
        token,
        httponly=False,
        samesite="Strict",
        secure=False
    )
    return resp

@main_bp.route('/privacy')
def get_privacy():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Политика", "url": "https://electro-logoysk.by/privacy"}
    ]
    return render_template('privacy.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/services')
def get_services():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Аренда техники", "url": "https://electro-logoysk.by/services"}
    ]
    return render_template('services.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/proekt')
def get_proekt():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Проектирование", "url": "https://electro-logoysk.by/proekt"}
    ]
    return render_template('proekt.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/electro')
def get_electro():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Электроснабжение", "url": "https://electro-logoysk.by/electro"}
    ]
    return render_template('electro.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/gas')
def get_gas():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Газоснабжение", "url": "https://electro-logoysk.by/gas"}
    ]
    return render_template('gas.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/water')
def get_water():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Водоснабжение", "url": "https://electro-logoysk.by/water"}
    ]
    return render_template('water.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/lab')
def get_lab():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Лаборатория", "url": "https://electro-logoysk.by/lab"}
    ]
    return render_template('lab.html', breadcrumb_list=breadcrumb_list)

@main_bp.route('/cookie')
def get_cookie():
    breadcrumb_list = [
        {"name": "Главная", "url": "https://electro-logoysk.by/"},
        {"name": "Политика cookie", "url": "https://electro-logoysk.by/cookie"}
    ]
    return render_template('cookie.html', breadcrumb_list=breadcrumb_list)