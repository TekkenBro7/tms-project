import os
import random
from datetime import datetime, timedelta

import django
from django.contrib.auth import get_user_model
from faker import Faker

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

from projects.models import Project, Subtask, Task  # noqa: E402

User = get_user_model()
fake = Faker()


def delete_old_data():
    print("Deleting old data...")
    Subtask.objects.all().delete()
    Task.objects.all().delete()
    Project.objects.all().delete()
    User.objects.exclude(is_superuser=True).delete()


def create_users():
    print("Creating users...")

    for i in range(1, 6):
        User.objects.create_user(
            username=f"user{i}",
            email=fake.email(),
            password=f"password{i}",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
        )
    users = list(User.objects.all())
    return users


def create_projects(users):
    print("Creating projects...")
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


def create_tasks(projects, users):
    print("Creating tasks...")
    tasks = []
    priority_choices = ["low", "medium", "high", "urgent"]
    has_overdue_task = False

    task_templates = {
        "Corporate Website": [
            (
                "Homepage Development",
                "Implement responsive homepage with hero section, navigation and footer",
                "in_progress",
            ),
            ("CMS Integration", "Integrate WordPress CMS for content management", "todo"),
            ("Contact Form", "Develop contact form with validation and email notifications", "todo"),
            ("SEO Optimization", "Implement meta tags, sitemap and SEO-friendly URLs", "in_review"),
            ("Performance Audit", "Analyze and optimize page load speed", "todo"),
        ],
        "E-commerce Electronics Store": [
            ("Product Catalog", "Develop product listing with filters and search", "in_progress"),
            ("Payment Gateway", "Integrate Stripe payment processing", "done"),
            ("Shopping Cart", "Implement cart functionality with persistent storage", "in_qa"),
            ("User Dashboard", "Create account management interface", "todo"),
            ("Order Processing", "Develop order confirmation and tracking system", "in_progress"),
        ],
        "Mobile Booking App": [
            ("UI Design", "Create Figma mockups for all screens", "done"),
            ("Auth System", "Implement OAuth2 authentication flow", "in_progress"),
            ("Booking Flow", "Develop service selection and booking process", "in_review"),
            ("Payment Integration", "Add in-app payment processing", "todo"),
            ("Push Notifications", "Implement booking status notifications", "todo"),
        ],
        "Educational Courses Web Portal": [
            ("Video Platform", "Develop adaptive video player with subtitles", "in_progress"),
            ("Testing System", "Create quiz functionality with scoring", "todo"),
            ("Progress Tracking", "Implement student progress dashboard", "in_qa"),
            ("Course Builder", "Develop interface for instructors to create courses", "todo"),
            ("Certificates", "Implement PDF certificate generation", "in_progress"),
        ],
    }

    for project in projects:
        project_tasks = task_templates.get(project.name, [])

        for title, description, status in project_tasks:
            if not has_overdue_task and project == projects[0] and title == project_tasks[0][0]:
                deadline = datetime.now() - timedelta(days=3)
                has_overdue_task = True
            else:
                deadline = datetime.now() + timedelta(days=random.randint(4, 14))

            task = Task.objects.create(
                project=project,
                title=title,
                description=description,
                status=status,
                priority=random.choice(priority_choices),
                author=random.choice([u for u in users if u.is_superuser]),
                assignee=random.choice([u for u in users if not u.is_superuser]),
                deadline=deadline.date(),
            )

            if status == "done":
                task.completed_at = deadline - timedelta(days=random.randint(1, 3))
                task.save()

            tasks.append(task)

    return tasks


