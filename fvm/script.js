// use strict
"use strict";

startAnimation(false);

// start animation
function startAnimation(is_not_init) {
    // graph ID
    var graphID='myGraph'

    // get input parameters
    var inx=Number(document.getElementById('input_inx').value);

    // check input parameters
    var inx_min=6;
    var inx_max=1000;
    if (inx < inx_min || inx > inx_max) {
	inx = Math.min(Math.max(inx,inx_min),inx_max);
    }
    console.log('inx = ' + inx);

    // initial condition parameter
    var imodel = 'sin'
    // var imodel = 'box'

    // define domain parameters
    var margin=3;
    var ix=inx+margin*2;
    var i0 = margin;
    var i1 = ix-margin-1;
    var x0=0.0;
    var x1=1.0;
    var dx=(x1-x0)/(ix-margin*2);

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
    for (var i=0; i<ix; i++) {
	x[i]=x0+(i-margin+0.5)*dx;
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
    	    console.log('time = ' + time.toFixed(2) +
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
    	    console.log('time = ' + time.toFixed(2) +
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
	    name: 'Minmod'
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
    	switch (imodel) {
    	case 'box': // box function
    	    for (var i = 0; i < ix; i++) {
		var xt = (x[i]-vx*time)/(x1-x0);
		var xtsin = Math.sin(2.0*Math.PI*xt);
		var xtcos = Math.cos(2.0*Math.PI*xt);
		xt = Math.atan2(xtsin,xtcos)/(2.0*Math.PI);
		xt = (xt+1.0)%1.0;
    		if (xt > 0.25 && xt <= 0.75) {
    		    y[i]=1.00;
    		} else {
    		    y[i]=0.01;
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
    		y[i]=0.5*Math.sin(2.0*Math.PI*xt)+0.5;
    	    }
    	    break;
    	}
    }

    // slope limiter of piecewise linear reconstruction
    function slopeLimiter(u1,u2,u3) {
	return minmod2(u2-u1,u3-u2);
	// return minmod3(2.0*(u2-u1),0.5*(u3-u1),2.0*(u3-u2));
    }

    // minmod function minmod(a,b)
    function minmod2(a,b) {
	return 0.5*(Math.sign(a)+Math.sign(b))
	    *Math.min(Math.abs(a),Math.abs(b));
    }

    // minmod function minmod(a,b,c)
    function minmod3(a,b,c) {
	return 0.25*(Math.sign(a)+Math.sign(b))
	    *(Math.sign(b)+Math.sign(c))
	    *Math.min(Math.abs(a),Math.abs(b),Math.abs(c));
    }

    // time advance
    function timeAdvance(y,vx,dt) {
	// store initial data
	var y0 = y;

	// evalulate numerical flux at i+1/2
	var f = [];
	for (var i=i0-1; i<=i1; i++) {
	    var dyl=slopeLimiter(y[i-1],y[i],y[i+1])
	    var dyr=slopeLimiter(y[i],y[i+1],y[i+2])
	    var yl=y[i]+0.5*dyl;
	    var yr=y[i+1]-0.5*dyr;
	    f[i]=0.5*vx*(yl+yr)+0.5*Math.abs(vx)*(yl-yr);
	}

	// advance in time
	var dtdxi = dt/dx;
	for (var i=i0; i<=i1; i++) {
	    y[i]=y0[i]-dtdxi*(f[i]-f[i-1]);
	}

	// apply boundary condition
	for (var i=0; i<margin; i++) {
	    y[i0-i-1]=y[i1-i];
	}
	for (var i=0; i<margin; i++) {
	    y[i1+i+1]=y[i0+i];
	}
    }

    return false;
}
