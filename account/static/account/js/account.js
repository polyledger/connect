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
  getHistoricalData('1d')
}

let createChart = (data, labels) => {
  console.log(data)
  var ctx = document.getElementById("portfolio-value-chart").getContext('2d')
  var chart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Portfolio Value',
        data: data,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255,99,132,1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      scaleLabel(label) {
        return '$' + label.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero:true
          }
        }]
      }
    }
  })
}
