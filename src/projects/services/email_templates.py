from django.template.loader import render_to_string


class SubtaskEmailTemplates:
    @staticmethod
    def render_deadline_email(subtask):
        context = {
            "title": subtask.title,
            "task_title": subtask.task.title,
            "project_name": subtask.task.project.name,
            "deadline": subtask.deadline.strftime("%Y-%m-%d %H:%M"),
            "assignee_name": subtask.assignee.get_full_name() or subtask.assignee.username,
        }

        return {
            "subject": f'Reminder: Subtask "{subtask.title}" is due tomorrow!',
            "message": render_to_string("emails/subtask_deadline.txt", context),
        }

    @staticmethod
    def render_update_email(subtask, is_new=False):
        context = {
            "title": subtask.title,
            "task_title": subtask.task.title,
            "project_name": subtask.task.project.name,
            "deadline": subtask.deadline.strftime("%Y-%m-%d %H:%M") if subtask.deadline else "Not set",
            "status": subtask.get_status_display(),
            "assignee_name": subtask.assignee.get_full_name() or subtask.assignee.username,
            "is_new": is_new,
        }

        return {
            "subject": f'{"New" if is_new else "Updated"} subtask: "{subtask.title}"',
            "message": render_to_string("emails/subtask_update.txt", context),
        }
