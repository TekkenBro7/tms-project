from django.contrib import admin

from .models import TestExample


@admin.register(TestExample)
class TestExampleAdmin(admin.ModelAdmin):
    list_display = ("name", "description", "created_at")
    search_fields = ("name",)
