class MathFunction {
    constructor(fun, min, max, step){
        this.domain = {
            step,
            min,
            max,
            isValid: function(domValue){
                if(Math.round(domValue % step)){
                    return false;
                }
                return (this.min.value === 'inf' || (this.min.included && domValue >= this.min.value)
                || (!this.min.included && domValue > this.min.value))
                && (this.max.value === 'inf' || (this.max.included && domValue <= this.max.value)
                || (!this.max.included && domValue < this.max.value))
            },
            getRandomElem: function(){
                let min, max, randomFloat;
                min = this.min.value === 'inf' ? -1000 : this.min.included ? this.min.value : this.min.value+1;
                max = this.max.value === 'inf' ? 1000 : this.max.included ? this.max.value+1 : this.max.value;
                randomFloat = Math.floor(Math.random() * (max - min) + min);
                let ret = Math.trunc(randomFloat/this.step) * this.step;
                return ret;
            },
            getNeighbors: function(domValue){
                let neighbors = [];
                let rightNeighbor = domValue+this.step;
                let leftNeighbor = domValue-this.step;
                if(this.isValid(leftNeighbor))
                    neighbors.push(leftNeighbor);
                if(this.isValid(rightNeighbor))
                    neighbors.push(rightNeighbor);
                return neighbors;
            }
        };
        this.eval = function(x){
            if(this.domain.isValid(x))
                return fun(x);
            console.log("entrada ", x, " no valida para el dominio indicado");
        };
    }
}

export default MathFunction;