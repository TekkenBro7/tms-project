import logging
import random
from datetime import datetime, timedelta

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from faker import Faker

from projects.models import Project, Subtask, Task

logger = logging.getLogger(__name__)
User = get_user_model()


class Command(BaseCommand):
    help = "Populates database with realistic web development data"

    def handle(self, *args, **options):
        fake = Faker()

        self.delete_old_data()
        users = self.create_users(fake)
        projects = self.create_projects(fake, users)
        tasks = self.create_tasks(fake, projects, users)
        self.create_subtasks(tasks, users)

        logger.info("Database populated with realistic web development data!")
        self.stdout.write(self.style.SUCCESS("Successfully populated the database"))

    def delete_old_data(self):
        logger.info("Deleting old data...")
        Subtask.objects.all().delete()
        Task.objects.all().delete()
        Project.objects.all().delete()
        User.objects.exclude(is_superuser=True).delete()

    def create_users(self, fake):
        logger.info("Creating users...")

        for i in range(1, 6):
            User.objects.create_user(
                username=f"user{i+5}",
                email=fake.email(),
                password=f"password{i}",
                first_name=fake.first_name(),
                last_name=fake.last_name(),
            )
        return list(User.objects.all())

    def create_projects(self, fake, users):
        logger.info("Creating projects...")
        projects = []

        project_data = [
            {
                "name": "Corporate Website",
                "description": "Development of a modern corporate website with content management system",
                "features": ["Homepage", "About Us", "Services", "Blog", "Contact"],
            },
            {
                "name": "E-commerce Electronics Store",
                "description": "Building a full-featured online store with payment and delivery system",
                "features": ["Product Catalog", "Shopping Cart", "User Account", "Admin Panel"],
            },
            {
                "name": "Mobile Booking App",
                "description": "Development of a cross-platform mobile app for service booking",
                "features": ["Registration", "Service Search", "Booking", "Support Chat"],
            },
            {
                "name": "Educational Courses Web Portal",
                "description": "Creating an online learning platform with video lectures and testing",
                "features": ["Course Catalog", "Video Player", "Tests", "Learning Progress"],
            },
        ]

        for data in project_data:
            description = f"{data['description']}\n\nKey Features:\n" + "\n".join(
                f"- {feature}" for feature in data["features"]
            )

            project = Project.objects.create(
                name=data["name"],
                description=description,
                owner=random.choice([u for u in users if u.is_superuser]),
                is_active=random.choice([True, False]),
            )

            members = random.sample([u for u in users if not u.is_superuser], random.randint(1, 4))
            project.members.set(members)
            projects.append(project)

        return projects

    def create_tasks(self, fake, projects, users):
        logger.info("Creating tasks...")
        tasks = []
        priority_choices = ["low", "medium", "high", "urgent"]

        task_templates = {
            "Corporate Website": [
                ("Homepage Development", "Creating responsive design and layout for homepage", "in_progress"),
                ("CMS Integration", "Setting up content management system", "todo"),
                ("Contact Form Development", "Creating form with validation and email submission", "todo"),
                ("Performance Optimization", "Image compression and code minification", "in_review"),
            ],
            "E-commerce Electronics Store": [
                ("Product Catalog Implementation", "Developing filters and product sorting", "in_progress"),
                ("Payment System Integration", "Connecting Stripe/PayPal for payment processing", "todo"),
                ("Shopping Cart Development", "Add/remove products functionality", "done"),
                ("User Account Creation", "Order history and personal data", "in_qa"),
            ],
            "Mobile Booking App": [
                ("UI Design", "Creating UI/UX design for main screens", "todo"),
                ("Authorization Implementation", "Login system via email and social networks", "in_progress"),
                ("Maps Integration", "Displaying service locations on map", "in_review"),
                ("Notification System Development", "Push notifications for booking status", "todo"),
            ],
            "Educational Courses Web Portal": [
                ("Video Player Development", "Player with seeking and subtitles", "in_progress"),
                ("Testing System", "Creating different question types and result evaluation", "todo"),
                ("Student Dashboard", "Displaying progress and certificates", "in_qa"),
                ("Instructor Admin Panel", "Course and student management", "todo"),
            ],
        }

        for project in projects:
            project_tasks = task_templates.get(project.name, [])

            for title, description, status in project_tasks:
                task = Task.objects.create(
                    project=project,
                    title=title,
                    description=description,
                    status=status,
                    priority=random.choice(priority_choices),
                    author=random.choice([u for u in users if u.is_superuser]),
                    assignee=random.choice([u for u in users if not u.is_superuser]),
                    deadline=datetime.now() + timedelta(days=random.randint(-2, 2)),
                )
                tasks.append(task)

        return tasks

    def create_subtasks(self, tasks, users):
        logger.info("Creating subtasks...")

        default_subtasks = [
            ("Initial research", "done"),
            ("Requirements analysis", "done"),
            ("Basic implementation", "in_progress"),
            ("Testing", "todo"),
            ("Documentation", "todo"),
            ("Final review", "todo"),
        ]

        specific_subtasks = {
            "Homepage Development": [
                ("Design layout", "done"),
                ("Responsive adaptation", "in_progress"),
                ("Performance optimization", "todo"),
            ],
            "CMS Integration": [
                ("System installation", "done"),
                ("Configuration", "in_progress"),
                ("Content migration", "todo"),
            ],
            "Product Catalog Implementation": [
                ("API development", "in_progress"),
                ("Filter implementation", "in_progress"),
                ("Pagination", "todo"),
            ],
            "Notification System Development": [
                ("Service setup", "todo"),
                ("Template design", "todo"),
                ("Integration", "todo"),
            ],
        }

        for task in tasks:
            task_subtasks = specific_subtasks.get(task.title, default_subtasks)

            for title, status in task_subtasks:
                subtask = Subtask.objects.create(
                    task=task,
                    title=title,
                    status=status,
                    assignee=random.choice([u for u in users if not u.is_superuser]),
                    deadline=task.deadline - timedelta(days=random.randint(1, 4)) if task.deadline else None,
                )

                if status == "done":
                    subtask.completed_at = datetime.now() - timedelta(days=random.randint(1, 5))
                    subtask.save()
