import { RenderableType } from '../renderable-type.enum';
import { SvgMessage } from '../svg-message';
import { SvgMessageType } from '../svg-message-type.enum';
import { SvgRenderable, SvgEdge, SvgNodeFunction, SvgNodeMatrix, SvgRenderableContainer } from '../svg-node';
import { SvgRenderService } from '../svg-render-service.service';
import { Component, OnInit, NgZone } from '@angular/core';
//import dagre from 'dagre';
//import dagreD3 from 'dagre-d3';
//import * as d3 from 'd3';

import * as dagre from 'dagre';
import * as dagreD3 from 'dagre-d3';
import * as d3 from 'd3';

import { LinkedList as basLinkedList } from 'typescript-collections';

/**
 * The render NGZone class. This class exposes angularComponentReference as a dom element of
 * window. This class is responsible for final rendering of the dagre node flow chart. This
 * class is also responsible for handling click events of the svg box select buttons.
 */
@Component({
  selector: 'app-math-svg-ng-zone',
  templateUrl: './math-svg-ng-zone.component.html',
  styleUrls: ['./math-svg-ng-zone.component.css']
})
export class MathSvgNgZoneComponent implements OnInit {

  private graph: dagre.graphlib.Graph;

  /**
   * Instantiates the component. NgZone is injected into the component, as is SvgRenderService
   */
  constructor( private zone: NgZone, private svgService: SvgRenderService ) {

    if ( zone != null ) { // null for testing
      window['angularComponentReference'] = {
          zone: this.zone,
          togselect: (id, strtype) => this.clickSelected(id, strtype),

          component: this,
      };
    }

    svgService.renderSignal$.subscribe( svgRenderableContainer => { // nodes: basSet<SvgNode>;

      this.rendergraph(svgRenderableContainer);

    });

   }

  /**
   * Click handler for the svg box toggles/buttons
   */
  clickSelected(id, strtype): void {

    const svgMessage: SvgMessage = new SvgMessage(id, strtype, document.getElementById(id), SvgMessageType.Select);

    this.svgService.consumeSvgMessage(svgMessage);

  }

  /**
   * Initializes the dagreD3 graph
   */
  ngOnInit() {
    this.graph = new dagreD3.graphlib.Graph().setGraph({}).setDefaultEdgeLabel(function() { return {}; });
  }

  /**
   * Renders the graph
   */
  rendergraph(svgRenderableContainer: SvgRenderableContainer): dagre.graphlib.Graph {



    const oldnodes: Array<string> = this.graph.nodes();

    for ( let i = 0; i < oldnodes.length; i++ ) {
      this.graph.removeNode(oldnodes[i]);
    }


    svgRenderableContainer.matrices.forEach( mnode => {
        console.log('matrix:' + mnode.getId());
        let edgesStr = 'id:' + mnode.id + ' | ';

        (<SvgNodeMatrix>mnode).getMatrix().getEdges().forEach( e => { edgesStr += e.getI() + ',' + e.getJ() + ' | '; } );

        this.graph.setNode(mnode.id.toString(),  { labelType: mnode.labelType,
                                                   label: mnode.getLabel() + edgesStr,
                                                   class: mnode.classStr });

    });

    svgRenderableContainer.functions.forEach( fnode => {

        let edgesStr = 'id:' + fnode.id + ' | ';

        (<SvgNodeFunction>fnode).getFunction().getEdges().forEach( e => { edgesStr += e.getI() + ',' + e.getJ() + ' | '; } );


        this.graph.setNode(fnode.id.toString(),  { labelType: fnode.labelType,
                                                   label: fnode.getLabel() + edgesStr,
                                                   class: fnode.classStr });

    });

    svgRenderableContainer.edges.forEach( enode => {
//        console.log( this.graph.nodes() );
//        console.log('I:' + (<SvgEdge>enode).edge.getI() + '  J:' + (<SvgEdge>enode).edge.getJ() );
        // this.graph.setEdge((<SvgEdge>enode).edge.getI(), (<SvgEdge>enode).edge.getJ());
        this.graph.setEdge((<SvgEdge>enode).edge.getI().toString(), (<SvgEdge>enode).edge.getJ().toString(), {
          style: 'stroke: #f52825; stroke-width: 3px; stroke-dasharray: 5, 5; fill:rgba(0,0,0,0.0);',
          arrowheadStyle: 'fill: #f52825',
          label: (<SvgEdge>enode).edge.getI().toString() + ',' + (<SvgEdge>enode).edge.getJ().toString()
        });

    });

    const render: dagreD3.Render = new dagreD3.render();

    const svg = d3.select('#svgid');
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('svg g'), this.graph);

    svg.attr('width', this.graph.graph().width + 40);
    svg.attr('height', this.graph.graph().height + 40);

    return this.graph;

  }



}
