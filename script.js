window.onload = function() {
    
    var runBtn = document.getElementById('run'),
        generationsCountField = document.getElementById('generationsCount'),
        mutationRateField = document.getElementById('mutationRate'),
        populationSizeField = document.getElementById('populationSize'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        cities = [],
        pop,
        citiesSeq = 0;
    
    var Population = function() {
        this.species = [];
    };
    
    Population.prototype.add = function(spec) {
        this.species.push(Object.assign([],spec));
    };
    
    canvas.addEventListener('click', function(evt) {
        var rect = canvas.getBoundingClientRect();
        citiesSeq++;
        cities.push({
            id: citiesSeq,
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        });
        ctx.beginPath();
        ctx.arc(cities[cities.length-1].x,cities[cities.length-1].y,10,0,2*Math.PI,false);
        ctx.stroke();
    });
    
    function generateFirstPopulation() {
        var initPopCount = parseInt(populationSizeField.value),
            tempCities,
            tempRoute,
            randIndex;
        
        pop = new Population();
        
        for (var i=0;i<initPopCount;i++) {
            tempCities = Object.assign([],cities);
            tempRoute = [];
            while (tempCities.length) {
                randIndex = Math.floor(Math.random()*tempCities.length);
                tempRoute.push(tempCities[randIndex]);
                tempCities.splice(randIndex,1);
            };
            pop.add(tempRoute);
        };
    };
    
    runBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        
        generateFirstPopulation();
        console.log(pop);
        
        /*for (var i=0;i<generationsCount;i++) {
            evolve(pop);
        };*/
    });
};