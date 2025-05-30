from django.db.models.signals import post_save
from django.dispatch import receiver

from projects.models import StatusChoices, Subtask


@receiver(post_save, sender=Subtask)
def update_parent_task_status(sender, instance, **kwargs):
    task = instance.task
    subtasks = task.subtasks.all()

    if not subtasks.exists():
        return

    if all(sub.status == StatusChoices.DONE for sub in subtasks):
        task.status = StatusChoices.DONE
    elif any(sub.status == StatusChoices.IN_PROGRESS for sub in subtasks):
        task.status = StatusChoices.IN_PROGRESS
    else:
        task.status = StatusChoices.TODO

    task.save()
