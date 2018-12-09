import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Router, ActivatedRoute, Params } from '@angular/router';

import { Project, ProjectsJSON } from '../../../models/projects.model';
import { Deployment, DeploymentsAllJSON } from '../../../models/deployments.model';
import { Diagnostics, DiagnosticsJSON, Observation, ObservationMessage } from '../../../models/diagnostics.model';

import { IntelligentRiverService } from '../../../services/intelligent-river.service';

declare var $: any;
import * as d3 from 'd3';
import * as moment from 'moment';
import JSONFormatter from 'json-formatter-js';

export interface CurrentDiagnosticData {
    id: string;
    headings: string[];
    rows: number[][];
}

@Component({
  selector: 'app-diagnostics',
  templateUrl: './diagnostics.component.html',
  styleUrls: ['./diagnostics.component.scss']
})
export class DiagnosticsComponent implements OnInit, AfterViewInit {
  // data variables to listen to irService
  projects: Project[];
  deployments: Deployment[];
  deploymentsByProjectId: any;
  deploymentDetailsByDeploymentId: any;
  deploymentDetailsByProjectId: any;
  currentProject: Project;
  currentDeployment: Deployment;
  hasDeployments: boolean;

  currentProjectId: number;
  currentDeploymentId: number;
  currentDiagnostics: DiagnosticsJSON;
  renderedJSON: string;
  renderedTime: string;
  renderedName: string;

  currentData: CurrentDiagnosticData;

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

  constructor(private router: Router,
    private route: ActivatedRoute,
    private irService: IntelligentRiverService) {
      this.projects = null;
      this.deployments = null;
      this.deploymentsByProjectId = null;
      this.deploymentDetailsByDeploymentId = {};
      this.deploymentDetailsByProjectId = {};

      this.currentProject = null; this.currentProjectId = null;
      this.currentDeployment = null; this.currentDeploymentId = null;
      this.currentDiagnostics = null;
      this.renderedJSON = null;
      this.renderedTime = null;
      this.renderedName = null;
  }

  ngOnInit() {
    console.log('DIAGNOSTICS.ngOnInit()');

    this.irService.observeProjects.subscribe((projects) => {
      this.projects = projects;
    });

    this.irService.observeDeploymentDetailsByDeploymentId.subscribe((next) => {
      this.deploymentDetailsByDeploymentId = next;
      console.log('DIAGNOSTICS.deploymentDetailsByDeploymentId ==', this.deploymentDetailsByDeploymentId);
    });

    this.irService.observeCurrentDeployment.subscribe((newCurrentDeployment) => {
      this.currentDeployment = newCurrentDeployment;
    });

    this.irService.observeDeploymentsByProjectId.subscribe((newDeploymentsByProjectId) => {
      this.deploymentsByProjectId = newDeploymentsByProjectId;
    });

    this.irService.observeCurrentProject.subscribe((next) => {
      this.currentProject = next;
      this.currentDiagnostics = null;
      this.renderedJSON = null;
      this.renderedTime = null;
      this.renderedName = null;

      if (this.currentProject) {
        this.currentProjectId = next.id;

        this.irService.getDeploymentDetailsByProjectId(this.currentProject.id).subscribe((data) => {
          this.deploymentDetailsByProjectId = data;
          if (this.deploymentDetailsByProjectId) {
            console.log('DIAGNOSTICS.getDeploymentDetailsByProjectId(' + this.currentProject.id + ') response',
              this.deploymentDetailsByProjectId);
          }
        });
        this.irService.getDiagnostics(this.currentProject.id).subscribe((data) => {
          this.currentDiagnostics = data;
          if (this.currentDiagnostics) {
            console.log('DIAGNOSTICS.getDiagnostics(' + this.currentProject.id + ') response',
              this.currentDiagnostics);

            this.transformCurrentDiagnosticsToData();
          }
        });
      }
    });
  }

  ngAfterViewInit(): void {
    console.log('DIAGNOSTICS.ngAfterViewInit()');
  }

  renderJSONTime(deploymentId: string, datetime: number) {
    for (let i = 0; i < this.currentDiagnostics.diagnostics.length; i++) {
      if (this.currentDiagnostics.diagnostics[i].deployment === deploymentId) {
        for (let j = 0; j < this.currentDiagnostics.diagnostics[i].observations.length; j++) {
          if (this.currentDiagnostics.diagnostics[i].observations[j].datetime === datetime) {
            const json: {} = this.currentDiagnostics.diagnostics[i].observations[j].originalMessage;
            const formatter = new JSONFormatter(json);
            const observationId = this.currentDiagnostics.diagnostics[i].observations[j].observationId;
            document.getElementById(observationId + '-jsonOutput').appendChild(formatter.render());
            $('#' + observationId).modal('show');
            break;
          }
        }
        break;
      }
    }
  }

