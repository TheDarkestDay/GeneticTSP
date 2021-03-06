var assert = require('assert');



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
            };
            
            result.add(newRoute);
        };
        
        return result;
    };



