from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from core.logging import logger
from projects.email_templates import SubtaskEmailTemplates
from projects.models import Subtask


@shared_task(bind=True)
def send_subtask_deadline_notification(self, subtask_id):
    try:
        subtask = Subtask.objects.get(id=subtask_id)
        if not subtask.assignee or not subtask.assignee.email:
            logger.warning(f"No assignee for subtask {subtask_id}")
            return

        logger.info(f"Sending email for subtask {subtask_id} to {subtask.assignee.email}")

        email_content = SubtaskEmailTemplates.render_deadline_email(subtask)
        logger.info(email_content)

        send_mail(
            subject=email_content["subject"],
            message=email_content["message"],
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subtask.assignee.email],
            fail_silently=False,
        )

        logger.info(f"Email sent successfully to {subtask.assignee.email}")

    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}", exc_info=True)
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True)
def send_subtask_update_notification(self, subtask_id, is_new=False):
    try:
        subtask = Subtask.objects.get(id=subtask_id)

        if not subtask.assignee or not subtask.assignee.email:
            logger.warning(f"No assignee for subtask {subtask_id}")
            return

        logger.info(f"Sending update email for subtask {subtask_id} to {subtask.assignee.email}")

        email_content = SubtaskEmailTemplates.render_update_email(subtask, is_new)

        send_mail(
            subject=email_content["subject"],
            message=email_content["message"],
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subtask.assignee.email],
            fail_silently=False,
        )

        logger.info(f"Update email sent successfully to {subtask.assignee.email}")

    except Exception as e:
        logger.error(f"Failed to send update email: {str(e)}", exc_info=True)
        raise self.retry(exc=e, countdown=60)
