// use strict
"use strict";

// show initial condition without time integration
startAnimation(false);

// start animation
function startAnimation(is_not_init) {
    // ID of animation
    var graphID = 'myGraph'

    // ID of log text
    var log_elem = document.getElementById("log_text");
    log_elem.innerHTML='<h3>Log output</h3>';

    // get input parameters
    var inx = Number(document.getElementById('input_inx').value);

    // check input parameters
    var inx_min = 6;
    var inx_max = 1000;
    if (inx < inx_min || inx > inx_max) {
	inx = Math.min(Math.max(inx,inx_min),inx_max);
    }
    log_output('inx = ' + inx)

    // get initial condition parameter
    const init_name = document.getElementById('input_init').value;
    log_output('init_name = ' + init_name);

    // get reconstruction parameter
    const rcnst_name = document.getElementById('input_rcnst').value;
    log_output('rcnst_name = ' + rcnst_name);

    // define domain parameters
    var margin = 3;
    var ix = inx+margin*2;
    var i0 = margin;
    var i1 = ix-margin-1;
    var x0 = 0.0;
    var x1 = 1.0;
    var dx = (x1-x0)/(ix-margin*2);

    // define advection parameters
    var vx = 1.0;
    var dt = 0.1*dx/Math.abs(vx); // CFL condition

    // initialize animation parameters
    var nmax = 10000;
    var nout = 20;
    var tend = 1.0;
    var dtout = tend/nout;
    var time = 0.0;
    var interval = 100; // time interval of animation [ms]

    // setup coordinate
    var x = [];
    for (var i = 0; i<ix; i++) {
	x[i] = x0+(i-margin+0.5)*dx;
    }

    // setup initial condition
    var y1 = [];
    var y2 = [];
    analyticSolution(y1,x,ix,vx,time);
    analyticSolution(y2,x,ix,vx,time);
    plotData(x,y1,y2,time,graphID);
    if (!is_not_init) { return false; }

    // integrate PDE
    var times = [time];
    var y1s = [y1];
    var tout = time+dtout;
    for (var n = 0; n < nmax; n++) {
    	// break for loop
    	if (time>tend) { break; }

    	// time advance
    	timeAdvance(y1,vx,dt);
    	time+=dt;

    	// store data
    	if (time>tout) {
	    times.push(time);
	    y1s.push(y1.slice()); // force pass by value
    	    log_output('time = ' + time.toFixed(2) +
    			', y1[ix/2] = ' + y1s[y1s.length-1][3].toFixed(2));
    	    tout+=dtout;
    	}
    }

    // animate data
    var myTimer = setInterval(event,interval);
    var nd = 0;
    function event() {
	if (nd < times.length-1) {
	    // time advance
	    nd++;
	    time = times[nd]
	    y1 = y1s[nd]
	    analyticSolution(y2,x,ix,vx,time);
    	    log_output('time = ' + time.toFixed(2) +
    	    		', y1[ix/2] = ' + y1[3].toFixed(2));

	    // plot data
	    plotData(x,y1,y2,time,graphID);
	} else {
	    // stop animation
	    clearInterval(myTimer);
	}
    }

    // plot data
    function plotData(x,y1,y2,time,id) {
	// plot data
	var line1 = {
	    x: x,
	    y: y1,
	    mode: 'lines+markers',
	    name: 'Numerical'
	};
	var line2 = {
	    x: x,
	    y: y2,
	    mode: 'lines+markers',
	    line: {
		dash: 'dash'
	    },
	    name: 'Analytic'
	};
	var data = [line1,line2];
	var layout = {
	    title:'1D Scalar Advection (time = ' + time.toFixed(2) + ')',
	    yaxis: {range: [-0.1, 1.1]}
	};
	Plotly.newPlot(id, data, layout);
    }

    // analytical solution
    function analyticSolution(y,x,ix,vx,time) {
    	switch (init_name) {
    	case 'box': // box function
    	    for (var i = 0; i < ix; i++) {
		var xt = (x[i]-vx*time)/(x1-x0);
		var xtsin = Math.sin(2.0*Math.PI*xt);
		var xtcos = Math.cos(2.0*Math.PI*xt);
		xt = Math.atan2(xtsin,xtcos)/(2.0*Math.PI);
		xt = (xt+1.0)%1.0;
    		if (xt > 0.25 && xt <= 0.75) {
    		    y[i] = 1.00;
    		} else {
    		    y[i] = 0.01;
    		}
    	    }
    	    break;
    	default: // sin function
    	    for (var i = 0; i < ix; i++) {
		var xt = (x[i]-vx*time)/(x1-x0);
		var xtsin = Math.sin(2.0*Math.PI*xt);
		var xtcos = Math.cos(2.0*Math.PI*xt);
		xt = Math.atan2(xtsin,xtcos)/(2.0*Math.PI);
		xt = (xt+1.0)%1.0;
    		y[i] = 0.5*Math.sin(2.0*Math.PI*xt)+0.5;
    	    }
    	    break;
    	}
    }

    // slope limiter of piecewise linear reconstruction
    function slopeLimiter(u1,u2,u3) {
    	switch (rcnst_name) {
    	case 'mc': // MC limiter
	    return mc_lim(u2-u1,u3-u2);
	    break;
	default: // Minmod limiter
	    return mm_lim(u2-u1,u3-u2);
	    break;
	}
    }

    // Monotonized-central limiter
    function mc_lim(a,b) {
	return 0.5*(Math.sign(a)+Math.sign(b))
	    *Math.min(2.0*Math.abs(a),
		      2.0*Math.abs(b),
		      0.5*Math.abs(a+b));
    }

    // Minmod limiter
    function mm_lim(a,b) {
	return 0.5*(Math.sign(a)+Math.sign(b))
	    *Math.min(Math.abs(a),Math.abs(b));
    }

    // time advance
    function timeAdvance(y,vx,dt) {
	// store initial data
	var y0 = y;

    	switch (tinteg_name) {
    	case 'ssprk33': // 3-step 3nd-order Runge-Kutta method
	    timeAdvance(y,vx,dt)
	    timeAdvance(y,vx,dt)
	    for (var i=i0; i<=i1; i++) {
		y[i] = 0.25*y0[i]+0.75*y[i]
	    }
	    timeAdvance(y,vx,dt)
	    for (var i=i0; i<=i1; i++) {
		y[i] = (y0[i]+2.0*y[i])/3.0
	    }
	    break;
    	case 'ssprk22': // 2-step 2nd-order Runge-Kutta method
	    timeAdvance(y,vx,dt)
	    timeAdvance(y,vx,dt)
	    for (var i=i0; i<=i1; i++) {
		y[i] = 0.5*(y0[i]+y[i])
	    }
	    break;
	default: // 1st-order Euler method
	    timeAdvance(y,vx,dt)
	    break;
	}
    }

    // time advance with 1st-order Euler method
    function timeAdvance(y,vx,dt) {
	// evalulate numerical flux at i+1/2
	var f = [];
	for (var i=i0-1; i<=i1; i++) {
	    var dyl = slopeLimiter(y[i-1],y[i],y[i+1])
	    var dyr = slopeLimiter(y[i],y[i+1],y[i+2])
	    var yl = y[i]+0.5*dyl;
	    var yr = y[i+1]-0.5*dyr;
	    f[i] = 0.5*vx*(yl+yr)+0.5*Math.abs(vx)*(yl-yr);
	}

	// advance in time
	var dtdxi = dt/dx;
	for (var i=i0; i<=i1; i++) {
	    y[i] = y[i]-dtdxi*(f[i]-f[i-1]);
	}

	// apply boundary condition
	for (var i=0; i<margin; i++) {
	    y[i0-i-1] = y[i1-i];
	}
	for (var i=0; i<margin; i++) {
	    y[i1+i+1] = y[i0+i];
	}
    }

    // output log message
    function log_output(msg) {
	console.log(msg);
	log_elem.append(msg,document.createElement("br"));
	// log_elem.prepend(msg,document.createElement("br"));
    }

    return false;
}
