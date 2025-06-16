from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from core.logging import logger


def send_email(recipient_email, subject, text_content, html_content=None):
    try:
        logger.info(f"Sending email to {recipient_email} with subject: {subject}")

        msg = EmailMultiAlternatives(
            subject=subject,
            body=text_content,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[recipient_email],
        )

        if html_content:
            msg.attach_alternative(html_content, "text/html")

        msg.send()
        logger.info(f"Email sent successfully to {recipient_email}")

    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
