from rest_framework import viewsets

from .models import Project, Subtask, Task
from .serializers import (
    ProjectListSerializer,
    ProjectSerializer,
    SubtaskListSerializer,
    SubtaskSerializer,
    TaskListSerializer,
    TaskSerializer,
)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return ProjectListSerializer
        return ProjectSerializer


class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return TaskListSerializer
        return TaskSerializer


class SubtaskViewSet(viewsets.ModelViewSet):
    queryset = Subtask.objects.all()

    def get_serializer_class(self):
        if self.action == "list":
            return SubtaskListSerializer
        return SubtaskSerializer
