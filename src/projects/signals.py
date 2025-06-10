import logging
from datetime import timedelta

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import localtime

from projects.models import Subtask
from projects.tasks import send_subtask_deadline_notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Subtask)
def check_subtask_deadline(sender, instance, **kwargs):
    if instance.deadline:
        tomorrow = localtime().date() + timedelta(days=1)
        logger.info(f"Today date: {localtime().date()}, Tommorow: {tomorrow}, Deadline: {instance.deadline}")
        if instance.deadline == tomorrow and instance.assignee:
            send_subtask_deadline_notification.delay(instance.id)
