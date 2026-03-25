import secrets

from flask import Blueprint, render_template, make_response

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def get_main_page():
    token = secrets.token_hex(16)
    resp = make_response(render_template('main_page.html'))
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
    resp = make_response(render_template('contact.html'))
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
    return render_template('privacy.html')

@main_bp.route('/services')
def get_services():
    return render_template('services.html')

@main_bp.route('/proekt')
def get_proekt():
    return render_template('proekt.html')

@main_bp.route('/electro')
def get_electro():
    return render_template('electro.html')

@main_bp.route('/gas')
def get_gas():
    return render_template('gas.html')

@main_bp.route('/water')
def get_water():
    return render_template('water.html')

@main_bp.route('/lab')
def get_lab():
    return render_template('lab.html')

@main_bp.route('/cookie')
def get_cookie():
    return render_template('cookie.html')


