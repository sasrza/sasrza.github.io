var gauge = function(container, configuration) {
	var that = {};
	var config = {
		size						: 710,
		clipWidth					: 200,
		clipHeight					: 110,
		ringInset					: 20,
		ringWidth					: 20,
		
		pointerWidth				: 20,
		pointerTailLength			: 5,
		pointerHeadLengthPercent	: 0.6,
		
		minValue					: -50,
		maxValue					: 50,
		
		minAngle					: -90,
		maxAngle					: 90,
		
		transitionMs				: 750,
		
		majorTicks					: 5,
		labelFormat					: d3.format('d'),
		labelInset					: 10,
		arcColorFn					: d3.interpolateHsl(d3.rgb('#e8e2ca'), d3.rgb('#3e6c0a')),
		viewportWidth               : 1366,
		ease                        : 'easeElastic'
	};
	var range = undefined;
	var r = undefined;
	var pointerHeadLength = undefined;
	var value = 0;
	
	var svg = undefined;
	var arc = undefined;
	var scale = undefined;
	var ticks = undefined;
	var tickData = undefined;
	var pointer = undefined;

	var donut = d3.pie();
	
	function deg2rad(deg) {
		return deg * Math.PI / 180;
	}
	
	function newAngle(d) {
		var ratio = scale(d);
		var newAngle = config.minAngle + (ratio * range);
		return newAngle;
	}
	
	function configure(configuration) {
		var prop = undefined;
		for ( prop in configuration ) {
			config[prop] = configuration[prop];
		}
		
		range = config.maxAngle - config.minAngle;
		r = config.size / 2;
		pointerHeadLength = Math.round(r * config.pointerHeadLengthPercent);

		// a linear scale that maps domain values to a percent from 0..1
		scale = d3.scaleLinear()
			.domain([-50,50]);
// 			.range([0,3])
// 			.domain([-50,-25,0,25,50]);
            // .range([config.minValue,-25,0,25, config.maxValue])
/*		scale = function (x){
		    switch(x){
		        case (x>=-50 || x<-26): return -50;
		        case (x>=-25 || x<-1): return -25;
		        case (x>=0 || x<26): return -50;
		    }
		};
*/	
		ticks = scale.ticks(config.majorTicks);
		tickData = d3.range(config.majorTicks).map(function() {return 1/config.majorTicks;});
		
		arc = d3.arc()
			.innerRadius(r - config.ringWidth - config.ringInset)
			.outerRadius(r - config.ringInset)
			.startAngle(function(d, i) {
				var ratio = d * i;
				return deg2rad(config.minAngle + (ratio * range));
			})
			.endAngle(function(d, i) {
				var ratio = d * (i+1);
				return deg2rad(config.minAngle + (ratio * range));
			});
	}
	that.configure = configure;
	
	function centerTranslation() {
		return 'translate('+r +','+ r +')';
	}
	
	function isRendered() {
		return (svg !== undefined);
	}
	that.isRendered = isRendered;
	
	function render(newValue) {
		svg = d3.select(container)
			.append('svg:svg')
				.attr('class', 'gauge')
				.attr('width', config.clipWidth)
				.attr('height', config.clipHeight);
		
		var centerTx = centerTranslation();
		
		var arcs = svg.append('g')
				.attr('class', 'arc')
				.attr('transform', centerTx);
		
		arcs.selectAll('path')
				.data(tickData)
			    .enter().append('path')
				.attr('fill', function(d, i) {
					return config.arcColorFn(d * i);
				})
				.attr('d', arc);
		
		var lg = svg.append('g')
				.attr('class', 'label')
				.attr('transform', centerTx);
		lg.selectAll('text')
				.data(ticks)
			    .enter().append('text').attr('class', 'scaleLabel')
				.attr('transform', function(d) {
					var ratio = scale(d);
					var newAngle = config.minAngle + (ratio * range);
					return 'rotate(' +newAngle +') translate(0,' +(config.labelInset - r) +')';
				})
				.text(config.labelFormat);

        var gaugeNewScale = [-50,-25,0,25,50];
        $('.scaleLabel').map(function(index, data){
            data.innerHTML = gaugeNewScale[index];
        });
        
		var lineData = [ [config.pointerWidth / 2, 0], 
						[0, -pointerHeadLength],
						[-(config.pointerWidth / 2), 0],
						[0, config.pointerTailLength],
						[config.pointerWidth / 2, 0] ];
		var pointerLine = d3.line().curve(d3.curveLinear)
		var pg = svg.append('g').data([lineData])
				.attr('class', 'pointer')
				.attr('fill','black')
				.attr('transform', centerTx);
				
		pointer = pg.append('path')
			.attr('d', pointerLine/*function(d) { return pointerLine(d) +'Z';}*/ )
			.attr('transform', 'rotate(' +config.minAngle +')');
			
		update(newValue === undefined ? 0 : newValue);
		
		var tabletView = viewportWidth>=992 && viewportWidth<1200;
        var muchWorseLabelX = (-0.27)*viewportWidth;
        muchWorseLabelX = (muchWorseLabelX < -135) ? -135 : muchWorseLabelX;
        muchWorseLabelX = tabletView ? -85 : muchWorseLabelX;
        var muchWorseLabelY = (-0.06)*viewportWidth;
        muchWorseLabelY = (muchWorseLabelY < -25) ? -25 : muchWorseLabelY;
        muchWorseLabelY = tabletView ? -15 : muchWorseLabelY;
        lg.append("text")
        .attr('class','muchWorseLabel')
        // .attr("dy", `${(viewportWidth<=320)?'-15px':'-25px'}`)
        // .attr("dx", `${(viewportWidth<=320)?'-82px':'-135px'}`)   
        .attr("dx", muchWorseLabelX)
        .attr("dy", muchWorseLabelY)
        .attr("text-anchor", "left")
        .text("Much Worse");

        
        var somewhatWorseLabel1X = (-0.19)*viewportWidth;
        somewhatWorseLabel1X = (somewhatWorseLabel1X < -90) ? -90 : somewhatWorseLabel1X;  
        somewhatWorseLabel1X = tabletView ? -70 : somewhatWorseLabel1X;
        var somewhatWorseLabel1Y = (-0.24)*viewportWidth;
        somewhatWorseLabel1Y = (somewhatWorseLabel1Y < -110) ? -110 : somewhatWorseLabel1Y;
        somewhatWorseLabel1Y = tabletView ? -80 : somewhatWorseLabel1Y;
        var somewhatWorseLabel2X = (-0.12)*viewportWidth;
        somewhatWorseLabel2X = (somewhatWorseLabel2X < -50) ? -50 : somewhatWorseLabel2X;        
        var somewhatWorseLabel2Y = (0.03)*viewportWidth;
        somewhatWorseLabel2Y = (somewhatWorseLabel2Y > 15) ? 15 : somewhatWorseLabel2Y;        
        lg.append("text")
        .attr('class','somewhatWorseLabel')
        .attr("text-anchor", "middle")
        .append("tspan")
        .attr("dx", somewhatWorseLabel1X)
        .attr("dy", somewhatWorseLabel1Y)        
        .attr("text-anchor", "middle")
        .text("Somewhat")     
        .append("tspan")
        .attr("dx", somewhatWorseLabel2X)
        .attr("dy", somewhatWorseLabel2Y)        
        .attr("text-anchor", "middle")
        .text("Worse");        
        
        var noChangeLabelY = (-0.4)*viewportWidth;
        noChangeLabelY = (noChangeLabelY < -150) ? -150 : noChangeLabelY;  
        noChangeLabelY = tabletView ? -100 : noChangeLabelY;
        lg.append("text")
        .attr('class','noChangeLabel')
        .attr("dy", `${(viewportWidth==425)?'-180':noChangeLabelY}`)
        .attr("dx", "0")
        .attr("text-anchor", "right")
        .text("No Change");
        

        var somewhatBetterLabel1X = (0.17)*viewportWidth;
        somewhatBetterLabel1X = (somewhatBetterLabel1X > 80) ? 80 : somewhatBetterLabel1X; 
        somewhatBetterLabel1X = tabletView ? 55 : somewhatBetterLabel1X;
        var somewhatBetterLabel1Y = (-0.24)*viewportWidth;
        somewhatBetterLabel1Y = (somewhatBetterLabel1Y < -110) ? -110 : somewhatBetterLabel1Y;     
        somewhatBetterLabel1Y = tabletView ? -80 : somewhatBetterLabel1Y;
        var somewhatBetterLabel2X = (-0.12)*viewportWidth;
        somewhatBetterLabel2X = (somewhatBetterLabel2X < -50) ? -50 : somewhatBetterLabel2X;        
        var somewhatBetterLabel2Y = (0.03)*viewportWidth;
        somewhatBetterLabel2Y = (somewhatBetterLabel2Y > 15) ? 15 : somewhatBetterLabel2Y;        
        lg.append("text")
        .attr('class','somewhatBetterLabel')
        .attr("text-anchor", "middle")
        .append("tspan")
        .attr("dy", somewhatBetterLabel1Y)
        .attr("dx", somewhatBetterLabel1X)        
        .attr("text-anchor", "middle")
        .text("Somewhat")     
        .append("tspan")
        .attr("dy", somewhatBetterLabel2Y)
        .attr("dx", somewhatBetterLabel2X) 
        .attr("text-anchor", "middle")
        .text("Better");        

        var isIOS = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
        var muchBetterLabelX = (0.37)*viewportWidth;
        var muchBetterLabelX425 = (viewportWidth <= 425) ? (isIOS ? 120 : 153) : 135;//153
        muchBetterLabelX = (muchBetterLabelX > muchBetterLabelX425) ? muchBetterLabelX425 : muchBetterLabelX;
        // muchBetterLabelX = (muchBetterLabelX > 135) ? 135 : muchBetterLabelX;
        muchBetterLabelX = tabletView ? 85 : muchBetterLabelX;
        var muchBetterLabelY = (-0.06)*viewportWidth;
        muchBetterLabelY = (muchBetterLabelY < -25) ? -25 : muchBetterLabelY;
        muchBetterLabelY = tabletView ? -15 : muchBetterLabelY;
        lg.append("text")
        .attr('class','muchBetterLabel')
        .attr("dx", muchBetterLabelX)
        .attr("dy", muchBetterLabelY)        
        .attr("text-anchor", "middle")
        .text("Much Better");
        
	}
	that.render = render;
	
	function update(newValue, newConfiguration) {
		if ( newConfiguration  !== undefined) {
			configure(newConfiguration);
		}
		var ratio = scale(newValue);
		var newAngle = config.minAngle + (ratio * range);
        switch(true){
/*            case (newValue>=-50 && newValue<=-26): newAngle = -75; break;
            case (newValue>=-25 && newValue<=-1): newAngle = -35; break;
            case (newValue==0): newAngle = 0; break; 
            case (newValue>=1 && newValue<=25): newAngle = 35; break;
            case (newValue>=26 && newValue<=50): newAngle = 75; break;
*/            
            case (newValue>=-50.9 && newValue<=-26): newAngle = -75; break;
            case (newValue>=-25.9 && newValue<=-0.1): newAngle = -35; break;
            case (newValue==0): newAngle = 0; break; 
            case (newValue>=0.1 && newValue<=25.9): newAngle = 35; break;
            case (newValue>=26 && newValue<=50.9): newAngle = 75; break;

        }
// 		console.log('newAngle = config.minAngle + (ratio * range):', newAngle);
        // console.log('config.transitionMs: ',config.transitionMs);
        // console.log('config.ease: ',config.ease);
		pointer.transition()
			.duration(config.transitionMs)
			.ease(d3[config.ease])//d3.easeQuadInOut easeElastic easeBack easeLinear
			.attr('transform', 'rotate(' +newAngle +')');
	}
	that.update = update;


    function wrap(text, width) {
    text.each(function () {
        var text = d3.select(this),
            words = text.text().split(/\s+/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 1.1, // ems
            x = text.attr("x"),
            y = text.attr("y"),
            dy = 0, //parseFloat(text.attr("dy")),
            tspan = text.text(null)
                        .append("tspan")
                        .attr("x", x)
                        .attr("y", y)
                        // .attr("dy", dy + "em");
        while (word = words.pop()) {
            line.push(word);
            tspan.text(line.join(" "));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(" "));
                line = [word];
                tspan = text.append("tspan")
                            .attr("x", x)
                            .attr("y", y)
                            .attr("dy", ++lineNumber * lineHeight + dy + "em")
                            .text(word);
            }
        }
    });
}
	configure(configuration);
	
	return that;
};

