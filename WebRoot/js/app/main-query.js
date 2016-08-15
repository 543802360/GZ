//全局配置
require.config({
    waitSeconds : 0,
    paths : {
        //库文件
        leaflet : '../lib/leaflet/dist/leaflet-src-0-7',
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
        echarts_2 : '../lib/leaflet/plugins/leaflet-echart/echarts-all',
        leafletEchart : '../lib/leaflet/plugins/leaflet-echart/leaflet-echarts',
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
        'leafletEchart' : {
            deps : ['echarts_2'],
            exports : 'leafletEchart'
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
        'leafletEchart',
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
             leafletEchart,
             pdfObj){
        //初始化地图
        var container = document.getElementById('map');
        var engine = cfasgis2d.create(container, {
            center : [30, 108],
            zoom : 4,
            minZoom : 2,
            maxZoom : 18
        });

        //普通查询面板
        var ocQueryPanel = function(){
            var panel = Panel.create("ordinary-company-query-panel"),
                content = document.getElementById("m_ordinary_company_query_panel");
            panel.contentContainer.appendChild(content);
            panel.title = "一般企业查询";
            return panel;
        }();
        //高级查询面板
        var kcQueryPanel = function(){
            var panel = Panel.create("key-company-query-panel"),
                content = document.getElementById("m_key_company_query_panel");
            panel.contentContainer.appendChild(content);
            panel.title = "重点企业查询";
            return panel;
        }();
        //点击事件
        $(document).ready(function(){
            //初始化时间轴
            $().timelinr({
                /*containerDiv : '#timeline',
                 datesDiv : '#date',
                 issuesDiv : '#issues',*/
                issuesTransparency : 0,
                autoPlay : 'false',
                startAt : 1
            });
            //进出口逐年分析
            $('#m_year_outin').click(function(){
                /*timelinePanel.show();*/
            });
            //自动补全查询企业名称
            $("#ordinary-company-name").autocomplete({
                source : webroot + "servlet/getCompanyNames"
            });
            $("#m_OCQuery").click(function(){
                ocQueryPanel.show();
            });
            $("#m_KCQuery").click(function(){
                kcQueryPanel.show();
            });
            $('#m_company-relation').click(function(){
                addRelation();
            });
            //根据名称查询公司
            $('#btn-query-company-by-name').click(function(){
                var name = $('#ordinary-company-name').val();
                $.ajax({
                    url : webroot + "servlet/getCompanyByName",
                    data : {
                        companyName : name
                    },
                    type : 'get',
                    dataType : 'json',
                    success : function(data){
                        console.log(data);
                        if(data.length != 0){
                            //添加公司标记
                            if(companyMarkerLayer){
                                companyMarkerLayer.clearLayers();
                                engine.drawCompanyMarker(data).forEach(function(layer){
                                    if(typeof layer != "undefined"){
                                        companyMarkerLayer.addLayer(layer);
                                    }
                                });
                            } else {
                                companyMarkerLayer = L.markerClusterGroup();
                                engine.drawCompanyMarker(data).forEach(function(layer){
                                    if(typeof layer != "undefined"){
                                        companyMarkerLayer.addLayer(layer);
                                        layer.addEventListener('click', function(event){
                                            /* window.alert("你点击了我！");*/
                                            layer.openPopup();
                                        });
                                    }
                                });
                                engine.map.addLayer(companyMarkerLayer);
                                engine.layerControl.addOverlay(companyMarkerLayer, '企业查询结果点位');
                            }
                            //添加热力图
                            var heatmapArray = data.map(function(obj){
                                if(obj.lat != "NULL"){
                                    return [parseFloat(obj.lat), parseFloat(obj.lon)];
                                }
                            });
                            if(companyHeatLayer){
                                companyHeatLayer.setLatLngs(heatmapArray);
                            } else {
                                companyHeatLayer = engine.drawCompanyHeatLayer(heatmapArray).addTo(engine.map);
                                engine.layerControl.addOverlay(companyHeatLayer, '企业热力图');
                            }

                        } else {
                            alert("没有找到此信息!");
                        }
                    },
                    failure : function(){

                    }
                })
            });
        });
        var geoq = L.tileLayer('http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}');
        engine.layerControl.addBaseLayer(geoq, "高德灰色地图");
        //贵州产品出口伪迁徙图
        (function(){
            var overlay = new L.echartsLayer(engine.map, echarts);
            engine.map.addLayer(overlay);
            chartsContainer = overlay.getEchartsContainer();
            engine.layerControl.addOverlay(overlay, '贵州产品走向');
            myChart = overlay.initECharts(chartsContainer);
            window.onresize = myChart.onresize;
            option = {
                color : ['gold', 'aqua', 'lime'],
                title : {
                    text : '贵州产品走向示意图',
                    x : 'center',
                    textStyle : {
                        color : 'yellow',
                        fontSize : 26,
                        fontWeight : 'bolder'
                    }
                },
                tooltip : {
                    trigger : 'item',
                    formatter : '{b}'
                },
                toolbox : {
                    show : true,
                    orient : 'vertical',
                    x : 'right',
                    y : 'center',
                    feature : {
                        restore : {show : true},
                        saveAsImage : {show : true}
                    }
                },
                dataRange : {
                    min : 0,
                    max : 100,
                    show : false,
                    x : 'right',
                    y : '200px',
                    calculable : true,
                    color : ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                    textStyle : {
                        color : '#fff'
                    }
                },
                series : [
                    {
                        name : '全国',
                        type : 'map',
                        roam : true,
                        hoverable : false,
                        mapType : 'none',
                        itemStyle : {
                            normal : {
                                borderColor : 'rgba(100,149,237,1)',
                                borderWidth : 0.5,
                                areaStyle : {
                                    color : '#1b1b1b'
                                }
                            }
                        },
                        data : [],
                        geoCoord : {
                            '上海' : [121.4648, 31.2891],
                            '东莞' : [113.8953, 22.901],
                            '东营' : [118.7073, 37.5513],
                            '中山' : [113.4229, 22.478],
                            '临汾' : [111.4783, 36.1615],
                            '临沂' : [118.3118, 35.2936],
                            '丹东' : [124.541, 40.4242],
                            '丽水' : [119.5642, 28.1854],
                            '乌鲁木齐' : [87.9236, 43.5883],
                            '佛山' : [112.8955, 23.1097],
                            '保定' : [115.0488, 39.0948],
                            '兰州' : [103.5901, 36.3043],
                            '包头' : [110.3467, 41.4899],
                            '北京' : [116.4551, 40.2539],
                            '北海' : [109.314, 21.6211],
                            '南京' : [118.8062, 31.9208],
                            '南宁' : [108.479, 23.1152],
                            '南昌' : [116.0046, 28.6633],
                            '南通' : [121.1023, 32.1625],
                            '厦门' : [118.1689, 24.6478],
                            '台州' : [121.1353, 28.6688],
                            '合肥' : [117.29, 32.0581],
                            '呼和浩特' : [111.4124, 40.4901],
                            '咸阳' : [108.4131, 34.8706],
                            '哈尔滨' : [127.9688, 45.368],
                            '唐山' : [118.4766, 39.6826],
                            '嘉兴' : [120.9155, 30.6354],
                            '大同' : [113.7854, 39.8035],
                            '大连' : [122.2229, 39.4409],
                            '天津' : [117.4219, 39.4189],
                            '太原' : [112.3352, 37.9413],
                            '威海' : [121.9482, 37.1393],
                            '宁波' : [121.5967, 29.6466],
                            '宝鸡' : [107.1826, 34.3433],
                            '宿迁' : [118.5535, 33.7775],
                            '常州' : [119.4543, 31.5582],
                            '广州' : [113.5107, 23.2196],
                            '廊坊' : [116.521, 39.0509],
                            '延安' : [109.1052, 36.4252],
                            '张家口' : [115.1477, 40.8527],
                            '徐州' : [117.5208, 34.3268],
                            '德州' : [116.6858, 37.2107],
                            '惠州' : [114.6204, 23.1647],
                            '成都' : [103.9526, 30.7617],
                            '扬州' : [119.4653, 32.8162],
                            '承德' : [117.5757, 41.4075],
                            '拉萨' : [91.1865, 30.1465],
                            '无锡' : [120.3442, 31.5527],
                            '日照' : [119.2786, 35.5023],
                            '昆明' : [102.9199, 25.4663],
                            '杭州' : [119.5313, 29.8773],
                            '枣庄' : [117.323, 34.8926],
                            '柳州' : [109.3799, 24.9774],
                            '株洲' : [113.5327, 27.0319],
                            '武汉' : [114.3896, 30.6628],
                            '汕头' : [117.1692, 23.3405],
                            '江门' : [112.6318, 22.1484],
                            '沈阳' : [123.1238, 42.1216],
                            '沧州' : [116.8286, 38.2104],
                            '河源' : [114.917, 23.9722],
                            '泉州' : [118.3228, 25.1147],
                            '泰安' : [117.0264, 36.0516],
                            '泰州' : [120.0586, 32.5525],
                            '济南' : [117.1582, 36.8701],
                            '济宁' : [116.8286, 35.3375],
                            '海口' : [110.3893, 19.8516],
                            '淄博' : [118.0371, 36.6064],
                            '淮安' : [118.927, 33.4039],
                            '深圳' : [114.5435, 22.5439],
                            '清远' : [112.9175, 24.3292],
                            '温州' : [120.498, 27.8119],
                            '渭南' : [109.7864, 35.0299],
                            '湖州' : [119.8608, 30.7782],
                            '湘潭' : [112.5439, 27.7075],
                            '滨州' : [117.8174, 37.4963],
                            '潍坊' : [119.0918, 36.524],
                            '烟台' : [120.7397, 37.5128],
                            '玉溪' : [101.9312, 23.8898],
                            '珠海' : [113.7305, 22.1155],
                            '盐城' : [120.2234, 33.5577],
                            '盘锦' : [121.9482, 41.0449],
                            '石家庄' : [114.4995, 38.1006],
                            '福州' : [119.4543, 25.9222],
                            '秦皇岛' : [119.2126, 40.0232],
                            '绍兴' : [120.564, 29.7565],
                            '聊城' : [115.9167, 36.4032],
                            '肇庆' : [112.1265, 23.5822],
                            '舟山' : [122.2559, 30.2234],
                            '苏州' : [120.6519, 31.3989],
                            '莱芜' : [117.6526, 36.2714],
                            '菏泽' : [115.6201, 35.2057],
                            '营口' : [122.4316, 40.4297],
                            '葫芦岛' : [120.1575, 40.578],
                            '衡水' : [115.8838, 37.7161],
                            '衢州' : [118.6853, 28.8666],
                            '西宁' : [101.4038, 36.8207],
                            '西安' : [109.1162, 34.2004],
                            '贵阳' : [106.6992, 26.7682],
                            '连云港' : [119.1248, 34.552],
                            '邢台' : [114.8071, 37.2821],
                            '邯郸' : [114.4775, 36.535],
                            '郑州' : [113.4668, 34.6234],
                            '鄂尔多斯' : [108.9734, 39.2487],
                            '重庆' : [107.7539, 30.1904],
                            '金华' : [120.0037, 29.1028],
                            '铜川' : [109.0393, 35.1947],
                            '银川' : [106.3586, 38.1775],
                            '镇江' : [119.4763, 31.9702],
                            '长春' : [125.8154, 44.2584],
                            '长沙' : [113.0823, 28.2568],
                            '长治' : [112.8625, 36.4746],
                            '阳泉' : [113.4778, 38.0951],
                            '青岛' : [120.4651, 36.3373],
                            '韶关' : [113.7964, 24.7028]
                        }
                    },
                    {
                        name : '贵阳',
                        type : 'map',
                        mapType : 'none',
                        data : [],
                        markLine : {
                            smooth : true,
                            effect : {
                                show : true,
                                scaleSize : 1,
                                period : 30,
                                color : '#fff',
                                shadowBlur : 10
                            },
                            itemStyle : {
                                normal : {
                                    borderWidth : 1,
                                    lineStyle : {
                                        type : 'solid',
                                        shadowBlur : 10
                                    }
                                }
                            },
                            data : [
                                [{name : '贵阳'}, {name : '上海', value : 95}],
                                [{name : '贵阳'}, {name : '广州', value : 90}],
                                [{name : '贵阳'}, {name : '大连', value : 80}],
                                [{name : '贵阳'}, {name : '南宁', value : 70}],
                                [{name : '贵阳'}, {name : '南昌', value : 60}],
                                [{name : '贵阳'}, {name : '拉萨', value : 50}],
                                [{name : '贵阳'}, {name : '长春', value : 40}],
                                [{name : '贵阳'}, {name : '包头', value : 30}],
                                [{name : '贵阳'}, {name : '重庆', value : 20}],
                                [{name : '贵阳'}, {name : '常州', value : 10}]
                            ]
                        },
                        markPoint : {
                            symbol : 'emptyCircle',
                            symbolSize : function(v){
                                return 10 + v / 10
                            },
                            effect : {
                                show : true,
                                shadowBlur : 0
                            },
                            itemStyle : {
                                normal : {
                                    label : {show : false}
                                },
                                emphasis : {
                                    label : {position : 'top'}
                                }
                            },
                            data : [
                                {name : '上海', value : 95},
                                {name : '广州', value : 90},
                                {name : '大连', value : 80},
                                {name : '南宁', value : 70},
                                {name : '南昌', value : 60},
                                {name : '拉萨', value : 50},
                                {name : '长春', value : 40},
                                {name : '包头', value : 30},
                                {name : '重庆', value : 20},
                                {name : '常州', value : 10}
                            ]
                        }
                    }
                ]
            };
            overlay.setOption(option);
        })();
        //贵州客户群
        var addRelation = function(){
            var overlay = new L.echartsLayer(engine.map, echarts);
            engine.map.addLayer(overlay);
            chartsContainer = overlay.getEchartsContainer();
            engine.layerControl.addOverlay(overlay, '贵州贵航汽车零部件股份有限公司客户群');
            myChart = overlay.initECharts(chartsContainer);
            window.onresize = myChart.onresize;
            option = {
                color : ['gold', 'aqua', 'lime'],
                title : {
                    text : '贵州贵航汽车零部件股份有限公司客户群',
                    x : 'center',
                    textStyle : {
                        color : 'yellow',
                        fontSize : 26,
                        fontWeight : 'bolder'
                    }
                },
                tooltip : {
                    trigger : 'item',
                    formatter : '{b}'
                },
                toolbox : {
                    show : true,
                    orient : 'vertical',
                    x : 'right',
                    y : 'center',
                    feature : {
                        restore : {show : true},
                        saveAsImage : {show : true}
                    }
                },
                dataRange : {
                    min : 0,
                    max : 100,
                    show : false,
                    x : 'right',
                    y : '200px',
                    calculable : true,
                    color : ['#ff3333', 'orange', 'yellow', 'lime', 'aqua'],
                    textStyle : {
                        color : '#fff'
                    }
                },
                series : [
                    {
                        name : '全国',
                        type : 'map',
                        roam : true,
                        hoverable : false,
                        mapType : 'none',
                        itemStyle : {
                            normal : {
                                borderColor : 'rgba(100,149,237,1)',
                                borderWidth : 0.5,
                                areaStyle : {
                                    color : '#1b1b1b'
                                }
                            }
                        },
                        data : [],
                        geoCoord : {
                            '遵义顺风汽车零部件制造有限公司' : [107.13188934, 27.915210724],
                            '毕节市川滇汽车修理厂' : [105.25600433, 27.28235817],
                            '六盘水天利进口汽车修理有限公司' : [104.85684204, 26.584989548],
                            '贵州贵航汽车零部件股份有限公司 ' : [106.69561005, 26.511791229]
                        }
                    },
                    {
                        name : '贵州贵航汽车零部件股份有限公司 ',
                        type : 'map',
                        mapType : 'none',
                        data : [],
                        markLine : {
                            smooth : true,
                            effect : {
                                show : true,
                                scaleSize : 1,
                                period : 30,
                                color : '#fff',
                                shadowBlur : 10
                            },
                            itemStyle : {
                                normal : {
                                    borderWidth : 1,
                                    lineStyle : {
                                        type : 'solid',
                                        shadowBlur : 10
                                    }
                                }
                            },
                            data : [
                                [{name : '贵州贵航汽车零部件股份有限公司 '}, {name : '六盘水天利进口汽车修理有限公司', value : 10}],
                                [{name : '贵州贵航汽车零部件股份有限公司 '}, {name : '毕节市川滇汽车修理厂', value : 50}],
                                [{name : '贵州贵航汽车零部件股份有限公司 '}, {name : '遵义顺风汽车零部件制造有限公司', value : 90}]
                            ]
                        },
                        markPoint : {
                            symbol : 'emptyCircle',
                            symbolSize : function(v){
                                return 10 + v / 10
                            },
                            effect : {
                                show : true,
                                shadowBlur : 0
                            },
                            itemStyle : {
                                normal : {
                                    label : {show : false}
                                },
                                emphasis : {
                                    label : {position : 'top'}
                                }
                            },
                            data : [
                                {name : '遵义顺风汽车零部件制造有限公司', value : 90},
                                {name : '毕节市川滇汽车修理厂', value : 50},
                                {name : '六盘水天利进口汽车修理有限公司', value : 10}

                            ]
                        }
                    }
                ]
            };
            overlay.setOption(option);
        };
    });
