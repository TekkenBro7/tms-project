import logging
from datetime import timedelta

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import localtime

from projects.models import Subtask
<<<<<<< HEAD
from projects.tasks import send_subtask_deadline_notification, send_subtask_update_notification
=======
from projects.tasks import send_subtask_deadline_notification
>>>>>>> 73cc6e3 (Added notification before deadline of subtask)

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Subtask)
def check_subtask_deadline(sender, instance, **kwargs):
    if instance.deadline:
        tomorrow = localtime().date() + timedelta(days=1)
        logger.info(f"Today date: {localtime().date()}, Tommorow: {tomorrow}, Deadline: {instance.deadline}")
        if instance.deadline == tomorrow and instance.assignee:
            send_subtask_deadline_notification.delay(instance.id)


@receiver(post_save, sender=Subtask)
def handle_subtask_updates(sender, instance, created, **kwargs):
    if created and instance.assignee:
        send_subtask_update_notification.delay(instance.id, is_new=True)
        logger.info(f"New subtask created and assigned, notification sent to {instance.assignee.email}")
    else:
        prev_assignee = instance.tracker.previous("assignee")
        current_assignee = instance.assignee

        if prev_assignee != current_assignee and current_assignee:
            send_subtask_update_notification.delay(instance.id, is_new=False)
            logger.info(f"Subtask assignee changed from {prev_assignee} to {current_assignee}, notification sent")

        if "status" in instance.tracker.changed() and current_assignee:
            send_subtask_update_notification.delay(instance.id, is_new=False)
            logger.info(f"Subtask status changed, notification sent to {current_assignee.email}")
