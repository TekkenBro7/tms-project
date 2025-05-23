import logging
import os

from django.db.models.signals import post_delete
from django.dispatch import receiver

from .models import User

logger = logging.getLogger(__name__)


@receiver(post_delete, sender=User)
def delete_avatar_on_user_delete(sender, instance, **kwargs):
    if instance.avatar:
        avatar_path = instance.avatar.path
        if os.path.isfile(avatar_path):
            try:
                os.remove(avatar_path)
                logger.info(f"Avatar deleted for user {instance.username}: {avatar_path}")
            except Exception as e:
                logger.error(f"Failed to delete avatar for user {instance.username}: {e}")
