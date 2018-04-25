import Highcharts from "highcharts";
import numeral from "numeral";

let getChartOptions = series => {
  return {
    chart: {
      type: "line",
      backgroundColor: "rgba(255, 255, 255, 0.0)"
    },
    colors: ["#00ba95", "#ead36b"],
    credits: {
      enabled: false
    },
    legend: {
      enabled: false
    },
    series: series,
    title: {
      text: null
    },
    tooltip: {
      formatter() {
        let date = Highcharts.dateFormat("%e. %b %Y", new Date(this.x));
        let result = `<strong>${date}</strong><br>`;
        this.points.forEach(value => {
          result +=
            '<span style="color:' + value.series.color + '">\u25CF</span> ';
          result += value.series.name + ": ";
          result += numeral(value.y).format("$0,0");
          result += "<br>";
        });
        return result;
      },
      shared: true
    },
    xAxis: {
      labels: {
        style: {
          color: "#fff"
        }
      },
      type: "datetime"
    },
    yAxis: {
      gridLineWidth: 0,
      labels: {
        formatter() {
          return numeral(this.value).format("$0,0");
        },
        style: {
          color: "#fff"
        }
      },
      minorGridLineWidth: 0,
      title: {
        text: "Value (USD)",
        style: {
          color: "#fff"
        }
      }
    }
  };
};

export default getChartOptions;
