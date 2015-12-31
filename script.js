window.onload = function() {
    
    var runBtn = document.getElementById('run'),
        generationsCountField = document.getElementById('generationsCount'),
        mutationRateField = document.getElementById('mutationRate'),
        populationSizeField = document.getElementById('populationSize'),
        log = document.getElementById('log'),
        canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        elitismCheckbox = document.getElementById('elitismCheckbox'),
        cities = [],
        pop,
        tournamentSize = 5,
        elitismOffset = 0,
        mutationRate;
    
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
        cities.push({
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
            newRoute,
            mutateRoll;
        
        if (elitismOffset) {
            result.add(findFittestFrom(population));
        };
        
        for (var i=elitismOffset;i<population.size();i++) {
            dad = tournamentSelection(population);
            mom = tournamentSelection(population);
            
            newRoute = crossOver(dad,mom);
            
            mutateRoll = Math.random();
            if (mutateRoll < mutationRate) {
                mutate(newRoute);
                console.log('Mutation happens');
            };
            
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
            tournament.add(population.get(randIndex));
            usedIndicies.push(randIndex);
        };
        
        return findFittestFrom(tournament);
    };
    
    function findFittestFrom(population) {
        var currBest = getFitness(population.get(0)),
            bestIndex = 0;
        
        for (var i=0;i<population.size();i++) {
            if (getFitness(population.get(i)) > currBest) {
                currBest = getFitness(population.get(i));
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
            if (i == route.length-2) {
                result += Math.sqrt(Math.pow(route[0].x-route[i+1].x,2)+Math.pow(route[0].y-route[i+1].y,2));
            };
        };
        
        return result;
    };
    
    function crossOver(dad,mom) {
        var startPos = Math.floor(Math.random()*dad.length),
            endPos = Math.floor(Math.random()*dad.length),
            tempPos,
            child = [];
        
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
        var first = Math.floor(Math.random()*route.length),
            second = Math.floor(Math.random()*route.length),
            tempCity;
        
        while (first == second) {
            second = Math.floor(Math.random()*route.length);
        };
        
        tempCity = route[second];
        route[second] = route[first];
        route[first] = tempCity;
    };
    
    runBtn.addEventListener('click', function(evt) {
        var optimalPath,
            paragraph;
        evt.preventDefault();
        
        init();
        
        if (elitismCheckbox.getAttribute('checked')) {
            elitismOffset = 1;
        };
        
        mutationRate = parseInt(mutationRateField.value)/100;
        
        var generationsCount = parseInt(generationsCountField.value);
        
        generateFirstPopulation();
        
        console.log(getFitness(findFittestFrom(pop)));
        
        for (var i=0;i<generationsCount;i++) {
            pop = evolve(pop);
            paragraph = document.createElement('p');
            paragraph.innerHTML = 'Generation №'+(i+1)+': '+'<br />'+getFitness(findFittestFrom(pop));
            log.appendChild(paragraph);
        };
        
        console.log(pop);
        optimalPath = findFittestFrom(pop);
        
        drawPath(optimalPath);
    });
    
    function drawPath(path) {
        ctx.beginPath();
        for (var i=0;i<path.length-1;i++) {
            ctx.moveTo(path[i].x,path[i].y);
            ctx.lineTo(path[i+1].x,path[i+1].y);
            if (i==path.length-2) {
                ctx.moveTo(path[i+1].x,path[i+1].y);
                ctx.lineTo(path[0].x,path[0].y);
            };
        };
        ctx.stroke();
    };
    
    function init() {
        ctx.clearRect(0,0,500,500);
        for (var i=0;i<cities.length;i++) {
            ctx.beginPath();
            ctx.arc(cities[i].x,cities[i].y,10,0,2*Math.PI,false);
            ctx.stroke();
        };
    };
};