def create_subtasks(tasks, users):
    print("Creating subtasks...")
    has_overdue_subtask = False

    subtask_templates = {
        # Corporate Website
        "Homepage Development": [
            ("Design hero section layout", "done"),
            ("Implement responsive navigation", "in_progress"),
            ("Create footer with contact info", "in_progress"),
            ("Optimize for mobile devices", "todo"),
            ("Add interactive elements", "todo"),
        ],
        "CMS Integration": [
            ("Set up WordPress installation", "done"),
            ("Configure theme settings", "in_progress"),
            ("Create custom post types", "in_progress"),
            ("Implement WYSIWYG editor", "todo"),
            ("Train content editors", "todo"),
        ],
        "Contact Form": [
            ("Design form layout", "done"),
            ("Implement field validation", "in_progress"),
            ("Set up email notifications", "todo"),
            ("Add spam protection", "todo"),
            ("Test form submissions", "todo"),
        ],
        "SEO Optimization": [
            ("Research keywords", "done"),
            ("Implement meta tags", "in_progress"),
            ("Create XML sitemap", "in_progress"),
            ("Optimize URL structure", "todo"),
            ("Set up Google Analytics", "todo"),
        ],
        "Performance Audit": [
            ("Run Lighthouse tests", "done"),
            ("Optimize image assets", "in_progress"),
            ("Minify CSS/JS", "todo"),
            ("Implement lazy loading", "todo"),
            ("Set up caching", "todo"),
        ],
        # E-commerce Electronics Store
        "Product Catalog": [
            ("Design product card UI", "done"),
            ("Implement category filters", "in_progress"),
            ("Add search functionality", "in_progress"),
            ("Create pagination system", "todo"),
            ("Optimize for fast loading", "todo"),
        ],
        "Payment Gateway": [
            ("Research payment providers", "done"),
            ("Set up Stripe account", "done"),
            ("Implement checkout flow", "done"),
            ("Test transaction processing", "in_qa"),
            ("Add refund functionality", "todo"),
        ],
        "Shopping Cart": [
            ("Design cart UI", "done"),
            ("Implement add/remove items", "done"),
            ("Create persistent storage", "in_qa"),
            ("Add quantity controls", "todo"),
            ("Implement coupon codes", "todo"),
        ],
        "User Dashboard": [
            ("Design account pages", "done"),
            ("Implement login system", "in_progress"),
            ("Create order history", "todo"),
            ("Add address book", "todo"),
            ("Implement password reset", "todo"),
        ],
        "Order Processing": [
            ("Design order confirmation", "done"),
            ("Implement email notifications", "in_progress"),
            ("Create order status tracking", "todo"),
            ("Add cancellation options", "todo"),
            ("Integrate with shipping API", "todo"),
        ],
        # Mobile Booking App
        "UI Design": [
            ("Create style guide", "done"),
            ("Design main screens", "done"),
            ("Prototype user flows", "done"),
            ("Review with stakeholders", "in_progress"),
            ("Finalize assets for dev", "todo"),
        ],
        "Auth System": [
            ("Design login screens", "done"),
            ("Implement email/password auth", "in_progress"),
            ("Add Google/Facebook login", "in_progress"),
            ("Set up JWT tokens", "todo"),
            ("Implement password recovery", "todo"),
        ],
        "Booking Flow": [
            ("Design service selection", "done"),
            ("Implement calendar widget", "in_progress"),
            ("Create booking form", "in_review"),
            ("Add confirmation screen", "todo"),
            ("Implement cancellation", "todo"),
        ],
        "Payment Integration": [
            ("Research mobile payment options", "done"),
            ("Implement Apple Pay", "in_progress"),
            ("Add Google Pay", "todo"),
            ("Test transaction flow", "todo"),
            ("Handle payment errors", "todo"),
        ],
        "Push Notifications": [
            ("Set up Firebase", "done"),
            ("Design notification content", "in_progress"),
            ("Implement booking reminders", "todo"),
            ("Add status updates", "todo"),
            ("Test on devices", "todo"),
        ],
        # Educational Courses Web Portal
        "Video Platform": [
            ("Choose video hosting", "done"),
            ("Implement player controls", "in_progress"),
            ("Add playback speed options", "in_progress"),
            ("Enable subtitles support", "todo"),
            ("Implement progress tracking", "todo"),
        ],
        "Testing System": [
            ("Design question types", "done"),
            ("Implement multiple choice", "in_progress"),
            ("Create scoring system", "todo"),
            ("Add timer functionality", "todo"),
            ("Implement result analysis", "todo"),
        ],
        "Progress Tracking": [
            ("Design dashboard layout", "done"),
            ("Implement course completion", "in_progress"),
            ("Create achievement badges", "todo"),
            ("Add progress charts", "todo"),
            ("Set up notifications", "todo"),
        ],
        "Course Builder": [
            ("Design instructor interface", "done"),
            ("Implement content editor", "in_progress"),
            ("Add media uploads", "todo"),
            ("Create quiz builder", "todo"),
            ("Implement publishing flow", "todo"),
        ],
        "Certificates": [
            ("Design certificate template", "done"),
            ("Implement PDF generation", "in_progress"),
            ("Add verification system", "todo"),
            ("Create sharing options", "todo"),
            ("Test printing quality", "todo"),
        ],
    }

    for task in tasks:
        for title, status in subtask_templates[task.title]:
            if not has_overdue_subtask:
                subtask_deadline = datetime.now() - timedelta(days=2)
                has_overdue_subtask = True
            else:
                subtask_deadline = task.deadline - timedelta(days=random.randint(1, 3))

            subtask = Subtask.objects.create(
                task=task,
                title=title,
                status=status,
                assignee=random.choice([u for u in users if not u.is_superuser]),
                deadline=subtask_deadline,
            )

            if status == "done":
                subtask.completed_at = subtask_deadline - timedelta(days=random.randint(0, 2))
                subtask.save()


if __name__ == "__main__":
    delete_old_data()
    users = create_users()
    projects = create_projects(users)
    tasks = create_tasks(projects, users)
    create_subtasks(tasks, users)
    print("Database populated with realistic development data!")
