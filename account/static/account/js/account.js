$('button#link-btn').attr('disabled', true)

// Disable link bank account button unless a transfer amount is entered
$(document).on('change keyup paste', 'input[name=amount]', (event) => {
  if ($(event.currentTarget).val().length > 0) {
    $('button#link-btn').attr('disabled', false)
  } else {
    $('button#link-btn').attr('disabled', true)
  }
})

// Update the current slider value (each time you drag the slider handle)
$(document).on('input', '#risk-score-slider', (event) => {
  let value = $(event.currentTarget).val()
  $('#risk-score-output').text(value)
})

let getHistoricalData = (period) => {
  $.ajax(`/account/historical_value/?period=${period}`).then((data, textStatus, jqXHR) => {
    let dataset = data.dataset
    let labels = data.labels
    let percentChange = data.percent_change
    $percentChangeEl = $('#percent-change')
    $percentChangeEl.text(percentChange)

    // Set badge class based on non-negativity
    let badgeClass
    percentChange[0] !== '-' ? badgeClass = 'badge-success' : badgeClass = 'badge-danger'
    $percentChangeEl.addClass(badgeClass)
  }, (jqXHR, textStatus, errorThrown) => {
    console.error(errorThrown)
  })
}

if (window.location.pathname === '/account/') {
  // Format money input values as numerals
  var cleave = new Cleave('.usd-input', {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
  })

  // GET historical data points and percent change for account index
  getHistoricalData('1d')

  $(document).on('click', '#historical-value-tabs', (event) => {
    let period = event.target.textContent
    getHistoricalData(period)
  })
}
