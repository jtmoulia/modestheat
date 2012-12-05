// namespacing
if (!com) {
    var com = {}
}
if (!com.modestmaps) {
    com.modestmaps = {}
}

(function(MM) {
    MM.HeatLayer = function(parent, locations, radius) {
        this.parent = parent || document.createElement('canvas');
        this.radius = radius || 50;
        this._context = this.parent.getContext("2d");
        this._context.canvas.width = window.innerWidth;
        this._context.canvas.height = window.innerHeight;
        this.locations = locations || [];
    };

    MM.HeatLayer.prototype = {
        locations: null,
        _painter: null,
        _lastCoord: null,

        draw: function() {
            //var next = this.map.pointCoordinate({x: 0, y: 0})
            //if (this._lastCoord) {
                //if (this._lastCoord.zoom == next.zoom) {
                    //var p1 = this.map.coordinatePoint(this._lastCoord),
                        //p2 = this.map.coordinatePoint(next);
                    //this._context.translate(p1.x - p2.x,
                                            //p1.y - p2.y);
                    //this._clearCanvas();
                    //this._drawIntensities(this.intensities);
                //}
            //}
            //this._lastCoord = next;
            if (this._painter) {
                this._painter.terminate();
            }
            this._painter = new Worker('/src/heatpainter.js');
            var that = this;
            this._painter.addEventListener('message', function(e) {
                that._context.canvas.width = window.innerWidth;
                that._context.canvas.height = window.innerHeight;
                that._clearCanvas();
                //that.intensities = e.data;
                that._drawIntensities(e.data);
            }, false);

            this._painter.postMessage({
                'locations': this.locations.map(function(location) {
                    return [this.map.locationPoint(location[0]), location[1]];
                }),
                'width': this._context.canvas.width,
                'height': this._context.canvas.height,
                'radius': this.radius});

        },

        _hsvToRgb: function(h, s, v) {
            s = s || 1;
            v = v || 1;
            var r, g, b;

            var i = Math.floor(h * 6);
            var f = h * 6 - i;
            var p = v * (1 - s);
            var q = v * (1 - f * s);
            var t = v * (1 - (1 - f) * s);

            switch(i % 6){
                case 0: r = v, g = t, b = p; break;
                case 1: r = q, g = v, b = p; break;
                case 2: r = p, g = v, b = t; break;
                case 3: r = p, g = q, b = v; break;
                case 4: r = t, g = p, b = v; break;
                case 5: r = v, g = p, b = q; break;
            }

            return [Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255)];
        },


        _drawIntensities: function(intensities, a) {
            var a = a || 0.5;
            for (var i = 0; i < intensities.length; i++) {
                for (var j = 0; j < intensities[j].length; j++) {
                    if (intensities[i][j]) {
                        this._drawPoint(i, j,
                                        240 - Math.floor(intensities[i][j] * 280),
                                        '100%', '50%', intensities[i][j]);
                    }
                }
            }
        },

        _drawPoint: function(x, y, h, s, l, a) {
            this._context.fillStyle = "hsla(" + [h, s, l, a].join(', ') + ")";
            this._context.fillRect(x, y, 1, 1);
        },

        _clearCanvas: function() {
            this._context.clearRect(0, 0, document.width, document.height);
        }

    };

})(com.modestmaps);
