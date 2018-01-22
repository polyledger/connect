clean-pyc:
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__/" -exec rm -rf {} \;

lint:
	find api -type f -name "*.py" ! -path "api/migrations/*" | xargs flake8

test: clean-pyc
	./manage.py test

.PHONY: clean-pyc lint test

help:
	@echo "clean-pyc"
	@echo "    Remove python artifacts."
	@echo "lint"
	@echo "    Lint project files with Flake8."
	@echo "test"
	@echo "    Run test suite."
