// This worker will actually draw(/paint) the heatmap onto
// an image.

var distanceBetween = function(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(Math.abs(x2 - x1), 2) + Math.pow(Math.abs(y2 - y1), 2))
}

var scaleFactor = function(distance, radius) {
    if (distance < radius) {
        return Math.E - Math.exp(distance / radius)
    }
}

var intensities = function(locations, width, height, radius) {
    var intensities = new Array(width);
    for (var i = 0; i < width; i++) {
        intensities[i] = new Array(height);
    }

    for (var i = 0; i < locations.length; i++) {
        var x = Math.floor(locations[i][0].x),
            y = Math.floor(locations[i][0].y);
        for (var j = x - radius; j <= x + radius && j < width; j++) {
            for (var k = y - radius; k <= y + radius && k < height; k++) {
                var coeff = scaleFactor(distanceBetween(x, y, j, k), radius);
                if (coeff) {
                    var intensityDelta = coeff * locations[i][1];
                    if (intensities[j][k]) {
                        var newIntensity = intensities[j][k] + intensityDelta;
                        newIntensity = newIntensity > 1 ? 1.0 : newIntensity;
                        intensities[j][k] = newIntensity;
                    } else {
                        intensities[j][k] = intensityDelta;
                    }
                }
            }
        }
    }
    return intensities;
}

self.addEventListener('message', function(e) {
    // Quick sleep to not interfere with continued interactions
    setTimeout(function() {}, 100);
    self.postMessage(intensities(
        e.data['locations'],
        e.data['width'],
        e.data['height'],
        e.data['radius']));
}, false);
