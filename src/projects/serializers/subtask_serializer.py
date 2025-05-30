from rest_framework import serializers

from projects.models import Subtask


class SubtaskSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source="get_status_display", read_only=True)
    assignee_name = serializers.CharField(source="assignee.get_full_name", read_only=True)

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
