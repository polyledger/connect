$('button#link-btn').attr('disabled', true)

$(document).on('change keyup paste', 'input[name=amount]', (event) => {
  if ($(event.currentTarget).val().length > 0) {
    $('button#link-btn').attr('disabled', false)
  } else {
    $('button#link-btn').attr('disabled', true)
  }
})
