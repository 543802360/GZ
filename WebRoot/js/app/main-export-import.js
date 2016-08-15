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
        //贵州:26.64991,106.6333;欧洲：51.61802,11.95313；非洲：6.14055,23.02734；
        //南美洲：-14.77488，-57.12891；北美洲：47.98992，-96.15234；大洋洲：-24.68695,136.8457
        //亚洲：0.26367,117.77344
        var AddOutPutLayer = function(){
            //欧洲
            var Europe = engine.drawArc([26.64991, 106.6333], [51.61802, 11.95313], {
                color : "red",
                vertices : 200,
                className : 'europe'
            });
            //非洲
            var Africa = engine.drawArc([26.64991, 106.6333], [6.14055, 23.02734], {
                color : "blue",
                vertices : 100,
                className : 'africa'
            });
            //南美洲
            var SouthAme = engine.drawArc([26.64991, 106.6333], [-14.77488, -57.12891], {
                color : "green",
                vertices : 100,
                className : 'southAmerica'
            });
            //北美洲
            var NorthAme = engine.drawArc([26.64991, 106.6333], [47.98992, -96.15234], {
                color : "yellow",
                vertices : 60,
                className : 'northAmerica'

            });
            //大洋洲
            var Austrilia = engine.drawArc([26.64991, 106.6333], [-24.68695, 136.8457], {
                color : "purple",
                vertices : 200,
                className : 'australia'

            });
            //亚洲
            var Asia = engine.drawArc([26.64991, 106.6333], [0.26367, 117.77344], {
                color : "orange",
                vertices : 100,
                className : 'asia'
            });
            var infoPopup = L.popup();
            var outputLayer = L.layerGroup([Europe, Africa, SouthAme, NorthAme, Austrilia, Asia]).addTo(engine.map);
            outputLayer.eachLayer(function(layer){
                //为每条进出口线添加点击事件
                layer.on('click', function(event){
                    var continent = event.target.options.className,
                        targetLatlng = event.latlng,
                    /*    currentYear = $("#dates").find('a.selected').html();*/
                        currentYear = 2000;
                    $.ajax({
                        url : webroot + "servlet/getExportImportInfo",
                        data : {
                            year : currentYear,
                            continent : continent
                        },
                        type : 'get',
                        dataType : 'json',
                        success : function(data){
                            var _continentName = data[0].continent,
                                _import = data[0].import,
                                _export = data[0].export,
                                _importRate = data[0].import_rate,
                                _exportRate = data[0].export_rate,
                                _year = data[0].year;
                            infoPopup.setContent("<h4>" + "贵州&#8596" + _continentName + "(" + currentYear + "年)" + "</h4></br>" + "出口总额：" + _export + "</br>" + "进口总额：" + _import
                            + "</br>" + "出口比重：" + _exportRate + "</br>" + "进口比重：" + _importRate).setLatLng(targetLatlng).openOn(engine.map);
                        },
                        failure : function(error){
                            window.alert(error);
                        }
                    });
                });
                //添加动态图标
                /*var path = layer.getLatLngs().map(function(obj){
                 return [obj.lat, obj.lng];
                 });
                 var animateMarker = engine.drawAnimatedMarker(path).addTo(engine.map);
                 animateMarker.start();*/
                /*
                 layer.snakeIn();
                 */
                /*layer.setText('\u2708', {
                 repeat : false,
                 center : true,
                 offset : 8,
                 attributes : {
                 'font-weight' : 'bold',
                 'font-size' : '28',
                 'fill' : 'red',
                 'stroke' : 'yellow'
                 }
                 });*/
            });
            engine.layerControl.addOverlay(outputLayer, "贵州进出口示意图");

            /*//添加进口
             var inputLayer = L.layerGroup();
             outputLayer.eachLayer(function(layer){
             var line = L.polyline(layer.getLatLngs().reverse(), {color : 'red'});
             inputLayer.addLayer(line);
             });
             inputLayer.addTo(engine.map);
             engine.layerControl.addOverlay(inputLayer, "贵州进口");*/

        }();


        //进出口总体一览面板
        var outInOverAllPanel = function(){
            var panel = Panel.create("outputin-overall-panel"),
                content = document.getElementById("m_output_in_overall_panel");
            panel.contentContainer.appendChild(content);
            panel.title = "贵州进出口总体趋势分析";
            return panel;
        }();
        var drawOverallChart = function(){
            var lineChartOption = {
                title : {
                    text : '贵州2000-2014年进出口统计'
                },
                tooltip : {
                    trigger : 'axis'
                },
                legend : {
                    x : 'center',
                    y : 'top',
                    data : ['进口', '出口']
                },
                grid : {
                    left : '3%',
                    right : '4%',
                    bottom : '3%',
                    containLabel : true
                },
                toolbox : {
                    feature : {
                        magicType : {
                            type : ['line', 'bar']
                        },
                        restore : {},
                        saveAsImage : {}
                    }
                },
                xAxis : {
                    type : 'category',
                    boundaryGap : false,
                    data : ['2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014']
                },
                yAxis : {
                    type : 'value',
                    name : '单位(万美元)'
                },
                series : [

                    {
                        name : '进口',
                        type : 'line',
                        smooth : true,
                        data : [23942, 22808, 24960, 39643, 64734, 54500, 57871, 80772, 146953, 94876, 122662, 190249, 167933, 140411, 137407]
                    }, {
                        name : '出口',
                        type : 'line',
                        smooth : true,
                        data : [42060, 42170, 44181, 58834, 86709, 85925, 103874, 146513, 190084, 135856, 192018, 298509, 495223, 688598, 939726]
                    }
                ]
            };
            var outInOverAllChart = Chart.create(document.getElementById("m_overall_chart")).chart;
            outInOverAllChart.setOption(lineChartOption);
        };
        drawOverallChart();
        //出口组成（分大洲）
        //点击事件
        $(document).ready(function(){

            //进出口总体分析
            $('#m_overall_outputInput').click(function(){
                outInOverAllPanel.show();
            });

        });

        //产业指南
        var europeGuide = engine.drawEuropeCountyMarker(EuropeCountry).addTo(engine.map);
        engine.layerControl.addOverlay(europeGuide, "欧洲产业指南");
        var infoPanel = function(){
            var panel = Panel.create("info-panel");
            panel.title = "专题信息";
            panel.enableCloseButton = false;
            return panel;
        }();
    });
