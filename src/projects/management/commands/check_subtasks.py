from datetime import timedelta

from django.core.management.base import BaseCommand
from django.utils.timezone import localtime

from projects.models import Subtask
from projects.tasks import send_subtask_deadline_notification


class Command(BaseCommand):
    help = "Checks for subtasks with a deadline tomorrow and schedules Celery notifications"

    def handle(self, *args, **options):
        tomorrow = localtime().date() + timedelta(days=1)
        subtasks = Subtask.objects.filter(
            deadline=tomorrow, assignee__isnull=False, status__in=["todo", "in_progress"]
        ).select_related("assignee", "task", "task__project")

        count = 0
        for subtask in subtasks:
            send_subtask_deadline_notification.delay(subtask.id)
            count += 1
            self.stdout.write(f"Scheduled: {subtask.title} -> {subtask.assignee.email}")

        self.stdout.write(self.style.SUCCESS(f"Total scheduled tasks: {count}"))
