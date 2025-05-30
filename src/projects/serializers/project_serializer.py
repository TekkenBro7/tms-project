from rest_framework import serializers

from projects.models import Project, StatusChoices
from projects.serializers.task_serializer import TaskSerializer


class ProjectSerializer(serializers.ModelSerializer):
    tasks = TaskSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source="owner.get_full_name", read_only=True)
    members_count = serializers.SerializerMethodField()
    progress = serializers.SerializerMethodField()

    class Meta:
        model = Project
        fields = "__all__"
        read_only_fields = ["id", "created_at", "updated_at"]

    def get_members_count(self, obj):
        return obj.members.count()

    def get_progress(self, obj):
        tasks = obj.tasks.all()
        if not tasks.exists():
            return 0
        completed = tasks.filter(status=StatusChoices.DONE).count()
        return round(completed / tasks.count() * 100)


class ProjectListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = ["id", "name", "description"]
        read_only_fields = ["id"]
