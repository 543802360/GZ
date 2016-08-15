define(['leaflet',
        'fullScreen',
        'panControl',
        'mousePosition',
        'tdtWMTS',
        'baseMap',
        'leafletheat',
        'leafletArc',
        'leafletAweMarker',
        'leafletPhoto',
        'leafletMovingMarker',
        'leafletAnimatedMarker',
        'leafletCluster',
        'leafletTextPath',
        'pdfObj'],
    function(leaflet,
             fullScreen,
             panControl,
             mousePosition,
             tdtWMTS,
             baseMap,
             leafletheat,
             leafletArc,
             leafletAweMarker,
             leafletPhoto,
             leafletMovingMarker,
             leafletAnimatedMarker,
             leafletCluster,
             leafletTextPath,
             pdfObj){
        /**
         * 构造函数
         * @param container：地图容器
         * @param options：地图选项
         * @constructor
         */
        function Engine(container, options){
            //初始化地图
            var that = this;
            this._markerClickHandler = null;
            this._container = container;
            this._zoom = options.zoom;
            this._minZoom = options.minZoom;
            this._maxZoom = options.maxZoom;
            this._center = options.center;
            this._map = L.map(this._container, {
                center : this._center,
                zoom : this._zoom,
                maxZoom : this.maxZoom,
                minZoom : this.minZoom,
                zoomControl : false,
                attributionControl : false
            });
            //添加地图缩放控件与全屏控件
            L.control.zoom().addTo(this._map);
            L.control.fullscreen().addTo(this._map);
            L.control.mousePosition({
                separator : ',',
                emptystring : ""

            }).addTo(this._map);
            //添加底图与图层选择控件
            this._baseMap = baseMap;
            this._baseMap.TdtImg.addTo(this._map);
            var baseLayers = {
                '天地图影像' : this._baseMap.TdtImg,
                '天地图矢量' : this._baseMap.TdtNormal,
                '天地图地形' : this._baseMap.TdtTerrain

            };
            var overLayers = {};
            this._layerControl = L.control.layers(baseLayers, overLayers).addTo(this._map);

        }

        Engine.prototype.drawAnimatedMarker = function(latlngs, options){
            /* var marker = L.Marker.movingMarker(latlngs, [200], {loop : true});*/
            var marker = L.animatedMarker(latlngs, {
                interval : 200
            });
            return marker;
        };

        /**
         * 绘制圆弧
         * @param from
         * @param to
         * @param options
         * @returns {*}
         */
        Engine.prototype.drawArc = function(from, to, options){
            var line = L.Polyline.Arc(from, to, options);
            var animLine = L.polyline(line.getLatLngs(),
                {
                    className : options.className,
                    color : options.color
                });

            //循环
            /*animLine.addEventListener("snakeend", function(event){
             console.log(event);
             event.target.snakeIn();
             });*/
            return animLine;

        };

        /**
         * 缩放至初始化位置
         */
        Engine.prototype.viewHome = function(){
            this._map.setView([27, 117], 7);
        }

        /**
         * 绘制公司标记
         * @param array
         * @returns {*}
         */
        Engine.prototype.drawCompanyMarker = function(array){
            var markerArray = array.map(function(obj){
                var marker;
                if(obj.lat != "NULL"){
                    marker = L.marker([parseFloat(obj.lat), parseFloat(obj.lon)], {
                        icon : L.AwesomeMarkers.icon({
                            icon : 'star',
                            prefix : 'fa',
                            markerColor : 'orange'
                        })
                    }).bindPopup("公司名称：" + obj.name + "</br>" + "公司法人：" + obj.legal + "</br>"
                    + "主营行业：" + obj.industry + "</br>" + "公司资产：" + obj.assest + "万元" + "</br>" + "联系电话：" + obj.tel + "</br>" + "地址：" + obj.address + "</br>");
                    return marker;
                }
            });
            return markerArray;
        };

        Engine.prototype.drawEuropeCountyMarker = function(geojson){
            var layers = [];
            geojson.features.forEach(function(feature){
                var className = feature.properties.county;
                var marker = L.marker(L.GeoJSON.coordsToLatLng(feature.geometry.coordinates), {
                    icon : L.AwesomeMarkers.icon({
                        icon : 'bookmark',
                        prefix : 'fa',
                        markerColor : 'purple'
                    })
                }).bindPopup("<h4>" + feature.properties.county + "</h4>" + "<div id='pdfContainer'></div>");
                marker.on('click', function(e){
                    var popupContent = e.target.getPopup().getContent();
                    var index = popupContent.lastIndexOf('h4')
                    var country = popupContent.substring(4, index - 2);
                    /*var success = new PDFObject({url : "data/" + country + ".pdf"}).embed("pdfContainer");*/
                    /* PDFObject.embed("data/" + country + ".pdf", "#pdfContainer");*/
                    console.log(country);
                });
                layers.push(marker);
            });
            return L.layerGroup(layers);
        };
        /**
         * 绘制企业分布热力图
         * @param heatmapData:洪涝点位数组
         * @returns {*}
         */
        Engine.prototype.drawCompanyHeatLayer = function(heatmapData){
            return L.heatLayer(heatmapData, {
                minOpacity : 0.5,
                radius : 20
            });
        };

        /**
         * 定义Engine属性
         */
        Object.defineProperties(Engine.prototype, {
            map : {//map
                get : function(){
                    return this._map;
                }
            },
            container : {//地图DOM
                get : function(){
                    return this._container;
                }
            },
            center : {//地图中心
                get : function(){
                    return this._map.getCenter();
                }
            },
            currentZoom : {//当前缩放级别
                get : function(){
                    return this._map.getZoom();
                }
            },
            basemap : {//底图
                get : function(){
                    return this._baseMap;
                }
            },
            layerControl : {//图层管理控件
                get : function(){
                    return this._layerControl;
                }
            }
        });

        return {
            'create' : function(container, options){
                return new Engine(container, options);
            },
            'leaflet' : leaflet
        }
    })
;
