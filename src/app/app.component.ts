import { Component, OnInit } from '@angular/core';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import { CommonWebsocketService } from './services/common-websocket.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'jbmApp';
  amChartsData = {};
  isAmChartVisible = true;
  private amChart: am4charts.XYChart;
  constructor(private commonWebsocketService: CommonWebsocketService) { }

  ngOnInit() {
    this.plotAmChart();
    this.commonWebsocketService.mockConnect([]);
    let counter = 0;
    const interval = setInterval(() => {
      counter++;
      const obj = {
        date: new Date(),
        noOfPerson: this.generateRandom()
      }
      this.commonWebsocketService.sendMockMessage(obj);
      if (counter > 1000) {
        clearInterval(interval);
        location.reload();
      }
    }, 1000);
    this.commonWebsocketService.mockMessageSpy.subscribe((response: any) => {
      if (this.amChart && response) {
        console.log('response: ', response);
        this.amChart.addData(response);
        setTimeout(() => {
          
        }, 1000);
      }
    });
  }

  generateRandom() {
    return Math.floor(Math.random() * 1000) + 1;
  }
  plotAmChart() {
    const chart = am4core.create("chartdiv", am4charts.XYChart);

    // generate some random data, quite different range
    let generateChartData = () => {
      let chartData = [];
      let firstDate = new Date();
      firstDate.setDate(firstDate.getDate() - 100);
      firstDate.setHours(0, 0, 0, 0);

      let noOfPerson = 1600;

      for (let i = 0; i < 15; i++) {
        let newDate = new Date(firstDate);
        newDate.setDate(newDate.getDate() + i);

        noOfPerson += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);

        chartData.push({
          date: newDate,
          noOfPerson: noOfPerson,
        });
      }
      return chartData;
    }
    // Add data
    const data = []
    generateChartData();
    console.log('data: ', data);
    chart.data = data;
    // Create axes
    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.minGridDistance = 50;
    dateAxis.title.text = 'Time';

    // Create series
    function createAxisAndSeries(field, name) {
      var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
      var series = chart.series.push(new am4charts.LineSeries());
      series.dataFields.valueY = field;
      series.dataFields.dateX = "date";
      series.strokeWidth = 2;
      series.yAxis = valueAxis;
      series.name = name;
      series.tooltipText = "{name}: [bold]{valueY}[/]";
      series.tensionX = 0.8;
      series.bullets.push(new am4charts.CircleBullet());

      valueAxis.renderer.line.strokeOpacity = 1;
      valueAxis.renderer.line.strokeWidth = 2;
      valueAxis.renderer.line.stroke = series.stroke;
      valueAxis.renderer.labels.template.fill = series.stroke;
      valueAxis.renderer.grid.template.disabled = true;
    }

    createAxisAndSeries("noOfPerson", "Number of persons in front of webcam");

    // Add legend
    chart.legend = new am4charts.Legend();
    chart.legend.position = 'top';
    chart.legend.paddingBottom = 20;
    chart.legend.labels.template.maxWidth = 95;
    // Add cursor
    chart.cursor = new am4charts.XYCursor();
    chart.scrollbarX = new am4core.Scrollbar();
    // export data
    chart.exporting.menu = new am4core.ExportMenu();
    this.amChart = chart;
  }
}
