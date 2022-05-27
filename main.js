const url =
  'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/global-temperature.json';

let data;

const req = new XMLHttpRequest();
req.open('GET', url, true);
req.send();
req.onload = function () {
  const json = JSON.parse(req.responseText);
  data = json;

  const baseTemperature = data.baseTemperature;
  const monthlyVariance = data.monthlyVariance;

  // dimensions of svg

  const w = 1750;
  const h = 800;
  const padding = 100;

  // x axis constructors

  const startYear = d3.min(
    monthlyVariance,
    (d) => new Date(d.year, null, null, null, null, null)
  );
  const endYear = d3.max(
    monthlyVariance,
    (d) => new Date(d.year, null, null, null, null, null)
  );

  const xScale = d3
    .scaleTime()
    .domain([startYear, endYear])
    .range([padding, w - padding]);

  const xAxis = d3
    .axisBottom(xScale)
    .tickFormat(d3.timeFormat('%Y'))
    .ticks(d3.timeYear.every(10));

  // y axis constructors
  const startMonth = d3.max(
    monthlyVariance,
    (d) => new Date(null, d.month, -15, null, null, null)
  );
  const endMonth = d3.min(
    monthlyVariance,
    (d) => new Date(null, d.month - 1, -15, null, null, null)
  );

  const yScale = d3
    .scaleTime()
    .domain([startMonth, endMonth])
    .range([h - padding, padding]);

  const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%B'));

  const svg = d3
    .select('body')
    .select('div')
    .append('svg')
    .attr('width', w)
    .attr('height', h);

  svg
    .append('g')
    .attr('id', 'x-axis')
    .attr('transform', 'translate(0,' + (h - padding) + ')')
    .call(xAxis);

  svg
    .append('g')
    .attr('id', 'y-axis')
    .attr('transform', 'translate(' + padding + ', 0)')
    .call(yAxis);

  // rect constructors and designers

  let tooltip = d3.select('#tooltip'); //define tooltip

  svg
    .selectAll('rect')
    .data(monthlyVariance)
    .enter()
    .append('rect')
    .attr('class', 'cell')
    .attr('data-month', (d) => d.month - 1)
    .attr('data-year', (d) => d.year)
    .attr('data-temp', (d) => baseTemperature + d.variance)
    .attr('width', (w / monthlyVariance.length) * 10)
    .attr('height', h / 15.5)
    .attr('x', (d) => {
      return xScale(new Date(d.year, null, null, null, null, null));
    })
    .attr('y', (d) => {
      return yScale(new Date(null, d.month - 1, -15, null, null));
    })
    .style('fill', (d) => {
      let temperature = baseTemperature + d.variance;
      if (temperature <= 3.9) {
        return '#0E185F';
      } else if (temperature <= 5.0) {
        return '#2FA4FF';
      } else if (temperature <= 6.1) {
        return '#85F4FF';
      } else if (temperature <= 7.2) {
        return '#B8FFF9';
      } else if (temperature <= 8.3) {
        return '#FDFFA9';
      } else if (temperature <= 9.5) {
        return '#FFBC80';
      } else if (temperature <= 10.6) {
        return '#FF9F45';
      } else if (temperature <= 11.7) {
        return '#F76E11';
      } else if (temperature <= 12.8) {
        return '#FC4F4F';
      }
    })
    .on('mouseover', function (e) {
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];
      let data = e.target['__data__'];
      console.log(data);
      tooltip
        .style('opacity', '0.9')
        .text(() => {
          return `${data.year}, ${months[data.month - 1]},
        ${baseTemperature + data.variance}, ${data.variance.toFixed(2)}`;
        })
        .attr('data-year', data.year)
        .style(
          'transform',
          `translate(${e.clientX - 200}px , ${e.clientY - 900}px)`
        );
    })
    .on('mouseout', function (e) {
      tooltip.style('opacity', '0');
    });

  // legend constructors

  const legendTicks = [2.8, 3.9, 5.0, 6.1, 7.2, 8.3, 9.5, 10.6, 11.7, 12.8];

  const legendStart = d3.min(legendTicks);
  const legendEnd = d3.max(legendTicks);

  const legendScale = d3
    .scaleLinear()
    .domain([legendStart, legendEnd])
    .range([100, 500]);

  const legendAxis = d3
    .axisBottom(legendScale)
    .tickFormat(d3.format('.1f'))
    .tickValues(legendTicks);

  svg
    .append('g')
    .attr('id', 'legend')
    .attr('transform', 'translate(0, 770)')
    .call(legendAxis)
    .selectAll('legend-rect')
    .data(legendTicks)
    .enter()
    .append('rect')
    .attr('class', 'legend-rect')
    .attr('width', 400 / (legendTicks.length - 1))
    .attr('height', 20)
    .attr('x', (d) => {
      let width = 400 / (legendTicks.length - 1);

      let index = legendTicks.indexOf(d);
      if (index === 0) {
        return 100;
      } else {
        return 100 + width * index;
      }
    })
    .attr('y', -20)
    .style('fill', (d) => {
      if (d <= 2.8) {
        return '#0E185F';
      } else if (d <= 3.9) {
        return '#2FA4FF';
      } else if (d <= 5.0) {
        return '#85F4FF';
      } else if (d <= 6.1) {
        return '#B8FFF9';
      } else if (d <= 7.2) {
        return '#FDFFA9';
      } else if (d <= 8.3) {
        return '#FFBC80';
      } else if (d <= 9.5) {
        return '#FF9F45';
      } else if (d <= 10.6) {
        return '#F76E11';
      } else if (d <= 11.7) {
        return '#FC4F4F';
      } else if (d <= 12.8) {
        return 'rgba(0,0,0,0)';
      }
    });

  //tooltip constructors
};
