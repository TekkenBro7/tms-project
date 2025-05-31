from typing import List, Type

from rest_framework import status
from rest_framework.permissions import AllowAny, BasePermission
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from users.models import User
from users.serializers import UserSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            user = User.objects.get(username=request.data["username"])
            serializer = UserSerializer(user, context={"request": request})
            response.data["user"] = serializer.data

        return response


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)

            if response.status_code == 200:
                try:
                    refresh = RefreshToken(request.data["refresh"])
                    user_id = refresh.payload.get("user_id")
                    user = User.objects.get(id=user_id)

                    serializer = UserSerializer(user, context={"request": request})
                    response.data["user"] = serializer.data
                except Exception as e:
                    print(f"Error adding user data to refresh: {e}")

            return response
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    permission_classes: List[Type[BasePermission]] = [AllowAny]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response(status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
