import './App.css';
import MathFunction from './MathFunction';
import { useState } from 'react';
function App() {
  const [fun, setFun] = useState('a');
  const [minIncluded, setMinIncluded] = useState(true);
  const [minValue, setMinValue] = useState('');
  const [maxIncluded, setMaxIncluded] = useState(true);
  const [maxValue, setMaxValue] = useState('');
  const [step, setStep] = useState(0.5);
  const [method, setMethod] = useState('hill');
  const [findMaximum, setFindMaximum] = useState(true);
  const [x, setX] = useState('');
  const [schedule, setSchedule] = useState({top: 100, decrement: 1});
  const [result, setResult] = useState({state: '?', value: '?'});
  const [pasosTabla, setPasosTabla] = useState([]);
  function search(){
    let problem;
    switch(fun){
      case "a":
        problem = function(x){
          return x * x;
        };
        break;
      case "b":
        problem = function(x){
          return 5 + 0.5 * x*x - 5 * Math.cos(3*x);
        };
        break;
      default: break;
    }
    let min = minValue;
    let max = maxValue;
    if(min !== 'inf')
      min = parseInt(min);
    if(max !== 'inf')
      max = parseInt(max);
    let mathFun = new MathFunction(problem, {value: min, included: minIncluded}, {value: max, included: maxIncluded}, step);
    let initialX = x === '' ? mathFun.domain.getRandomElem() : parseInt(x);
    if(!mathFun.domain.isValid(initialX)){
      alert("Valor inicial para x NO válido para el dominio y/o paso indicado");
      return;
    }
    let sch = function(time){
      return schedule.top - schedule.decrement * time;
    };
    switch(method){
      case "hill":
        setResult(hillClimbing(mathFun, {findMaximum, initialState: initialX})); break;
      case "simulated":
        setResult(simulatedAnnealing(mathFun, sch, {findMaximum, initialState: initialX}))
    }
  }

  function makeNode(problem, state = null){
    state = state == null ? problem.domain.getRandomElem() : state;
    return {
        state,
        value: problem.eval(state),
        neighbors: problem.domain.getNeighbors(state),
    };
  }

function findBestNeighbor(problem, node, findMaximum){
    let best; 
    node.neighbors.forEach( neighbor => {
        neighbor = makeNode(problem, neighbor);
        if(best == null)
            best = neighbor;
        else{
            if(findMaximum)
                best = neighbor.value > best.value ? neighbor : best;
            else
                best = neighbor.value < best.value ? neighbor : best;
        }
    });
    return best;
}

function getRandomNeighbor(problem, node){
  let neighbors = [];
  node.neighbors.forEach( neighbor => {
    neighbor = makeNode(problem, neighbor);
    neighbors.push(neighbor);
  })
  return neighbors[Math.floor(Math.random() * neighbors.length)]
}

  function hillClimbing(problem, {findMaximum = true, initialState = null} = {}){
    let current, neighbor, log, i;
    i = 0;
    log = [];
    current = makeNode(problem, initialState);
    while(i<1000){ //para evitar loops infinitos cuando no hay maximo o minimo global
        neighbor = findBestNeighbor(problem, current, findMaximum);
        log.push({curNode: current.state, curValue: current.value, bestNeighbor: neighbor.state});
        if(findMaximum && neighbor.value <= current.value){
            setPasosTabla(log);
            return current;
        }else if(!findMaximum && neighbor.value >= current.value){
            setPasosTabla(log);
            return current;
        }
        current = neighbor;
        i++;
    }
    alert("timeout de 1000 iteraciones alcanzado");
    setPasosTabla(log);
    return current;
  }

  function simulatedAnnealing(problem, schedule, {findMaximum = true, initialState = null} = {}){
    let current, next, temperature, time, val_diff, probability, log;
    log = [];
    time = 1;
    current = makeNode(problem, initialState);
    probability = "-";
    while(true){
      temperature = schedule(time);
      if(temperature <= 0){
        log.push({curNode: current.state, curValue: current.value, bestNeighbor: next.state, temperature, probability: '-'});
        setPasosTabla(log);
        return current;
      }
      next = getRandomNeighbor(problem, current);
      val_diff = findMaximum ? next.value - current.value : current.value - next.value;
      probability = Math.pow(Math.E, val_diff/temperature);
      log.push({curNode: current.state, curValue: current.value, bestNeighbor: next.state, temperature, probability});
      if(val_diff > 0){
        log[log.length-1].probability = 1;
        current = next;
      }else{
        if(Math.random() < probability)
          current = next;
      }
      time++;
    }
  }

  return (
    <div>
      <h1>Búsqueda Lineal</h1>
      <form>
        <p>
          <label htmlFor="fun">Funcion: f(x) =</label>
          <select id="fun" name='fun' onChange={e => setFun(e.target.value)}>
            <option value="a">x^2</option>
            <option value="b">5 + 0.5 * x^2 - 5 * cos(3*x)</option>
          </select>
        </p>
        <p>
          <label>Dominio: </label>
          <select id="minIncluded" name='minIncluded' onChange={e => setMinIncluded(e.target.value === "y")}>
            <option value="y">[</option>
            <option value="n">(</option>
          </select>
          <input type="text" id="minValue" name="minValue" placeholder='ej: -10' onChange={e => setMinValue(e.target.value)}/>
          <span>, </span>
          <input type="text" id="maxValue" name="maxValue" placeholder='ej: 10' onChange={e => setMaxValue(e.target.value)}/>
          <select id="maxIncluded" name='maxIncluded' onChange={e => setMaxIncluded(e.target.value === "y")}>
            <option value="y">]</option>
            <option value="n">)</option>
          </select>
        </p>
        <p><small>Nota: para "infinito" en alguna parte del dominio escriba "inf"</small></p>
        <p>
          <label htmlFor="step">Paso: </label>
          <select id="step" name='step' onChange={e => setStep(parseFloat(e.target.value))}>
            <option value="0.5">0.5</option>
            <option value="1">1</option>
            <option value="1.5">1.5</option>
            <option value="2">2</option>
          </select>
        </p>
        <p>
          <label htmlFor="x">Valor Inicial para x: </label>
          <input id="x" name='x' type="number" onChange={e => setX(e.target.value)} />
        </p>
        <p><small>Dejar vacio para elegir un valor aleatorio</small></p>
        <p>
          <label htmlFor="method">Método: </label>
          <select id="method" name='method' onChange={e => setMethod(e.target.value)}>
            <option value="hill">Hill Climbing</option>
            <option value="simulated">Simulated Annealing</option>
          </select>
        </p>
        {method === "simulated" && 
        <p>
          <label>Schedule: </label>
          <span>Tope de temperatura: </span>
          <input type="number" name="top" id="top" placeholder='ej: 100' onChange={e => setSchedule({top: parseInt(e.target.value), decrement: schedule.decrement})}/>
          <span>Decremento por iteracion: </span>
          <input type="number" name="decrement" id="decrement" placeholder='ej: 1' onChange={e => setSchedule({top: schedule.top, decrement: parseInt(e.target.value)})}/>
        </p>
        }
        <p>
          <label htmlFor="findMaximum">Buscar el máximo</label>
          <input defaultChecked={true} type="checkbox" id="findMaximum" name="findMaximum" value="y" onChange={e => {setFindMaximum(e.currentTarget.checked)}} />
        </p>
        
      </form>
      <button onClick={() => search()}>Click!</button>
      <h2>Resultado: Nodo x={result.state} con y={result.value}</h2>
      <h3>Traza</h3>
      <table style={{border: "1px solid black", borderCollapse: 'collapse', textAlign: 'center'}}>
        <tr>
          <th>Iteracion--</th><th>Nodo Actual--</th><th>Valor Actual--</th><th>Vecino Seleccionado---</th>
          {method === "simulated" && <><th>Temperatura---</th><th>Probabilidad---</th></>}
        </tr>
        {
          pasosTabla.map((val, key) => {
            return(
              <tr style={{border: "1px solid black"}} key={key}>
                <td>{key}</td>
                <td>{val.curNode}</td>
                <td>{val.curValue}</td>
                <td>{val.bestNeighbor}</td>
                {method === "simulated" && <><td>{val.temperature}</td><td>{val.probability}</td></>}
              </tr>
            )
          })
        }
      </table>
    </div>
  ); 
}
export default App;
