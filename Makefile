clean-pyc:
	find . -name "*.pyc" -exec rm -f {} \;
	find . -name "__pycache__/" -exec rm -rf {} \;

.PHONY: clean-pyc

help:
	@echo "clean-pyc"
	@echo "    Remove python artifacts."
