var Map = (function () {
    function Map() {
        this.map = null;
        this.elementCount = 0;
    }
    Map.prototype.hasKey = function (key) {
        //Hash the key so we get constant time lookups
        var index = this.hash(key) % this.map.length;
        //Index into the map
        var bucket = this.map[index];
        //Empty bucket ... we missed
        if (bucket == null || bucket.length == 0)
            return false;
        //Check the bucket for our key value
        for (var i = 0, len = bucket.length; i < len; i++) {
            if (key == bucket[i][0]) {
                return true;
            }
        }
        //Just a worthless collision
        return false;
    };
    Map.prototype.clear = function () {
        this.map = null;
        this.elementCount = 0;
    };
    Map.prototype.getValue = function (key) {
        //Hash the key so we get constant time lookups
        var index = Math.round((this.hash(key) % this.map.length + this.map.length - 1) / 2);
        //Index into the map
        var bucket = this.map[index];
        //Empty bucket ... we missed
        if (bucket == null || bucket.length == 0)
            return null;
        //Check the bucket for our key value
        for (var i = 0, len = bucket.length; i < len; i++) {
            if (key == bucket[i][0]) {
                return bucket[i][1];
            }
        }
        //Just a worthless collision
        return null;
    };
    Map.prototype.updateKeyValue = function (key, value) {
        //We don't deal with null key values
        if (key == null) {
            throw "We expect the key to not be null in the map.";
        }
        //Hash the key so we get constant time lookups
        var index = Math.round((this.hash(key) % this.map.length + this.map.length - 1) / 2);
        //Index into the map
        var bucket = this.map[index];
        //Empty bucket ... we missed
        if (bucket == null) {
            bucket = [[key, value]];
            return;
        }
        //Check the bucket for our key value
        for (var i = 0, len = bucket.length; i < len; i++) {
            if (key == bucket[i][0]) {
                bucket[i][1] = value;
            }
        }
        //We have a collision but a unique key, may need a resize
        this.addKeyValue(key, value);
    };
    Map.prototype.checkResize = function () {
        if (this.loadFactor() > 0.8) {
            if (this.map == null || this.map.length == 0) {
                this.map = Array.apply(null, new Array(113)).map(function () { return null; });
            }
            else {
                this.rehash(this.map.length * 2);
            }
        }
    };
    Map.prototype.addKeyValue = function (key, value) {
        if (key == null) {
            throw "We expect the key value to not be null.";
        }
        //resize the array if needed
        this.checkResize();
        //Hash the key so we get constant time lookups
        var index = Math.round((this.hash(key) % this.map.length + this.map.length - 1) / 2);
        //Index into the map
        var bucket = this.map[index];
        //Empty bucket, make new value
        if (bucket == null) {
            this.map[index] = [[key, value]];
            return;
        }
        //Check the bucket for our key value
        for (var i = 0, len = bucket.length; i < len; i++) {
            if (key == bucket[i][0]) {
                return; //This is an error for a normal hash map ... will work for our situation since we want unique url's
            }
        }
        //We have a collision but a unique key
        bucket.push([key, value]);
        //Increment the element count
        this.elementCount++;
    };
    Map.prototype.hash = function (value) {
        if (value == null) {
            throw "null value was submitted to hash function.";
        }
        var prime = 16777619;
        var hash = 2166136261;
        for (var i = 0, len = value.length; i < len; i++) {
            hash *= prime;
            hash ^= value.charCodeAt(i);
        }
        return hash;
    };
    Map.prototype.loadFactor = function () {
        return this.map == null ? 1.0 : this.elementCount / this.map.length;
    };
    Map.prototype.rehash = function (newSize) {
        var oldMap = this.map;
        this.map = Array.apply(null, new Array(newSize)).map(function () { return null; });
        for (var i = 0; i < oldMap.length; i++) {
            if (oldMap[i] != null) {
                for (var j = 0, len = oldMap[i].length; j < len; j++) {
                    this.addKeyValue(oldMap[i][j][0], oldMap[i][j][1]);
                }
            }
        }
    };
    return Map;
}());
//# sourceMappingURL=map.js.map