$('button#link-btn').attr('disabled', true)

$(() => {
  $('[data-toggle="tooltip"]').tooltip()
})

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

$(document).on('click', '.nav-pills > .nav-item', (event) => {
  event.preventDefault()
  $('#portfolio-value-chart').hide()
  $('#spinner').show()
  $('a.nav-link').removeClass('active')
  $el = $(event.currentTarget)
  $el.find('a.nav-link').addClass('active')
  let period = $el.text().replace(/ /g,'')
  getHistoricalData(period)
})

let selected = $('.border-success').length

if (selected < 2) {
  $('#confirm-coins').prop('disabled', true)
}

$('.coin-card').click((event) => {
  let $el = $(event.currentTarget)

  if ($el.hasClass('border-success')) {
    $el.removeClass('border-success')
    selected--
    $el.children('input').val(false)
  } else {
    $el.addClass('border-success')
    selected++
    $el.children('input').val(true)
  }

  if (selected < 2) {
    $('#confirm-coins').prop('disabled', true)
  } else {
    $('#confirm-coins').prop('disabled', false)
  }
})

$('.coin-card').on({
  mouseenter (event) {
    let $el = $(event.currentTarget)
    $el.css({'backgroundColor': '#eee', 'cursor': 'pointer'})
  },
  mouseleave (event) {
    let $el = $(event.currentTarget)
    $el.css({'backgroundColor': '#fff', 'cursor': 'auto'})
  }
})

let getHistoricalData = (period) => {
  $('#error').empty()
  $.ajax(`/account/historical_value/?period=${period}`).then((data, textStatus, jqXHR) => {
    $('#portfolio-value-chart').show()
    $('#spinner').hide()
    let dataset = data.dataset
    dataset.portfolio = dataset.portfolio.map(x => x - 100)
    dataset.bitcoin = dataset.bitcoin.map(x => x - 100)
    let labels = data.labels
    let percentChange = data.percent_change
    $percentChangeEl = $('#percent-change')
    $percentChangeEl.text(percentChange)
    $percentChangeEl.removeClass('badge-success badge-danger')
    // Set badge class based on non-negativity
    let badgeClass
    percentChange[0] !== '-' ? badgeClass = 'badge-success' : badgeClass = 'badge-danger'
    $percentChangeEl.addClass(badgeClass)
    createChart(dataset, labels)
  }, (jqXHR, textStatus, errorThrown) => {
    $('#spinner').hide()
    $('#error').append(`
      <div style="height: 270px;" class="d-flex align-items-center justify-content-center">
        <h5 class="text-center">No data was found for this timeframe.</h5>
      </div>
    `)
  })
}

if (window.location.pathname === '/account/deposit/') {
  // Format money input values as numerals
  var cleave = new Cleave('.usd-input', {
    numeral: true,
    numeralThousandsGroupStyle: 'thousand'
  })
}

if (window.location.pathname === '/account/') {
  if ($('#portfolio-value-chart').length) {
    $('#portfolio-value-chart').hide()
    $('#spinner').show()
    getHistoricalData('7D')
  }
}
