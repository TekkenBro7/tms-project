from django.urls import include, path
from rest_framework.routers import DefaultRouter

from projects.views import ProjectViewSet, SubtaskViewSet, TaskViewSet

router = DefaultRouter()
router.register("projects", ProjectViewSet)
router.register("tasks", TaskViewSet)
router.register("subtasks", SubtaskViewSet)

urlpatterns = [
    path("", include(router.urls)),
]
