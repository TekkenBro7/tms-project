from celery import shared_task

from core.logging import logger
from projects.email_templates import SubtaskEmailTemplates
from projects.models import Subtask
from projects.services.send_subtask_email import send_email


@shared_task(bind=True)
def send_subtask_deadline_notification(self, subtask_id):
    try:
        subtask = Subtask.objects.get(id=subtask_id)
        if not subtask.assignee or not subtask.assignee.email:
            logger.warning(f"No assignee for subtask {subtask_id}")
            return

        email_content = SubtaskEmailTemplates.render_deadline_email(subtask)
        send_email(
            recipient_email=subtask.assignee.email,
            subject=email_content["subject"],
            text_content=email_content["text"],
            html_content=email_content["html"],
        )

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
        send_email(
            recipient_email=subtask.assignee.email,
            subject=email_content["subject"],
            text_content=email_content["text"],
            html_content=email_content["html"],
        )

    except Exception as e:
        logger.error(f"Failed to send update email: {str(e)}", exc_info=True)
        raise self.retry(exc=e, countdown=60)