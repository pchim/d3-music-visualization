var visualize = function() {
	var freqData = new Uint8Array(1024);
	// set up and create svg
	var svgHeight = 600;
	var svgWidth = 1024;
	var circleRadius = 3;
	var createSVG = function(parent, height, width){
		return d3.select(parent)
						 .selectAll('svg')
						 .data(["red"])
						 .enter()
						 .append('svg')
						 .attr('height', height)
						 .attr('width', width)
						 .classed('sky', true);
	}

	// create the floor
	var svg = createSVG('body', svgHeight, svgWidth);

	// set up background sky
	var bgLight = 1;
	var bgHsl = "hsl(185, 100%," + "5" + '%)';
	var bgSun = 'up';
	var bgLow = svg.selectAll('rect')
							.data([0])
							.enter()
							.append('rect')
							.attr('width', '100%')
							.attr('height', '100%')
							.attr('fill', function(d, i) {
		 	 					return bgHsl; });
	var bgHsl = "hsl(185, 100%," + "70" + '%)';
	var bg = svg.append('rect')
							.attr('width', '100%')
							.attr('height', '50%')
							.attr('fill', function(d, i) {
		 	 					return bgHsl; })
							.attr('opacity', bgLight);

	// create the floor
	svg.selectAll('image')
		 .data(['assets/beach.jpeg'])
		 .enter()
		 .append('image')
		 .attr('height', svgHeight/2)
		 .attr('width', svgWidth)
		 .attr('x', '0')
		 .attr('y', svgHeight/2)
		 .attr('preserveAspectRatio', 'none')
		 .attr('xlink:href', function(d) { return d; });

	// transition background color
	var bgChange = function(){
		// 15 seconds
		var transitionTime = 15000;
		console.log(bgHsl);
		if (bgSun === 'up'){
			if (bgLight === 0) {
				bgLight = 1;
			} else if (bgLight === 1) {
				bgLight = 0;
			}
 			// bgHsl = "hsl(185, 100%," + bgLight + '%)';
 			bgSun = 'down';
			bg.transition().duration(transitionTime - 1)
				.attr('opacity', bgLight);
				// .attr('fill', function(d, i) {
		 	//  		return bgHsl; });
			setTimeout(bgChange, transitionTime);
		} else if (bgSun === 'down'){
			bgSun = 'up';
			setTimeout(bgChange, transitionTime / 2);
		} 
	};


	// set up color nodes
	svg.selectAll('circle')
		 .data(freqData)
		 .enter()
		 .append('circle')
		 .attr('cx', function(d, i) {
		 	 return i;
		 })
		 .attr('cy', function(d, i) {
		 	 return svgHeight/2 - 5;
		 })
		 .attr('r', circleRadius)
		 .attr('fill', function(d, i) {
		 	 return "hsl(" + Math.floor(i / 4) + ",100%,50%)";
		 })
		 .classed('node', true); 

	// set up audio context
	var audioContext = new (window.AudioContext || window.webkitAudioContext)();
	var audioElement = document.getElementById('audioElement');
	var audioSource = audioContext.createMediaElementSource(audioElement);
	var analyser = audioContext.createAnalyser();

	// connect analyser to audio source
	audioSource.connect(analyser);
	audioSource.connect(audioContext.destination);

	// stream the frequency data
	var visColors = function(){
		// run fn before repainting to screen
		requestAnimationFrame(visColors);
		// get frequency data
		analyser.getByteFrequencyData(freqData);

		svg.selectAll('circle.node')
			 .data(freqData)
			 .attr('cy', function(d) {
			 	return svgHeight/2 - d;
			 });
	};

	// add dancers

	var gifs = 'gifs/'
	var constDancers = ['gifs/bear.gif',
											'gifs/light.gif',
											'gifs/link_dance.gif',
											'gifs/panda.gif',
											'gifs/pikachu.gif',
											'gifs/shark.gif'];
	var allDancers = [];
	svg.selectAll('image.dancer')
							.data(allDancers)
							.enter()
							.append('image')
							.classed('dancer', true)
							.attr('height', 100)
							.attr('width', 100)
							.attr('x', Math.random()*svgWidth)
							.attr('y', svgHeight/2 + Math.random()*(svgHeight/2))
							.attr('xlink:href', function(d) { return d; });

	// add dancer oon click
	var addDancers = function() {
		var randomDancer = constDancers[Math.floor(Math.random()*constDancers.length)];
		allDancers.push(randomDancer);
		svg.selectAll('image.dancer')
							.data(allDancers)
							.enter()
							.append('image')
							.classed('dancer',true)
							.attr('height', 80)
							.attr('width', 80)
							.attr('x', Math.random()*svgWidth)
							.attr('y', svgHeight/2 + Math.random()*(svgHeight/2))
							.attr('xlink:href', function(d) { return d; });		
	};

	var stepDancers = function() {

	};

	d3.select('.add-dancer')
		.on('click', function() {
			addDancers();
	});

	bgChange();
	visColors();




};


visualize();