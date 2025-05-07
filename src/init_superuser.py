from django.contrib.auth import get_user_model
import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')  # замените на имя вашего проекта
django.setup()

User = get_user_model()

username = os.getenv('DJANGO_SUPERUSER_USERNAME')
password = os.getenv('DJANGO_SUPERUSER_PASSWORD')

if not User.objects.filter(username=username).exists():
    User.objects.create_superuser(username=username, email='', password=password)
    print(f"Superuser '{username}' created.")
else:
    print(f"Superuser '{username}' already exists.")