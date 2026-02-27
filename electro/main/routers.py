from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def get_main_page():
    return render_template('main_page.html')

@main_bp.route('/privacy')
def get_privacy():
    return render_template('privacy.html')

# Для другого любого адреса место xxxx пишешь свои имена
# @main_bp.route('/xxx')
# def get_xxxxxxx_page():
#     return render_template('xxxx.html')