from django.urls import include, path
from rest_framework.routers import DefaultRouter

from users.views.auth import CustomTokenObtainPairView, CustomTokenRefreshView, LogoutView, VerifyAuthView
from users.views.user import UserViewSet

router = DefaultRouter()
router.register("users", UserViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("auth/login/", CustomTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("auth/refresh/", CustomTokenRefreshView.as_view(), name="token_refresh"),
    path("auth/logout/", LogoutView.as_view(), name="auth_logout"),
    path("auth/verify/", VerifyAuthView.as_view(), name="auth_verify"),
]