  renderJSONStuff(i: number, j: number, domPrefix: string, observationId: string): void {
    console.log('DIAGNOSTICS.renderJSONStuff(' + i + ', ' + j + ')',
      this.currentDiagnostics.diagnostics[i].observations[j].originalMessage);
    this.renderedName = this.currentDiagnostics.diagnostics[i].deployment;
    this.renderedTime = this.currentDiagnostics.diagnostics[i].observations[j].originalMessage.baseDateTime;
    const json: {} = this.currentDiagnostics.diagnostics[i].observations[j].originalMessage;
    const string = JSON.stringify(json, undefined, 4);
    // this.renderedJSON = this.syntaxHighlight(string);    // JSON.stringify(json, null, 2);
    this.renderedJSON = string;

    const formatter = new JSONFormatter(json);
    document.getElementById(observationId + '-jsonOutput').appendChild(formatter.render());
    // $('#' + observationId + '-jsonOutput').jsonViewer({fuck: 'you'}, {collapsed: true, withQuotes: false});
    $(domPrefix + observationId).modal('show');
  }

  transformCurrentDiagnosticsToData() {
    console.log('DIAGNOSTICS.transformCurrentDiagnosticsToData()', this.currentDiagnostics, this.currentData);

    let observation: Observation;
    let data: number[];
    this.currentDiagnostics.diagnostics.forEach(diagnostic => {
      this.currentData = {
        id: diagnostic.deployment,
        headings: [],
        rows: []
      };
      this.currentData.headings.push('datetime');
      this.currentData.headings.push('dummy');
      for (let i = 0; i < diagnostic.observations.length; i++) {
        observation = diagnostic.observations[i];
        data = [];
        data.push(observation.datetime);
        data.push(0);

        this.currentData.rows.push(data);
      }

      this.graphObservations(this.currentData);
    });

  }

  graphObservations(currentData: CurrentDiagnosticData) {
    // const domSelector = '#graphlocation-' + currentData.id;
    const domSelector = '#graphLocations';

    // Set the dimensions of the canvas / graph
    const margin = {top: 15, right: 15, bottom: 15, left: 15},
      width = 400 - margin.left - margin.right,
      height = 87 - margin.top - margin.bottom;

    // Parse the date / time

    // Set the ranges
    const x = d3.time.scale().range([0, width]);
    const y = d3.scale.linear().range([0, 0]);

    // Define the axes
    const xAxis = d3.svg.axis().scale(x)
      .orient('bottom').ticks(5);

    // Define the line
    const valueline = d3.svg.line()
      .x(function(d) { return x(d[currentData.headings[0]]); })
      .y(function(d) { return 0; });

    // Define the div for the tooltip
    const div = d3.select('#lol').append('div')
      .attr('class', 'tooltip')
      .style('opacity', 0)
      .style('position', 'absolute').style('text-align', 'center')
      .style('width', '100px')
      .style('height', '100px')
      .style('padding', '2px')
      .style('font', '12px sans-serif').style('background', 'lightsteelblue')
      .style('border', '0px')
      .style('border-radius', '0px')
      .style('pointer-events', 'none');

    // Adds the svg canvas
    const svg = d3.select(domSelector)
      .append('svg')
        .attr('width', width + margin.left + margin.right)
        .attr('height', height + margin.top + margin.bottom)
        .attr('id', currentData.id + '-svg')
      .append('g')
        .attr('transform',
          'translate(' + margin.left + ',' + margin.top + ')');

    // Get the data
    let string = '';
    string += currentData.headings.join(',');
    currentData.rows.forEach(row => {
      string += '\r\n' + row.join(',');
    });

    const data: {}[] = d3.csv.parse(string, (d, index) => {
      d[currentData.headings[0]] = parseFloat(d[currentData.headings[0]]);
      return d;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function(d) { return d[currentData.headings[0]]; }));

    // Add the valueline path.
    svg.append('path')
        .attr('class', 'line')
        .style('stroke', 'steelblue').style('stroke-width', '2').style('fill', 'none')
        .attr('d', valueline(data));

    // Add the scatterplot
    svg.selectAll('dot')
      .data(data)
      .enter()
      .append('a')
          // .attr('xlink:href', function(d) { return 'http://google.com?id=' + d[currentData.headings[0]]; })
      .append('circle')
        .attr('r', 5)
        .attr('cx', function(d) { return x(d[currentData.headings[0]]); })
        .on('mouseover', function(d) {
          div.transition()
            .duration(200)
            .style('opacity', .9);
          div.html(moment(d[currentData.headings[0]]).format() + '<br/>')
            .style('left', (d3.event.pageX) + 'px');
            // .style('top', (d3.event.pageY - 28) + 'px');
          })
        .on('mouseout', function(d) {
          div.transition()
            .duration(500)
            .style('opacity', 0);
        })
        .on('click', (d) => {
          this.renderJSONTime(currentData.id, d[currentData.headings[0]]);
        });

    // Add the X Axis
    svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + 10 + ')')
        .style('stroke', 'grey').style('stroke-width', '1').style('fill', 'none').style('shape-rendering', 'crisp-edges')
        .call(xAxis);

    // const img = d3.select('#' + currentData.id + '-svg').node();
    // const serializer = new XMLSerializer();
    // let svgxml = serializer.serializeToString(img);
    // if ($.browser.webkit) {
    //   svgxml = svgxml.replace(/ xlink:xlink/g, 'xmlns:xlink');
    //   svgxml = svgxml.replace(/ href/g, 'xlink:href');
    // }
    // console.log(svgxml);
  }
}
