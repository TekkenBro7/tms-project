from rest_framework import serializers

from projects.models import Task
from projects.serializers.subtask_serializer import SubtaskSerializer


class TaskSerializer(serializers.ModelSerializer):
    subtasks = SubtaskSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    priority_display = serializers.CharField(source="get_priority_display", read_only=True)
    author_name = serializers.CharField(source="author.get_full_name", read_only=True)
    assignee_name = serializers.CharField(source="assignee.get_full_name", read_only=True)

    class Meta:
        model = Task
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at", "completed_at"]


class TaskListSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    priority_display = serializers.CharField(source="get_priority_display", read_only=True)

    class Meta:
        model = Task
        fields = [
            "id",
            "title",
            "description",
            "status",
            "status_display",
            "priority",
            "priority_display",
            "project",
            "deadline",
        ]
