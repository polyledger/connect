clean-pyc:
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__/" -exec rm -rf {} \;

lint:
	find account api custodian polyledger -name "*.py" | xargs pylint \
	--rcfile=.pylintrc

.PHONY: clean-pyc lint

help:
	@echo "clean-pyc"
	@echo "    Remove python artifacts."
	@echo "lint"
	@echo "    Lint project files with Pyflakes."
