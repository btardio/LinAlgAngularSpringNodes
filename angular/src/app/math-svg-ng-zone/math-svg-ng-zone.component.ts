import { RenderableType } from '../renderable-type.enum';
import { SvgMessage } from '../svg-message';
import { SvgRenderable, SvgEdge, SvgNodeFunction, SvgNodeMatrix } from '../svg-node';
import { SvgRenderService } from '../svg-render-service.service';
import { Component, OnInit, NgZone } from '@angular/core';
import dagre from 'dagre';
import dagreD3 from 'dagre-d3';
import * as d3 from 'd3';
//declare var MathJax: any;
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

  private graph: any;

  /**
   * Instantiates the component. NgZone is injected into the component, as is SvgRenderService
   */
  constructor( private zone: NgZone, private svgService: SvgRenderService ) {

    window['angularComponentReference'] = {
        zone: this.zone,
        togselect: (id, strtype) => this.toggleSelected(id, strtype),

        component: this,
    };

    svgService.renderSignal$.subscribe( nodes => { // nodes: basSet<SvgNode>;

      this.rendergraph(nodes);

    });

   }

  /**
   * Click handler for the svg box buttons
   */
  toggleSelected(id, strtype): void {

    const svgMessage: SvgMessage = new SvgMessage(id, strtype, document.getElementById(id));

    this.svgService.toggle(svgMessage);

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
  rendergraph(nodes: Array<SvgRenderable>) {

    const oldnodes: Array<number> = this.graph.nodes();

    for ( let i = 0; i < oldnodes.length; i++ ) {
      this.graph.removeNode(oldnodes[i]);
    }

    nodes.forEach( node => {

      if ( node.renderableType === RenderableType.SvgMatrixNode ) {
        let edgesStr = '';

        (<SvgNodeMatrix>node).getMatrix().getEdges().forEach( e => { edgesStr += e.getI() + ',' + e.getJ() + ' | '; } );

        this.graph.setNode(node.id,  { labelType: node.labelType,
                                           label: node.label + edgesStr,
                                           class: node.classStr });
      }
      else if ( node.renderableType === RenderableType.SvgFunctionNode ) {
        let edgesStr = '';

        (<SvgNodeFunction>node).getFunction().getEdges().forEach( e => { edgesStr += e.getI() + ',' + e.getJ() + ' | '; } );


        this.graph.setNode(node.id,  { labelType: node.labelType,
                                           label: node.label + edgesStr,
                                           class: node.classStr });

      }
      else {
        // console.log( '(<SvgEdge>node).edge: ' + (<SvgEdge>node).edge );
        // this.graph.setEdge((<SvgEdge>node).edge.getF(), (<SvgEdge>node).edge.getM(), { label: "open" });
        this.graph.setEdge((<SvgEdge>node).edge.getI(), (<SvgEdge>node).edge.getJ(), {
          style: 'stroke: #f52825; stroke-width: 3px; stroke-dasharray: 5, 5; fill:rgba(0,0,0,0.0);',
          arrowheadStyle: 'fill: #f52825',
          label: (<SvgEdge>node).edge.getI().toString() + ',' + (<SvgEdge>node).edge.getJ().toString()
        });
      }
    });

    const render: any = new dagreD3.render();
    // render(d3.select('#svgid'), this.graph);

    const svg = d3.select('#svgid');
    const svgGroup = svg.append('g');

    // Run the renderer. This is what draws the final graph.
    render(d3.select('svg g'), this.graph);

    // Center the graph
    // let xCenterOffset = (svg.attr("width") - this.graph.graph().width) / 2;
    // svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");

    svg.attr('width', this.graph.graph().width + 40);
    svg.attr('height', this.graph.graph().height + 40);

//    let xCenterOffset = (svg.attr("width") - g.graph().width) / 2;
//    svgGroup.attr("transform", "translate(" + xCenterOffset + ", 20)");
//    svg.attr("height", g.graph().height + 40);

//    nodes.forEach( node => {
//      MathJax.Hub.Queue(['Typeset', MathJax.Hub, 'mathjaxid' +  node.getId() ]);
//      MathJax.Hub.Queue(function () {
//        console.log('typesetting complete, adjust size');
//
//        let largestHeight = 0;
//        let largestWidth = 0;
//
//        for ( let i = 0; i < document.getElementsByClassName('math').length; i++ ) {
////          console.dir( document.getElementsByClassName('mathjaxm')[i].getAttribute('height') );
////          console.log( (document.getElementsByClassName('math')[i].getAttribute('height')) );
//          if ( document.getElementsByClassName('math')[i].clientHeight > largestHeight ) {
//            largestHeight = document.getElementsByClassName('math')[i].clientHeight;
//          }
//
//          if ( document.getElementsByClassName('math')[i].clientWidth > largestWidth ) {
//            largestWidth = document.getElementsByClassName('math')[i].clientWidth;
//          }
//        }
//
//        largestHeight *= 2;
//        largestWidth *= 2;
//
//        console.log('largestHeight:' + largestHeight);
//        console.log('largestWidth:' + largestWidth);
//        
//        for ( let i = 0; i < document.getElementsByTagName('rect').length; i++ ) {
//          document.getElementsByTagName('rect')[i].setAttribute('height', largestHeight.toString());
//          document.getElementsByTagName('rect')[i].setAttribute('width', largestWidth.toString());
//        }
//
//        for ( let i = 0; i < document.getElementsByTagName('foreignObject').length; i++ ) {
//          document.getElementsByTagName('foreignObject')[i].setAttribute('height', largestHeight.toString());
//          document.getElementsByTagName('foreignObject')[i].setAttribute('width', largestWidth.toString());
//        }
//
//    // ... your startup commands here ...
//      });
//    });


  }



}
