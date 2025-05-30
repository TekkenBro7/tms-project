import logging
import os

from django.conf import settings
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from users.models import User

logger = logging.getLogger(__name__)


class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=False, allow_blank=True, style={"input_type": "password"}
    )

    def create(self, validated_data):
        if "password" not in validated_data or not validated_data["password"]:
            raise serializers.ValidationError({"password": "This field is required for creation"})
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)

    def update(self, instance, validated_data):
        new_avatar = validated_data.get("avatar", None)

        if new_avatar is not None:
            if instance.avatar:
                old_avatar_path = os.path.join(settings.MEDIA_ROOT, str(instance.avatar))
                if os.path.isfile(old_avatar_path):
                    try:
                        os.remove(old_avatar_path)
                        logger.info(f"Old avatar deleted for user {instance.username}: {old_avatar_path}")
                    except Exception as e:
                        logger.error(f"Failed to delete old avatar for user {instance.username}: {e}")
        else:
            validated_data.pop("avatar", None)

        password = validated_data.pop("password", None)
        if password:
            instance.set_password(password)

        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "avatar",
            "password",
        ]
        read_only_fields = ["id"]


class UserDetailSerializer(UserSerializer):
    class Meta(UserSerializer.Meta):
        fields = UserSerializer.Meta.fields + [
            "is_superuser",
            "last_login",
            "date_joined",
        ]
        read_only_fields = UserSerializer.Meta.read_only_fields + [
            "is_superuser",
            "last_login",
            "date_joined",
        ]
