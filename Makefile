clean-pyc:
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__/" -exec rm -rf {} \;

lint:
	find account api custodian polyledger -name "*.py" | xargs pylint \
	--rcfile=.pylintrc

test: clean-pyc
	./manage.py test

.PHONY: clean-pyc lint test

help:
	@echo "clean-pyc"
	@echo "    Remove python artifacts."
	@echo "lint"
	@echo "    Lint project files with Pylint."
	@echo "test"
	@echo "    Run test suite."
