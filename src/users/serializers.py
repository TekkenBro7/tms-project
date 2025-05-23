import logging
import os

from django.conf import settings
from django.contrib.auth.hashers import make_password
from rest_framework import serializers

from .models import User

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
            if new_avatar:
                if instance.avatar:
                    old_avatar_path = os.path.join(settings.MEDIA_ROOT, str(instance.avatar))
                    if os.path.isfile(old_avatar_path):
                        try:
                            os.remove(old_avatar_path)
                            logger.info(f"Old avatar deleted for user {instance.username}: {old_avatar_path}")
                        except Exception as e:
                            logger.error(f"Failed to delete old avatar for user {instance.username}: {e}")
            else:
                if instance.avatar:
                    old_avatar_path = os.path.join(settings.MEDIA_ROOT, str(instance.avatar))
                    if os.path.isfile(old_avatar_path):
                        try:
                            os.remove(old_avatar_path)
                            logger.info(f"Old avatar deleted for user {instance.username}: {old_avatar_path}")
                        except Exception as e:
                            logger.error(f"Failed to delete old avatar for user {instance.username}: {e}")
                    instance.avatar = None
                    instance.save()
                validated_data["avatar"] = None
        else:
            validated_data.pop("avatar", None)

        if "password" in validated_data and validated_data["password"]:
            instance.set_password(validated_data["password"])
            validated_data.pop("password")
        else:
            validated_data.pop("password", None)

        return super().update(instance, validated_data)

    class Meta:
        model = User
        fields = ["id", "username", "email", "first_name", "last_name", "avatar", "password"]
        read_only_fields = ["id"]
