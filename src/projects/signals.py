import logging
from datetime import timedelta

from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.timezone import localtime

from projects.models import Subtask
from projects.tasks import send_subtask_notification

logger = logging.getLogger(__name__)


@receiver(post_save, sender=Subtask)
def handle_subtask_updates(sender, instance, created, **kwargs):
    if not instance.assignee:
        return

    deadline_tomorrow = False
    if instance.deadline:
        tomorrow = localtime().date() + timedelta(days=1)
        deadline_tomorrow = instance.deadline == tomorrow

    assignee_changed = instance.tracker.has_changed("assignee")
    status_changed = "status" in instance.tracker.changed()

    if created or assignee_changed or status_changed or deadline_tomorrow:
        send_subtask_notification.delay(instance.id, is_new=created, is_deadline=deadline_tomorrow)
        logger.info(f"Subtask notification sent to {instance.assignee.email}")
