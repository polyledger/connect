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

$(document).on('click', '.nav-pills > .nav-item', (event) => {
  $('#portfolio-value-chart').hide()
  $('#spinner').show()
  $('a.nav-link').removeClass('active')
  $el = $(event.currentTarget)
  $el.find('a.nav-link').addClass('active')
  let period = $el.text().replace(/ /g,'')
  getHistoricalData(period)
})

let getHistoricalData = (period) => {
  $.ajax(`/account/historical_value/?period=${period}`).then((data, textStatus, jqXHR) => {
    $('#portfolio-value-chart').show()
    $('#spinner').hide()
    let dataset = data.dataset
    let labels = data.labels
    let percentChange = data.percent_change
    $percentChangeEl = $('#percent-change')
    $percentChangeEl.text(percentChange)

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
  $('#portfolio-value-chart').hide()
  $('#spinner').show()
  getHistoricalData('7D')
}

let createChart = (data, labels) => {
  if (window.chart) window.chart.destroy()
  var ctx = document.getElementById("portfolio-value-chart").getContext('2d')
  window.chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Portfolio Value',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      legend: {
        display: false
      },
      tooltips: {
        enabled: true,
        displayColors: true,
        callbacks: {
          labelColor: (tooltipItem, chart) => {
            return {
              borderColor: 'rgba(255, 99, 132, 1)',
              backgroundColor: 'rgba(255, 99, 132, 1)'
            }
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
            beginAtZero: true,
            callback: (value, index, values) => {
              if (parseInt(value) >= 1000) {
                return '$' + value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",").toFixed(2)
              } else {
                return '$' + value.toFixed(2)
              }
            }
          }
        }]
      }
    }
  })
}
