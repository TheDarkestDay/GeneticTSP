window.onload = function() {
    
    var runBtn = document.getElementById('run'),
        generationsCountField = document.getElementById('generationsCount'),
        mutationRateField = document.getElementById('mutationRate'),
        populationSizeField = document.getElementById('populationSize'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        elitismCheckbox = document.getElementById('elitismCheckbox'),
        cities = [],
        pop,
        tournamentSize = 5,
        elitismOffset = 0,
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
    
    Population.prototype.all = function() {
        return this.species;
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
        var result = new Population(),
            dad,
            mom,
            newRoute;
        
        for (var i=elitismOffset;i<population.size();i++) {
            dad = tournamentSelection(population);
            mom = tournamentSelection(population);
            
            newRoute = crossOver(dad,mom);
            
            newRoute = mutate(newRoute);
            result.add(newRoute);
        };
        
        return result;
    };
    
    function tournamentSelection(population) {
        var tournament = new Population(),
            randIndex,
            usedIndicies = [];
        
        for (var i=0;i<tournamentSize;i++) {
            randIndex = Math.floor(Math.random()*population.size());
            while (usedIndicies.indexOf(randIndex) != -1) {
                randIndex = Math.floor(Math.random()*population.size());
            };
            tournament.add(Population.get(randIndex));
            usedIndicies.push(randIndex);
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
        
        return population.get(bestIndex);
    };
    
    function getFitness(route) {
        return 1/getDistanceOf(route);
    };
    
    function getDistanceOf(route) {
        var result = 0;
        
        for (var i=0;i<route.length-1;i++) {
            result += Math.sqrt(Math.pow(route[i+1].x-route[i].x,2)+Math.pow(route[i+1].y-route[i].y,2));
        };
        
        return result;
    };
    
    function crossOver(dad,mom) {
        var startPos = Math.floor(Math.random()*dad.length),
            endPos = Math.floor(Math.random()*dad.length),
            tempPos,
            child;
        
        for (var i=0;i<dad.length;i++) {
            child.push(0);
        }
        
        while (startPos == endPos) {
            endPos = Math.floor(Math.random()*dad.length);
        };
        
        if (startPos > endPos) {
            tempPos = endPos;
            endPos = startPos;
            startPos = tempPos;
        };
        
        for (var i=startPos;i<endPos;i++) {
            child[i] = dad[i];
        };
        
        for (var i=0;i<mom.length;i++) {
            var j;
            if (child.indexOf(mom[i]) == -1) {
                j = 0;
                while (child[j] != 0) {
                    j++;
                };
                child[j] = mom[i];
            };
        };
        
        return child;
    };
    
    function mutate(route) {
        
    };
    
    runBtn.addEventListener('click', function(evt) {
        evt.preventDefault();
        
        if (elitismCheckbox.getAttribute('checked')) {
            elitismOffset = 1;
        };
        
        var generationsCount = parseInt(generationsCountField.value);
        
        generateFirstPopulation();
        
        for (var i=0;i<generationsCount;i++) {
            pop = evolve(pop);
        };
        
        console.log(pop);
    });
};