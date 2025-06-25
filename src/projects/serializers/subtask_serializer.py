from rest_framework import serializers

from projects.models import Subtask


class SubtaskSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    assignee_name = serializers.CharField(source="assignee.get_full_name", read_only=True)
    task_title = serializers.CharField(source="task.title", read_only=True)
    project_title = serializers.CharField(source="task.project.name", read_only=True)
    project_is_active = serializers.BooleanField(source="task.project.is_active", read_only=True)

    class Meta:
        model = Subtask
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "completed_at"]


class SubtaskListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)

    class Meta:
        model = Subtask
        fields = ["id", "title", "status", "status_display", "deadline"]
        read_only_fields = ["id"]
