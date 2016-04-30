var visualize = function() {
	var freqData = new Uint8Array(1024);
	// set up and create svg
	var svgHeight = 300;
	var svgWidth = 1024;
	var circleRadius = 3;
	var createSVG = function(parent, height, width){
		return d3.select(parent)
						 .selectAll('svg')
						 .data(["red"])
						 .enter()
						 .append('svg')
						 .attr('height', height)
						 .attr('width', width);

	}
	var svg = createSVG('body', svgHeight, svgWidth);

	// set up color nodes
	svg.selectAll('circle')
		 .data(freqData)
		 .enter()
		 .append('circle')
		 .attr('cx', function(d, i) {
		 	 return i;
		 })
		 .attr('cy', function(d, i) {
		 	 return svgHeight - 5;
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
			 	return svgHeight - d;
			 })
	};
	visColors();

};

visualize();