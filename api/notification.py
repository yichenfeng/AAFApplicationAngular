from flask import current_app, render_template
from flask_mail import Mail, Message
import premailer
#from decorators import async

mail = Mail()

#@async
def send_email(subject, request_details, new_status, recipients, cc):
    message = ""
    if current_app.config['DEBUG_NOTIFICATIONS']:
        message += '<p>Original Recipients:</p>'
        for recpient in recipients:
            message += '<p>%s</p>' % recpient
        message += '<p>Original CC: </p>'
        for group in cc:
            message += '<p>%s</p>' % group

    recipients = current_app.config['DEBUG_RECIPIENTS']
    cc = current_app.config['DEBUG_RECIPIENTS']

    msg = Message(subject,
                  recipients=recipients,
                  cc=cc)

    image_path = current_app.config.get('IMG_PATH')

    with current_app.open_resource(image_path + "i_Brand.png") as fp:
        msg.attach("i_Brand.png", "image/png", fp.read())

    raw_html = render_template('%s.html' % (new_status),
                                  subject=subject,
                                  request_details=request_details,
                                  new_status=new_status,
				  host_url=current_app.config.get('HOST_URL')) + message

    msg.html = premailer.transform(raw_html)

    mail.send(msg)
