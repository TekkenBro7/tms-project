# Task Management System (TMS)

The Task Management System (TMS) is a REST API built with Django and Django REST Framework for managing tasks. It uses PostgreSQL as the primary database, Redis for caching, and Docker for containerization. Dependencies are managed with Poetry, and environment variables are handled via django-environ.

![Django](https://img.shields.io/badge/Django-5.2-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-17-blue)
![Redis](https://img.shields.io/badge/Redis-8-red)
![Docker](https://img.shields.io/badge/Docker-✓-blue)

## 📦 Tech Stack

- Django
- PostgreSQL
- Redis
- Docker
- Poetry (for dependency management)
- `django-environ` (for `.env` variables)

## 🚀 Quick Start

### 📁 Clone the Repository

```bash
git clone https://github.com/TekkenBro7/tms-project.git
cd tms-project
```

### ⚙️ Setup `.env` File

Create a `.env` file in your project root based on `.env.example`

### Install Dependencies

Install Poetry if not already installed:
```bash
pip install poetry
```

Install project dependencies
```bash
poetry install
```

Before making any commits, run the following command to set up the pre-commit hooks:
```bash
pre-commit install
```

To test pre-commit hooks without a commit, use
```bash
poetry run pre-commit run --all-files
```

### 🐳 Running with Docker

To start the app using Docker:
```bash
docker-compose up --build
```
And make sure that the `env` file states `POSTGRES_HOST=db`

- Django will run on `http://localhost:8000`
- PostgreSQL is available at port `5432`
- Redis runs on port `6379`

### Run Locally (Without Docker)

1. Ensure PostgreSQL and Redis are installed and running:
2. Create a PostgreSQL database and grant privileges
3. Apply migrations
```bash
poetry run python src/manage.py migrate
```
4. Create a superuser
```bash
poetry run python src/manage.py createsuperuser
```
5. Make sure that the `env` file specifies `POSTGRES_HOST=localhost` 
6. Start the development server
```bash
poetry run python src/manage.py runserver
```
