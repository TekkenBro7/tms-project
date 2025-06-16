from django.conf import settings
from django.core.mail import send_mail

from core.logging import logger


def send_subtask_email(recipient_email, subject, message):
    try:
        logger.info(f"Sending email to {recipient_email} with subject: {subject}")
        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[recipient_email],
            fail_silently=False,
        )
        logger.info(f"Email sent successfully to {recipient_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
