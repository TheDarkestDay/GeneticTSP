window.onload = function() {
    
    var runBtn = document.getElementById('run'),
        generationsCountField = document.getElementById('generationsCount'),
        mutationRateField = document.getElementById('mutationRate'),
        populationSizeField = document.getElementById('populationSize'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        cities = [],
        pop,
        tournamentSize = 5,
        citiesSeq = 0;
    
    var Population = function() {
        this.species = [];
    };
    
    Population.prototype.add = function(spec) {
        this.species.push(Object.assign([],spec));
    };
    
    Population.prototype.size = function() {
        return this.species.length;
    };
    
    Population.prototype.get = function(index) {
        return this.species[index];
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
    
    function evolve(population) {
        
    };
    
    function tournamentSelection(population) {
        var tournament = new Population(),
            randIndex;
        
        for (var i=0;i<tournamentSize;i++) {
            randIndex = Math.floor(Math.random()*population.size());
            tournament.add(Population.get(randIndex));
        };
        
        return findFittestFrom(tournament);
    };
    
    function findFittestFrom(population) {
        var currBest = getFitness(population.get(0)),
            bestIndex = 0;
        
        for (var i=0;i<population.size();i++) {
            if (getFitness(population.get(i)) > currBest) {
                currBest = getFintess(population.get(i));
                bestIndex = i;
            };
        };
    };
    
    function getFitness(route) {
        return 1/getDistanceOf(route);
    };
    
    function getDistanceOf(route) {
        
    };
    
    function crossOver() {
        
    };
    
    runBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        
        var generationsCount = parseInt(generationsCountField.value);
        
        generateFirstPopulation();
        console.log(pop);
        
        for (var i=0;i<generationsCount;i++) {
            pop = evolve(pop);
        };
    });
};