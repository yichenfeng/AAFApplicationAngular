from flask import current_app
from flask_mail import Mail, Message
#from decorators import async

mail = Mail()

#@async
def send_email(subject, message, recipients, cc):
    if current_app.config['DEBUG']:
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

    msg.html = '<p><img class="brand" height="70" sizes="(max-width: 767px) 98vw, 554px" src="i_Brand.png" srcset="i_Brand.png 602w"></p>%s' % (message)

    mail.send(msg)
