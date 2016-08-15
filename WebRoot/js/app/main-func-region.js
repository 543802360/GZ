//全局配置
require.config({
    waitSeconds : 0,
    paths : {
        //库文件
        leaflet : '../lib/leaflet/dist/leaflet-src',
        heatmap : '../lib/leaflet/plugins/heatmap/heatmap.min',
        leafletheat : '../lib/leaflet/plugins/heatmap/leaflet-heat',
        leafletArc : '../lib/leaflet/plugins/arc/Leaflet.Arc',
        leafletSnakeAnim : '../lib/leaflet/plugins/snakeAnim/L.Polyline.SnakeAnim',
        leafletAweMarker : '../lib/leaflet/plugins/awesome/leaflet.awesome-markers.min',
        leafletCurve : '../lib/leaflet/plugins/curve/leaflet.curve',
        leafletPhoto : '../lib/leaflet/plugins/photo/Leaflet.Photo',
        leafletAnimatedMarker : '../lib/leaflet/plugins/animatedMarker/AnimatedMarker',
        leafletMovingMarker : '../lib/leaflet/plugins/movingMarker/MovingMarker',
        leafletCluster : '../lib/leaflet/plugins/cluster/leaflet.markercluster-src',
        leafletTextPath : '../lib/leaflet/plugins/textPath/leaflet.textpath',
        jquery : '../lib/jquery/jquery.min',
        jqueryUI : '../lib/jquery/jquery-ui/js/jquery-ui-1.9.2.custom.min',
        jqueryTimeline : '../lib/jquery/jquery.timelinr-0.9.53',
        bootstrap : '../lib/bootstrap/js/bootstrap.min',
        fullScreen : '../lib/leaflet/plugins/fullscreen/Leaflet.fullscreen.min',
        mousePosition : '../lib/leaflet/plugins/mouseposition/L.Control.MousePosition',
        panControl : '../lib/leaflet/plugins/pancontrol/L.Control.Pan',
        tdtWMTS : '../lib/leaflet/plugins/TdtWMTS/leaflet.ChineseTmsProviders',//tdtWMTS
        dateTimePicker : '../lib/bootstrap/plugins/datetimepicker/js/bootstrap-datetimepicker.min',//时间选择js
        dateTimePickerLang : '../lib/bootstrap/plugins/datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN',
        bootstrapCombox : '../lib/bootstrap/plugins/combox/js/bootstrap-combobox',
        echarts : '../lib/echart/echarts',
        echartsDark : '../lib/echart/themes/dark',
        pdfObj : '../lib/pdfobject.min',

        //js文件
        cfasgis2d : 'CFASGIS2D',
        baseMap : 'baseMap',
        DomUtil : 'DomUtil',
        Panel : 'Panel',
        Chart : 'Chart',
        EuropeCountry : 'EuropeData'

    },
    shim : {
        'jquery' : {
            export : '$'
        },
        'jqueryTimeline' : {
            deps : ['jquery'],
            export : 'jqueryTimeline'
        },
        'jqueryUI' : {
            deps : ['jquery'],
            export : 'jqueryUI'
        },
        'bootstrap' : {
            deps : ['jquery'],
            exports : 'bootstrap'
        },
        'bootstrapCombox' : {
            deps : ['jquery'],
            exports : 'bootstrapCombox'
        },
        'dateTimePickerLang' : {
            deps : ['jquery'],
            exports : 'dateTimePickerLang'
        },
        'fullScreen' : {
            deps : ['leaflet'],
            exports : 'fullScreen'
        },
        'heatmap' : {
            exports : 'heatmap'
        },
        'leafletheat' : {
            deps : ['leaflet'],
            exports : 'leafletheat'
        },
        'leafletArc' : {
            deps : ['leaflet'],
            exports : 'leafletArc'
        },
        'leafletCurve' : {
            deps : ['leaflet'],
            exports : 'leafletCurve'
        },
        'leafletPhoto' : {
            deps : ['leaflet'],
            exports : 'leafletPhoto'
        },
        'leafletSnakeAnim' : {
            deps : ['leaflet'],
            exports : 'leafletSnakeAnim'
        },
        'leafletAnimatedMarker' : {
            deps : ['leaflet'],
            exports : 'leafletAnimatedMarker'
        },
        'leafletMovingMarker' : {
            deps : ['leaflet'],
            exports : 'leafletMovingMarker'
        },
        'leafletAweMarker' : {
            deps : ['leaflet'],
            exports : 'leafletAweMarker'
        },
        'leafletCluster' : {
            deps : ['leaflet'],
            exports : 'leafletCluster'
        },
        'leafletTextPath' : {
            deps : ['leaflet'],
            exports : 'leafletTextPath'
        },
        'mousePosition' : {
            deps : ['leaflet'],
            exports : 'mousePosition'
        },
        'EuropeCountry' : {
            exports : 'EuropeCountry'
        },
        'panControl' : {
            deps : ['leaflet'],
            exports : 'panControl'
        },
        'tdtWMTS' : {
            deps : ['leaflet'],
            exports : 'tdtWMTS'
        },
        'pdfObj' : {
            exports : 'pdfObj'
        }
    }
});
var webroot = 'http://127.0.0.1:8080/GZ/',//web地址
    companyHeatLayer,//洪涝热力图
    companyMarkerLayer;//洪涝标记图层
