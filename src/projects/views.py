from typing import Optional, Type

from rest_framework import serializers, viewsets

from projects.models import Project, Subtask, Task
from projects.serializers.project_serializer import (
    ProjectListSerializer,
    ProjectSerializer,
)
from projects.serializers.subtask_serializer import (
    SubtaskListSerializer,
    SubtaskSerializer,
)
from projects.serializers.task_serializer import (
    TaskListSerializer,
    TaskSerializer,
)


class BaseViewSet(viewsets.ModelViewSet):
    list_serializer_class: Optional[Type[serializers.Serializer]] = None
    detail_serializer_class: Optional[Type[serializers.Serializer]] = None

    def get_serializer_class(self):
        if self.action == "list" and self.list_serializer_class is not None:
            return self.list_serializer_class
        return self.detail_serializer_class


class ProjectViewSet(BaseViewSet):
    queryset = Project.objects.all()
    list_serializer_class = ProjectListSerializer
    detail_serializer_class = ProjectSerializer


class TaskViewSet(BaseViewSet):
    queryset = Task.objects.all()
    list_serializer_class = TaskListSerializer
    detail_serializer_class = TaskSerializer


class SubtaskViewSet(BaseViewSet):
    queryset = Subtask.objects.all()
    list_serializer_class = SubtaskListSerializer
    detail_serializer_class = SubtaskSerializer
