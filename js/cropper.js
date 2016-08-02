var cropper = {
  $el: undefined,
  $croppedContainer: undefined,
  $map: undefined,
  startX: undefined,
  startY: undefined,
  appendMap: function () {
    var $map = $('<div class="map"></div>'),
    		mapStyles = {
    			position: 'absolute',
          cursor: 'move',
          background: 'rgba(255, 255, 255, 0.35)',
          'z-index': 1000
    		};
    $map.css(mapStyles);
  	this.$el.append($map);
    this.$map = $map;
  },
  setCroppedImageSize: function () {
  	var width = this.mapSize;
      	height = 'auto'
          
  	this.$croppedImage.css({
    	width: width,
      height: height
    });
  },
  handleMapSize: function () {
  	this.$el.on('mousemove', (function (e) {
    	e.preventDefault();
      
      var width = e.pageX - this.startX,
      		height = e.pageY - this.startY,
          size = (width > height) ? width : height;
      
      this.$map.css({
      	width: size,
        height: size
      });
      
      this.caculateTimesMapBiggerThanCroppedArea();
      this.handleCroppedImageOffsets(this.divider);
      this.setCroppedImageWidth(this.divider);
    }).bind(this)); 
  },
  caculateTimesMapBiggerThanCroppedArea: function () {
  	var mapSize = this.$map.width(),
    		croppedAreaSize = this.$croppedContainer.width();
        
  	this.divider = mapSize / croppedAreaSize;
  },
  handleMapPosition: function (e) {
    this.startX = e.pageX - this.$el.offset().left,
    this.startY = e.pageY - this.$el.offset().top;

    this.$map.css({
      width: 0,
      height: 0,
      left: this.startX,
      top: this.startY
    });
  },
  killEventListenersOnMouseup: function () {
  	this.$el.on('mouseup', (function () {
    	this.$el.off('mousemove');
      this.$el.off('mouseup');
    }).bind(this));
    this.$map.on('mouseup', (function () {
    	this.$map.off('mousemove');
    }).bind(this));
  },
  handleCroppedImageOffsets: function (divider) {
  	this.$croppedImage.css({
      'margin-left': -this.startX / divider,
    	'margin-top': -this.startY / divider
    });
  },
  handleMapMove: function () {
  	this.$map.on('mousemove', (function (e) {
    	var left = e.pageX - this.$map.width() / 2,
      		top = e.pageY - this.$map.height() / 2;
          
      this.startX = left;
      this.startY = top;
          
    	this.$map.css({
      	left: left,
        top: top
      });
      
      this.handleCroppedImageOffsets(this.divider);
    }).bind(this));
  },
  registerMapEvents: function () {
  	this.$map.on('mousedown', (function (e) {
    	e.stopPropagation();
      this.handleMapMove();
    }).bind(this));
  },
  registerEvents: function () {
  	this.$el.on('mousedown', (function (e) {
    	if (!this.$map) {
      	this.appendMap();
        this.registerMapEvents();
      }
      
      this.handleMapPosition(e);
      this.handleMapSize();
      this.handleCroppedImageOffsets();
      this.killEventListenersOnMouseup();
    }).bind(this));
  },
  setCroppedImageWidth: function (divider) {
  	if (!this.$originalImage || !this.$croppedImage) {
    	this.$originalImage = this.$el.find('img');
    	this.$croppedImage = this.$croppedContainer.find('img');
    }
    
  	this.$croppedImage.css({
    	width: this.$originalImage.width() / divider,
      height: this.$originalImage.height() / divider
    });
  },
	init: function (selector, croppedSelector) {
  	this.$el = $(selector);
    this.$croppedContainer = $(croppedSelector);
    this.registerEvents();
    this.setCroppedImageWidth(1);
  }
};