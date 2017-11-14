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
    console.error(errorThrown)
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

let createChart = (dataset, labels) => {
  if (window.chart) window.chart.destroy()
  var ctx = document.getElementById("portfolio-value-chart").getContext('2d')
  window.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Portfolio',
          data: dataset.portfolio,
          backgroundColor: ['rgba(98, 105, 142, 0.2)'],
          borderColor: ['rgba(98, 105, 142, 1)'],
          borderWidth: 1
        },
        {
          label: 'Bitcoin',
          data: dataset.bitcoin,
          backgroundColor: ['rgba(255, 194, 69, 0.2)'],
          borderColor: ['rgba(255, 194, 69, 1)'],
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      legend: {
        display: true
      },
      tooltips: {
        enabled: true,
        mode: 'x',
        displayColors: true,
        callbacks: {
          labelColor: (tooltipItem, chart) => {
            let dataset = chart.config.data.datasets[tooltipItem.datasetIndex]
            return {
              borderColor: dataset.borderColor[0],
              backgroundColor: dataset.backgroundColor[0]
            }
          },
          label: (tooltipItem, data) => {
            return ' ' + tooltipItem.yLabel.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'
          }
        }
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
          },
          ticks: {
            maxTicksLimit: 5,
            beginAtZero: false,
            callback: (value, index, values) => {
              if (parseInt(value) >= 1000) {
                return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'
              } else {
                return value + '%'
              }
            }
          }
        }]
      }
    }
  })
}
