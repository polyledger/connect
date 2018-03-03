import Highcharts from 'highcharts';
import numeral from 'numeral';

let getChartOptions = () => {
  return {
    chart: {
      type: 'line',
      backgroundColor: 'rgba(255, 255, 255, 0.0)'
    },
    colors: ['#b4c4fd', '#ead36b'],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    series: [
      {
        name: 'Portfolio',
        data: [[1519776000000, 5], [1519862400000, 6], [1519948800000, 8]]
      }
    ],
    title: {
      text: null
    },
    tooltip: {
      formatter() {
        let date = Highcharts.dateFormat('%e. %b %Y', new Date(this.x));
        let result = `<strong>${date}</strong><br>`;
        this.points.forEach(value => {
          result +=
            '<span style="color:' + value.series.color + '">\u25CF</span> ';
          result += value.series.name + ': ';
          result += numeral(value.y).format('$0,0');
          result += '<br>';
        });
        return result;
      },
      shared: true
    },
    xAxis: {
      labels: {
        style: {
          color: '#333'
        }
      },
      type: 'datetime'
    },
    yAxis: {
      gridLineWidth: 0,
      labels: {
        formatter() {
          return numeral(this.value).format('$0,0');
        },
        style: {
          color: '#333'
        }
      },
      minorGridLineWidth: 0,
      title: {
        text: 'Value (USD)',
        style: {
          color: '#333'
        }
      }
    }
  };
};

export default getChartOptions;
