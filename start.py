import subprocess
import sys


def run_django_server():
    print("Starting Django server...")
    django_process = subprocess.Popen(["poetry", "run", "python", "src/manage.py", "runserver"])
    return django_process


def run_react_server():
    print("Starting React server...")
    react_process = subprocess.Popen(["cmd", "/c", "npm start"], cwd="frontend")
    return react_process


if __name__ == "__main__":
    try:
        django = run_django_server()
        react = run_react_server()
        django.wait()
        react.wait()
    except KeyboardInterrupt:
        print("Shutting down servers...")
        django.kill()
        react.kill()
        sys.exit(0)
