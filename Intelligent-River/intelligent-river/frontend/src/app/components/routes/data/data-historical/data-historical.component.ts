import { Component, OnInit, AfterViewInit, ElementRef } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { Project, ProjectsJSON } from '../../../../models/projects.model';
import { Deployment, DeploymentsAllJSON } from '../../../../models/deployments.model';

import { IntelligentRiverService } from '../../../../services/intelligent-river.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

declare const $: any;
import * as d3 from 'd3';
import * as moment from 'moment';

@Component({
  selector: 'app-data-historical',
  templateUrl: './data-historical.component.html',
  styleUrls: ['./data-historical.component.scss']
})
export class DataHistoricalComponent implements OnInit, AfterViewInit {
  // ng-map variables
  lat: number;
  lng: number;
  mapZoom: number;
  mapType: string;
  motestackIcon: string;
  iconBase: string;
  icons: {};
  markers: {};

  // data variables to listen to irService
  projects: Project[];
  deployments: Deployment[];
  deploymentsByProjectId: any;
  deploymentDetailsByDeploymentId: any;
  deploymentDataMetadataIndex: {};
  filters: {}[];
  currentProject: Project;
  currentDeployment: Deployment;
  hasDeployments: boolean;

  currentProjectId: number;
  currentDeploymentId: number;

  // form selectors;
  selectedFilters: string[];
  selectedParameters: any;

  dataProcessed: boolean;
  dataProcessing: boolean;
  currentData: any;

  currentFilter: {
    property: string;
    unit: string;
    min: number;
    max: number;
  };

  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  width: number;
  height: number;

  x: any;
  y: any;
  xAxis: any;
  yAxis: any;

  valueline: any;

  xColumn: any;
  yColumn: any;
  rColumn: any;
  colorColumn: any;
  svg: any;

  xScale: any;
  yScale: any;
  rScale: any;
  colorScale: any;

  constructor(private elementRef: ElementRef,
    private router: Router,
    private route: ActivatedRoute,
    private irService: IntelligentRiverService) {
      this.lat = 30.3449153;
      this.lng = -81.8231895;
      this.mapZoom = 6;
      this.mapType = 'satellite';
      this.motestackIcon = 'assets/img/motestack/motestack.png';
      this.iconBase = 'assets/img/pIcons/';
      this.icons = {
        0: this.iconBase + 'rnd.png',
        1: this.iconBase + 'iCity.png',
        2: this.iconBase + 'iFarm.png',
        3: this.iconBase + 'iForest.png',
        4: this.iconBase + 'iRiver.png',
        5: this.iconBase + 'iro.png',
        6: this.iconBase + 'eco.png',
        7: this.iconBase + 'city1.png'
      };
      this.markers = {};

      this.projects = null;
      this.deployments = null;
      this.deploymentsByProjectId = null;
      this.deploymentDetailsByDeploymentId = {};
      this.deploymentDataMetadataIndex = {};
      this.filters = [];

      this.currentProject = null; this.currentProjectId = null;
      this.currentDeployment = null; this.currentDeploymentId = null;

      this.selectedFilters = [];
      this.selectedParameters = null;

      this.dataProcessed = false;
      this.dataProcessing = false;
      this.currentData = null;
      this.currentFilter = null;
    }

