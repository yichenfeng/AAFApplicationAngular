from flask import current_app
from flask_mail import Mail, Message
mail = Mail()

def send_email(subject, message, recipients):
    msg = Message(subject,
                  recipients=recipients)

    image_path = current_app.config.get('IMG_PATH')

    with current_app.open_resource(image_path + "i_Brand.png") as fp:
        msg.attach("i_Brand.png", "image/png", fp.read())


    msg.html = '<p><img class="brand" height="70" sizes="(max-width: 767px) 98vw, 554px" src="i_Brand.png" srcset="i_Brand.png 602w"></p>%s' % (message)

    mail.send(msg)
