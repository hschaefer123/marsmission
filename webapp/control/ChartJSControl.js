sap.ui.define([
  "sap/ui/core/Control",
  "./js/chart.min"
], function(Control) {
  'use strict';

  var CHART_CANVAS_NAME_PREFIX = 'chartJSCanvas';

  return Control.extend('de.uniorg.martian.control.ChartJSControl', {
    metadata: {
      properties: {
        width: {
          type: 'int',
          defaultValue: 400
        },
        height: {
          tyoe: 'int',
          defaultValue: 400
        },
        responsive: {
          type: 'string',
          defaultValue: 'false'
        },
        maintainAspectRatio: {
          type: 'string',
          defaultValue: 'true'
        },
        chartType: {
          type: 'string',
          defaultValue: 'Line'
        },
        data: {
          type: 'object'
        },
        options: {
          type: 'object'
        }
      },
      events: {
        update: {
          enablePreventDefault: true
        }
      }
    },

    init: function() {
      var _newCustomChart;
    },

    onBeforeRendering: function() {
      // set global property for responsiveness
      if (this.getResponsive() === "true") {
        Chart.defaults.global.responsive = true;
      } else {
        Chart.defaults.global.responsive = false;
      }

      // set global property for aspect ratio
      if (this.getMaintainAspectRatio() === "true") {
        Chart.defaults.global.maintainAspectRatio = true;
      } else {
        Chart.defaults.global.maintainAspectRatio = false;
      }
    },

    onAfterRendering: function() {
      // Get the context of the canvas element we want to select
      var ctx = document.getElementById(CHART_CANVAS_NAME_PREFIX + this.getId()).getContext("2d");
      this._newCustomChart = new Chart(ctx);
      var chartType = this.getChartType();
      var chartData = this.getData();
      var chartOptions = this.getOptions();

      // required due to lifecycle calls > init of undefined vars
      if(chartData === undefined) {
        return;
      }

      switch (chartType) {
        case 'Line':
          this._newCustomChart.Line(chartData, chartOptions);
          break;
        case 'Bar':
          this._newCustomChart.Bar(chartData, chartOptions);
          break;
        case 'Radar':
          this._newCustomChart.Radar(chartData, chartOptions);
          break;
        case 'PolarArea':
          this._newCustomChart.PolarArea(chartData, chartOptions);
          break;
        case 'Pie':
          this._newCustomChart.Pie(chartData, chartOptions);
          break;
        case 'Doughnut':
          this._newCustomChart.Doughnut(chartData, chartOptions);
          break;
        default:
          throw new Error('Error while creating ChartJS: Undefined chartType: ' + chartType);
      }
    },

    exit: function() {
      this._newCustomChart.destroy();
    },

    renderer: function(oRm, oControl) {
      var oBundle = oControl.getModel('i18n').getResourceBundle();
      var width = oControl.getWidth();
      var height = oControl.getHeight();

      //Create the control
      oRm.write('<div');
      oRm.writeControlData(oControl);
      oRm.addClass("chartJSControl");
      oRm.addClass("sapUiResponsiveMargin");
      oRm.writeClasses();
      oRm.write('>');

      oRm.write('<canvas id="' + CHART_CANVAS_NAME_PREFIX + oControl.getId() + '" width="' + width + '" height="' + height + '"></canvas>');

      oRm.write('</div>');
    },

    update: function() {
      this._newCustomChart.update();
    }
  });
});