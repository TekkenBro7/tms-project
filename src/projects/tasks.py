import logging

from celery import shared_task
from django.conf import settings
from django.core.mail import send_mail

from projects.models import Subtask

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def send_subtask_deadline_notification(self, subtask_id):
    try:
        subtask = Subtask.objects.get(id=subtask_id)
        if not subtask.assignee or not subtask.assignee.email:
            logger.warning(f"No assignee for subtask {subtask_id}")
            return

        logger.info(f"Sending email for subtask {subtask_id} to {subtask.assignee.email}")

        send_mail(
            subject=f'Reminder: Subtask "{subtask.title}" is due tomorrow!',
            message=f"""Subtask: {subtask.title}
                        Task: {subtask.task.title}
                        Project: {subtask.task.project.name}
                        Deadline: {subtask.deadline.strftime("%Y-%m-%d %H:%M")}

                        Please make sure to complete it on time.""",
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

        if is_new:
            subject = f'New subtask assigned: "{subtask.title}"'
            message = f"""You have been assigned a new subtask:
                        Subtask: {subtask.title}
                        Task: {subtask.task.title}
                        Project: {subtask.task.project.name}
                        Status: {subtask.get_status_display()}
                        Deadline: {subtask.deadline.strftime("%Y-%m-%d") if subtask.deadline else "Not set"}

                        Please check it in your task list."""
        else:
            subject = f'Subtask updated: "{subtask.title}"'
            message = f"""Your subtask has been updated:
                        Subtask: {subtask.title}
                        Task: {subtask.task.title}
                        Project: {subtask.task.project.name}
                        New Status: {subtask.get_status_display()}
                        Deadline: {subtask.deadline.strftime("%Y-%m-%d") if subtask.deadline else "Not set"}

                        Please check the updates."""

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[subtask.assignee.email],
            fail_silently=False,
        )
        logger.info(f"Update email sent successfully to {subtask.assignee.email}")

    except Exception as e:
        logger.error(f"Failed to send update email: {str(e)}", exc_info=True)
        raise self.retry(exc=e, countdown=60)
