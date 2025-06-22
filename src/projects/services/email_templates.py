from datetime import datetime

from django.conf import settings
from django.template.loader import render_to_string


class SubtaskEmailTemplates:
    @staticmethod
    def render_combined_email(subtask, is_new=False, is_deadline=False):
        context = {
            "title": subtask.title,
            "task_title": subtask.task.title,
            "project_name": subtask.task.project.name,
            "deadline": subtask.deadline.strftime("%Y-%m-%d %H:%M") if subtask.deadline else "Not set",
            "status": subtask.get_status_display(),
            "assignee_name": subtask.assignee.get_full_name() or subtask.assignee.username,
            "is_new": is_new,
            "is_deadline": is_deadline,
            "site_name": settings.SITE_NAME,
            "current_year": datetime.now().year,
            "task_url": f"{settings.SITE_URL}/subtasks/{subtask.id}/",
        }

        subject_parts = []
        if is_new:
            subject_parts.append("New subtask")
        else:
            subject_parts.append("Updated subtask")

        if is_deadline:
            subject_parts.append("(Due tomorrow)")

        subject = f"{' '.join(subject_parts)}: \"{subtask.title}\""

        return {
            "subject": subject,
            "text": render_to_string("emails/subtask_new_or_changed.txt", context),
            "html": render_to_string("emails/subtask_new_or_changed.html", context),
        }

    @staticmethod
    def render_deadline_email(subtask):
        context = {
            "title": subtask.title,
            "task_title": subtask.task.title,
            "project_name": subtask.task.project.name,
            "deadline": subtask.deadline.strftime("%Y-%m-%d %H:%M"),
            "assignee_name": subtask.assignee.get_full_name() or subtask.assignee.username,
            "site_name": settings.SITE_NAME,
            "current_year": datetime.now().year,
            "task_url": f"{settings.SITE_URL}/subtasks/{subtask.id}/",
        }

        return {
            "subject": f'Reminder: Subtask "{subtask.title}" is due tomorrow!',
            "text": render_to_string("emails/subtask_deadline.txt", context),
            "html": render_to_string("emails/subtask_deadline.html", context),
        }
