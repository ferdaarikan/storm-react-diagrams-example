import React, { Component } from 'react';
import './App.css';
import './test.css';
import './sass.css';
import * as SRD from 'storm-react-diagrams';

class App extends Component {
constructor(props){
  super(props);
  this.saveModel = this.saveModel.bind(this);
  this.loadModel = this.loadModel.bind(this);  
  this.clear = this.clear.bind(this);  
}

componentWillMount(){
  this.state = { saved: null, engine: {} }  
  const model = new SRD.DiagramModel();  
  const engine = new SRD.DiagramEngine(); 
  engine.version = 0; 
  this.setState({ engine : engine});

  const nodeInstanceFactory = new SRD.DefaultNodeInstanceFactory()
  const portInstanceFactory = new SRD.DefaultPortInstanceFactory()
  const linkInstanceFactory = new SRD.LinkInstanceFactory() 
  engine.registerInstanceFactory(nodeInstanceFactory);
  engine.registerInstanceFactory(portInstanceFactory);
  engine.registerInstanceFactory(linkInstanceFactory);

  const nodeFactory = new SRD.DefaultNodeFactory();
  const linkFactory = new SRD.DefaultLinkFactory();
  engine.registerNodeFactory(nodeFactory);    
  engine.registerLinkFactory(linkFactory);
  
  function getNode(name, color, ins, outs,  x,y){
  const node = new SRD.DefaultNodeModel(name, color);  
      node.x = x;
      node.y = y;

  node.addPort(new SRD.DefaultPortModel(true, ins, []));
  node.addPort(new SRD.DefaultPortModel(false, [ ], outs));
  return node;
  }

const node1 = getNode("Node-1", "red", ["in1", "in2"], ["out1"], 50, 50);
const node2 = getNode("Node-2", "green", ["in1", "in2"], ["out1"], 150, 150);
const node3 = getNode("Node-3", "blue", ["in1", "in2"], ["out1"], 250, 250);
const node4 = getNode("Node-4", "yellow", ["in1", "in2"], ["out1"], 350, 350);

model.addNode(node1);     
model.addNode(node2);     
model.addNode(node3);     
model.addNode(node4);     

  function link(from, to){
    const lnk = new SRD.LinkModel();
    lnk.setSourcePort(from.getOutPorts()[0]);
    lnk.setTargetPort(to.getInPorts()[0]);    
    return lnk;
  }
  
    model.addLink(link(node1, node2));
    model.addLink(link(node2, node3));
    model.addLink(link(node3, node4));
    model.addLink(link(node4, node1));

//Adding listener        
  engine.setDiagramModel(model);
};

//saved = {};
saveModel(){
  console.log("saving model");
  const engine = this.state.engine;
  const model = engine.getDiagramModel();
  this.setState({ saved : JSON.stringify(model.serializeDiagram()) });
}

clear(){
  console.log("clearing");
  const engine = this.state.engine;
  const model = engine.getDiagramModel();    
  const nodes = model.getNodes();
  const links = model.getLinks();

  let item = {};
  for (item in links){
    model.removeLink(item);
  };

for(item in nodes){
  model.removeNode(item);
}

  engine.version += 1;
  this.setState({engine: engine });
}

loadModel(){
  if(!this.state.saved)
    return;

  const engine = this.state.engine;  
  const model = new SRD.DiagramModel();
  console.log("loading model");     

  engine.setDiagramModel(model);       
  const diagram = JSON.parse(this.state.saved);
  model.deSerializeDiagram(diagram, engine);
  engine.version += 1;
  this.setState({engine: engine });
}

 render() {
  const engine = this.state.engine;
  const model = engine.getDiagramModel();

  if(!engine | !model){
    return;
  }

    return (
      <div className="App">        
        <button onClick={this.saveModel} style={{ width: 100+'px', height : 30+'px' }}>1-save</button>
        <button onClick={this.clear} style={{ width: 100+'px', height : 30+'px' }}>2-clear</button>  
        <button onClick={this.loadModel} style={{ width: 100+'px', height : 30+'px' }}>3-load</button>        
        <div style={{width:800+'px', height:600+'px', border: '1px solid red'}}>          
          <SRD.DiagramWidget diagramEngine={engine} />          
        </div>
      </div>
    );
  }
}

export default App;