/*初始化地图*/
require(['jquery',
        'jqueryTimeline',
        'jqueryUI',
        'bootstrap',
        'bootstrapCombox',
        'cfasgis2d',
        'DomUtil',
        'Panel',
        'Chart',
        'EuropeCountry',
        'leafletCluster',
        'leafletTextPath',
        'pdfObj'],
    function($,
             jqueryTimeline,
             jqueryUI,
             bootstrap,
             bootstrapCombox,
             cfasgis2d,
             DomUtil,
             Panel,
             Chart,
             EuropeData,
             leafletCluster,
             leafletTextPath,
             pdfObj){
        //初始化地图
        var container = document.getElementById('map');
        var engine = cfasgis2d.create(container, {
            center : [30, 108],
            zoom : 4,
            minZoom : 2,
            maxZoom : 18
        });
        var infoPanel = function(){
            var panel = Panel.create("info-panel");
            panel.title = "专题信息";
            panel.enableCloseButton = false;
            return panel;
        }();
        //添加全国酒店专题地图
        (function(){
            $.get('data/hotel_china.json', function(data){
                chinaHotel = L.geoJson(data, {
                    style : style,
                    onEachFeature : onEachFeature
                }).addTo(engine.map);
                engine.layerControl.addOverlay(chinaHotel, '中国酒店专题图');
            });
            function getColor(d){
                return d > 6000 ? '#800026' :
                    d > 5000 ? '#BD0026' :
                        d > 4000 ? '#E31A1C' :
                            d > 3000 ? '#FC4E2A' :
                                d > 2000 ? '#FD8D3C' :
                                    d > 1000 ? '#FEB24C' :
                                        '#FFEDA0';
            }

            function style(feature){
                return {
                    fillColor : getColor(feature.properties.hotel),
                    weight : 2,
                    opacity : 1,
                    color : 'white',
                    dashArray : '3',
                    fillOpacity : 0.7
                };
            }

            //mouseOver事件
            function highlightFeature(e){
                var layer = e.target;
                layer.setStyle({
                    weight : 3,
                    color : '#666',
                    dashArray : '',
                    fillOpacity : 0.7
                });
                if(!L.Browser.ie && !L.Browser.opera){
                    layer.bringToFront();
                }
                infoPanel.contentContainer.innerHTML = '行政区划：' + layer.feature.properties.NAME + "<br>" + "酒店数量：" + layer.feature.properties.hotel;
                var top = e.containerPoint.y,
                    left = e.containerPoint.x;
                infoPanel.setPosition(top + "px", left + "px");
                infoPanel.show();
                /* info.update(layer.feature.properties);*/
            }

            //mouseOut事件
            function resetHighlight(e){
                chinaHotel.resetStyle(e.target);
                infoPanel.close();
            }

            //click事件
            function zoomToFeature(e){
                engine.map.fitBounds(e.target.getBounds());
                if(e.target.feature.properties.NAME == "贵州省"){
                    //移除全国酒店图层
                    engine.map.removeLayer(chinaHotel);
                    engine.layerControl.removeLayer(chinaHotel);
                    //添加贵州酒店图层
                    engine.map.addLayer(gzHotel);
                    engine.layerControl.addOverlay(gzHotel, "贵州省酒店统计专题图");
                    infoPanel.close();
                }

            }

            function onEachFeature(feature, layer){
                layer.on({
                    mouseover : highlightFeature,
                    mouseout : resetHighlight,
                    click : zoomToFeature
                });
            }

            var legend = L.control({position : 'bottomright'});

            legend.onAdd = function(map){
                var div = L.DomUtil.create('div', 'info legend'),
                    grades = [0, 1000, 2000, 3000, 4000, 5000, 6000],
                    labels = [];
                div.innerHTML = "图例" + "<br>";
                for(var i = 0; i < grades.length; i++){
                    div.innerHTML +=
                        '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
                        grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
                }

                return div;
            };
            legend.addTo(engine.map);
        })();

        //加载贵州酒店专题地图
        (function(){
            $.get('data/hotel_gz.json', function(data){
                gzHotel = L.geoJson(data, {
                    style : style,
                    onEachFeature : onEachFeature
                });
                return gzHotel;
            });
            function getColor(d){
                return d > 600 ? '#BD0026' :
                    d > 500 ? '#E31A1C' :
                        d > 400 ? '#FC4E2A' :
                            d > 300 ? '#FD8D3C' :
                                d > 200 ? '#FEB24C' :
                                    '#FFEDA0';
            }

            function style(feature){
                return {
                    fillColor : getColor(feature.properties.hotel),
                    weight : 2,
                    opacity : 1,
                    color : 'white',
                    dashArray : '3',
                    fillOpacity : 0.7
                };
            }

            //mouseOver事件
            function highlightFeature(e){
                var layer = e.target;
                layer.setStyle({
                    weight : 3,
                    color : '#666',
                    dashArray : '',
                    fillOpacity : 0.7
                });
                /*if(!L.Browser.ie && !L.Browser.opera){
                 layer.bringToFront();
                 }*/
                infoPanel.contentContainer.innerHTML = '行政区划：' + layer.feature.properties.NAME + "<br>" + "酒店数量：" + layer.feature.properties.hotel;
                var top = e.containerPoint.y,
                    left = e.containerPoint.x;
                infoPanel.setPosition(top + "px", left + "px");
                infoPanel.show();
                /* info.update(layer.feature.properties);*/
            }

            //mouseOut事件
            function resetHighlight(e){
                gzHotel.resetStyle(e.target);
                infoPanel.close();
            }

            //click事件
            function zoomToFeature(e){
                engine.map.fitBounds(chinaHotel.getBounds());
                engine.map.removeLayer(gzHotel);
                engine.layerControl.removeLayer(gzHotel);
                engine.map.addLayer(chinaHotel);
                engine.layerControl.addOverlay(chinaHotel, "中国酒店统计专题图");
                infoPanel.close();
            }

            function onEachFeature(feature, layer){
                layer.on({
                    mouseover : highlightFeature,
                    mouseout : resetHighlight,
                    click : zoomToFeature
                });
            }

            /*var legend = L.control({position : 'bottomright'});

             legend.onAdd = function(map){
             var div = L.DomUtil.create('div', 'info legend'),
             grades = [0, 1000, 2000, 3000, 4000, 5000, 6000],
             labels = [];
             div.innerHTML = "图例" + "<br>";
             for(var i = 0; i < grades.length; i++){
             div.innerHTML +=
             '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
             grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
             }

             return div;
             };
             legend.addTo(engine.map);*/


        })();

    });
