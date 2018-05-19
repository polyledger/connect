import validator from "validator";

/* Class representing form with validation rules */
class FormValidator {
  /**
   * Create a form with validation rules
   * @param {Object[]} validations - The validations to perform
   */
  constructor(validations) {
    this.validations = validations;
  }

  /**
   * Validates the form.
   * @param {Object} form - A component's form object
   */
  validate(form) {
    let validation = this.getInitialState();

    this.validations.forEach(rule => {
      if (!validation[rule.field].isInvalid) {
        const fieldValue = form[rule.field].toString();
        const args = rule.args || [];
        const validationMethod =
          typeof rule.method === "string"
            ? validator[rule.method]
            : rule.method;

        if (validationMethod(fieldValue, ...args, form) !== rule.validWhen) {
          // Set field to invalid
          validation[rule.field] = {
            isInvalid: true,
            message: rule.message
          };
          // Set form to invalid
          validation.isValid = false;
        }
      }
    });
    return validation;
  }

  /**
   * Create an initial validation state. Assume everything is valid.
   */
  getInitialState() {
    const validation = {};

    this.validations.forEach(rule => {
      validation[rule.field] = { isInvalid: false, message: "" };
    });

    return { isValid: true, ...validation };
  }
}

export default FormValidator;