  ngOnInit() {
    console.log('DATA-HISTORICAL.ngOnInit()');

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
    });

    this.irService.observeDeploymentDetailsByDeploymentId.subscribe((next) => {
      this.deploymentDetailsByDeploymentId = next;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      this.dataProcessed = false;
      this.dataProcessing = false;
      this.filters = [];
      console.log('DATA-HISTORICAL.currentProject ==', this.currentProject);
      if (next) {
        this.currentProjectId = next.id;
        if (this.currentProject) {

          // gonna have to use this other than the usual
          this.irService.getDeploymentsByProjectId(this.currentProject.id).subscribe((data) => {});

          console.log('DATA-HISTORICAL.getDeploymentsByProjectId(' + this.currentProject.id + ')');
          this.irService.getDeploymentsByProjectId(this.currentProject.id).subscribe((data) => {
            if (!data) {
              return;
            } else if (data) {
              if (this.currentProject.id in data) {
                if (!('length' in data[this.currentProject.id])) {
                  return;
                }
                console.log('DATA-HISTORICAL.getDeploymentsByProjectId(' + this.currentProject.id + ') response', data);
                const length = data[this.currentProject.id]['length'];
                if (length > 0) {
                  this.markers = [];
                  let temp_lat = 0; let temp_lng = 0;
                  let max_lat = -91;
                  let max_lng = -181;
                  let min_lat = 91;
                  let min_lng = 181;
                  for (let i = 0; i < length; i++) {
                    const lat = data[this.currentProject.id][i]['location']['lat'];
                    const lng = data[this.currentProject.id][i]['location']['lng'];

                    temp_lat += lat;
                    temp_lng += lng;

                    if (max_lat < temp_lat) {
                      max_lat = lat;
                    }

                    if (min_lat > temp_lat) {
                      min_lat = lat;
                    }

                    if (max_lng < temp_lng) {
                      max_lng = lng;
                    }

                    if (min_lng > temp_lng) {
                      min_lng = lng;
                    }
                  }
                  this.lat = temp_lat / length;
                  this.lng = temp_lng / length;

                  const diff_lat = max_lat - min_lat;
                  const diff_lng = max_lng - min_lng;
                  let offset = diff_lat > diff_lng ? diff_lat : diff_lng;
                  offset = Math.round(Math.log2(Math.abs(offset)));
                  if (Number.isNaN(offset) || !Number.isFinite(offset) || offset < -8) {
                    this.mapZoom = 16;
                  } else {
                    this.mapZoom = 8 - offset;
                  }
                } else {
                  this.hasDeployments = false;
                  this.lat = 30.3449153;
                  this.lng = -81.8231895;
                  this.mapZoom = 3;
                }
              }
            }
          });
        }
      }
    });

    this.irService.observeCurrentDeployment.subscribe((newCurrentDeployment) => {
      this.currentDeployment = newCurrentDeployment;

      this.dataProcessed = false;
      this.dataProcessing = false;
      this.currentData = null;
      this.currentFilter = null;
    });

    this.irService.observeDeploymentsByProjectId.subscribe((newDeploymentsByProjectId) => {
      this.deploymentsByProjectId = newDeploymentsByProjectId;
    });

    this.irService.observeDeploymentDataMetadataIndex.subscribe((data) => {
      this.deploymentDataMetadataIndex = data;
      if (this.deploymentDataMetadataIndex && Object.values(this.deploymentDataMetadataIndex).length > 0) {
        this.filters =  Object.values(this.deploymentDataMetadataIndex[this.currentProjectId]['filters']);
        console.log('DATA-HISTORICAL.deploymentDataMetadataIndex ==', this.deploymentDataMetadataIndex, this.filters);
      }
    });
  }

  ngAfterViewInit() {

  }

  onDeploymentClicked(event: Event, domPrefix: string, deploymentId: string): void {
    this.irService.getDeploymentDetailsByDeploymentId(deploymentId).subscribe((details) => {});
    this.irService.setCurrentDeployment(this.deploymentDetailsByDeploymentId[deploymentId]);
    this.irService.setCurrentDeploymentId(deploymentId);
    $(domPrefix + deploymentId).modal('show');
    console.log('DATA-HISTORICAL.onDeploymentClicked(event, ' + domPrefix + ', ' + deploymentId + ')', event);
  }

  hasProp(o, name) {
    return o.hasOwnProperty(name);
  }

  onShowHide(event: Event): void {
    const text = event.srcElement.innerHTML;
    if (text === 'Show') {
      event.srcElement.innerHTML = 'Hide';
    } else {
      event.srcElement.innerHTML = 'Show';
    }
  }

  formValidation(value, invalid): void {
    console.log('DATA-HISTORICAL.formValidation(value, invalid)', value, invalid);
    console.log('DATA-HISTORICAL.selectedParameters ==', this.selectedParameters);
    this.dataProcessing = true;

    if (invalid) {
      console.log('form invalid');
    } else {
      this.generateAndReturnCSVorGraphs();
    }
  }

  generateAndReturnCSVorGraphs() {
    this.irService.getDataHistorical(this.currentDeployment.id, '01-20-2017').subscribe((data) => {
      console.log('DATA-HISTORICAL.getDataHistorical(' + this.currentDeployment.id + ', 01-20-2017)', data);

      this.currentData = data;
      this.dataProcessed = false;

      let csvFilename = this.currentDeployment.label;
      let encodedUri: string;
      const timestamps: string[] = [];

      let i = 0;

      if (Object.keys(data).length === 0) {
        this.dataProcessed = true;
        this.currentData = null;
        return;
      }

      if (!this.selectedParameters) {
        csvFilename += '-ALL';
        this.selectedParameters = Object.keys(this.deploymentDataMetadataIndex[this.currentProject.id][this.currentDeployment.id]);
        for (i = 0; i < this.selectedParameters.length; i++) {
          if (this.selectedParameters[i] === 'meta') {
            this.selectedParameters.splice(i, 1);
              break;
          }
        }
      }

      data = data[this.currentDeployment.id];
      const headers: string[] = [];
      const rows: any[] = [];
      let newRow: number[];
      const timeUnit = 'Time';
      const units: string[] = [];

      headers.push(timeUnit);
      units.push('s');
      this.selectedParameters.forEach(parameter => {
        csvFilename += '-' + parameter;
        i = 0;
        if (parameter in this.deploymentDataMetadataIndex[this.currentProject.id][this.currentDeployment.id]) {
          units.push(this.deploymentDataMetadataIndex[this.currentProject.id][this.currentDeployment.id][parameter]['unit']);
          this.deploymentDataMetadataIndex[this.currentProject.id]
            [this.currentDeployment.id][parameter]['parameterPosition'].forEach(position => {
              headers.push(parameter + '-' + i);
              i++;
          });
        }
      });
      rows.unshift(headers);

      for (i = 0; i < data.length; i++) {
        newRow = [];
        newRow.push(data[i]['observationDateTime']);
        this.selectedParameters.forEach(parameter => {
          if (parameter in this.deploymentDataMetadataIndex[this.currentProject.id][this.currentDeployment.id]) {
            this.deploymentDataMetadataIndex[this.currentProject.id]
              [this.currentDeployment.id][parameter]['parameterPosition'].forEach(position => {
                newRow.push(data[i]['readings'][position]);
            });
          }
        });
        rows.push(newRow);
      }

      csvFilename += '.csv';

      this.dataProcessed = true;

      let csvString = '';
      rows.forEach((rowArray) => {
        csvString += rowArray.join(',') + '\r\n'; // add carriage return
      });
      console.log('DATA-HISTORICAL.getDataHistorical(' + this.currentDeployment.id + ', 01-20-2017) finished processing',
        rows, csvString);

      encodedUri = encodeURI('data:text/csv;charset=utf-8,' + csvString);
      const link = document.createElement('a');
      const br = document.createElement('br');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', csvFilename);
      link.appendChild(document.createTextNode(csvFilename));
      document.getElementById('csv-download-link-' + this.currentDeployment.id).appendChild(link);
      document.getElementById('csv-download-link-' + this.currentDeployment.id).appendChild(br);

      if (csvString && this.selectedParameters) {
        for (i = 1; i < headers.length; i++) {
          this.graphIt(csvString, this.currentDeployment.id, timeUnit, headers[i], units[i]);
        }
      }

      this.dataProcessing = false;
    });
  }

  // Set the dimensions of the canvas / graph
  graphIt(csvString: string, deploymentId: string, timeUnit: string, selectedParameter: string, selectedUnit: string): void {
    const self = this;
    const padding = 50;

    console.log(document.body.clientWidth);
    self.width = document.body.clientWidth / 2;
    self.height = document.body.clientWidth / 2 / 2;
    const originalWidth = document.body.clientWidth / 2;
    const originalHeight = document.body.clientHeight / 2 / 2;

    self.margin = {top: 50, right: 50, bottom: 50, left: 100},
    self.width = self.width - self.margin.left - self.margin.right,
    self.height = self.height - self.margin.top - self.margin.bottom;

    // Get the data
    const data: {}[] = d3.csv.parse(csvString, (d, index) => {
      d[timeUnit] = d[timeUnit];
      d[selectedParameter] = +d[selectedParameter];
      // d.date = moment(d.date).valueOf(); // d3.isoParse(d['timestamps']);
      // d.close = +d.close;

      return d;
    });

    console.log('DATA-HISTORICAL.graphIt(csvString, ' + deploymentId + ', ' + timeUnit + ', ' + selectedParameter + ') data', data);

    // Set the ranges
    self.x = d3.time.scale().range([0, self.width]);
    self.y = d3.scale.linear().range([self.height, 0]);

    // Define the axes
    self.xAxis = d3.svg.axis().scale(self.x)
        .orient('bottom').ticks(5);

    self.yAxis = d3.svg.axis().scale(self.y)
        .orient('left').ticks(5);

    // Define the line
    self.valueline = d3.svg.line()
        .x(function(d) { return self.x(d[timeUnit]); })
        .y(function(d) { return self.y(d[selectedParameter]); });
        // .x(function(d) { return self.x(d.date); })
        // .y(function(d) { return self.y(d.close); });

    // Adds the svg canvas
    self.svg = d3.select('#deployment-details-modal-d3-graphs-' + deploymentId)
      .append('svg')
          .attr('width', self.width + self.margin.left + self.margin.right)
          .attr('height', self.height + self.margin.top + self.margin.bottom)
      .append('g')
          .attr('transform', 'translate(' + self.margin.left + ',' + self.margin.top + ')');

    // Scale the range of the data
    const std = d3.deviation(data, function(d) { return d[selectedParameter]; });

    self.x.domain(d3.extent(data, function(d) { return d[timeUnit]; }));
    self.y.domain([d3.min(data, function(d) { return d[selectedParameter]; }) - std,
      d3.max(data, function(d) { return d[selectedParameter]; }) + std]);
    // self.y.domain([0, d3.max(data, function(d) { return d[selectedParameter]; })]);
    // self.x.domain(d3.extent(data, function(d) { return d.date; }));
    // self.y.domain([0, d3.max(data, function(d) { return d.close; })]);

    // Add the valueline path.
    const colors = ['steelblue', 'cadetblue', 'seagreen', 'brown', 'cornflowerblue', 'darkgoldenrod', 'purple'];
    const valueLineFill = colors[Math.floor(Math.random() * colors.length)];

    self.svg.append('path')
        .attr('class', 'line')
        .style('fill', 'none').style('stroke', valueLineFill).style('stroke-width', '1')
        .attr('d', self.valueline(data));

    // Add the X Axis
    self.svg.append('g')
        .attr('class', 'x axis')
        .style('fill', 'none').style('stroke', 'grey').style('stroke-width', '1').style('shape-rendering', 'crispEdges')
        .attr('transform', 'translate(0,' + self.height + ')')
        .call(self.xAxis);

    // Add the Y Axis
    self.svg.append('g')
        .attr('class', 'y axis')
        .style('fill', 'none').style('stroke', 'grey').style('stroke-width', '1').style('shape-rendering', 'crispEdges')
        .call(self.yAxis);

    // y label
    self.svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (-padding) + ',' + (self.height / 2) + ')rotate(-90)')
        .text(selectedParameter + ' (' + selectedUnit + ')');

    // x label
    self.svg.append('text')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate(' + (self.width / 2) + ',' + (self.height + padding) + ')')
        .text(timeUnit);
  }

  clearGraphs(deploymentId: number): void {
    d3.select('svg').remove();
  }
}
