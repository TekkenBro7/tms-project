from celery import shared_task
from django.conf import settings
from django.core.mail import EmailMultiAlternatives

from core.logging import logger
from projects.models import Subtask
from projects.services.email_templates import SubtaskEmailTemplates


@shared_task(bind=True)
def send_subtask_deadline_notification(self, subtask_id):
    try:
        subtask = Subtask.objects.get(id=subtask_id)
        if not subtask.assignee or not subtask.assignee.email:
            logger.warning(f"No assignee for subtask {subtask_id}")
            return

        email_content = SubtaskEmailTemplates.render_deadline_email(subtask)

        msg = EmailMultiAlternatives(
            subject=email_content["subject"],
            body=email_content["text"],
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subtask.assignee.email],
        )
        msg.attach_alternative(email_content["html"], "text/html")
        msg.send()

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

        email_content = SubtaskEmailTemplates.render_update_email(subtask, is_new)

        msg = EmailMultiAlternatives(
            subject=email_content["subject"],
            body=email_content["text"],
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[subtask.assignee.email],
        )
        msg.attach_alternative(email_content["html"], "text/html")
        msg.send()

        logger.info(f"Update email sent successfully to {subtask.assignee.email}")

    except Exception as e:
        logger.error(f"Failed to send update email: {str(e)}", exc_info=True)
        raise self.retry(exc=e, countdown=60)
