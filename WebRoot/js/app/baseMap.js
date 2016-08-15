/**
 * 底图类
 */
define(['leaflet', 'tdtWMTS'], function(leaflet, tdtWMTS){

    function BaseMap(){

    }

    /**
     * 天地图影像
     */
    BaseMap.prototype.TdtImg = (function(){
        var imgMap = L.tileLayer.chinaProvider('TianDiTu.Satellite.Map', {maxZoom : 18, minZoom : 2});
        var imgAnno = L.tileLayer.chinaProvider('TianDiTu.Satellite.Annotion', {maxZoom : 18, minZoom : 2});
        return L.layerGroup([imgMap, imgAnno]);
    })();

    /**
     * 天地图矢量
     */
    BaseMap.prototype.TdtNormal = (function(){
        var vecMap = L.tileLayer.chinaProvider('TianDiTu.Normal.Map', {maxZoom : 18, minZoom : 2});
        var vecAnno = L.tileLayer.chinaProvider('TianDiTu.Normal.Annotion', {maxZoom : 18, minZoom : 2});
        return L.layerGroup([vecMap, vecAnno]);
    })();

    /**
     * 天地图地形
     */
    BaseMap.prototype.TdtTerrain = (function(){
        var terrainMap = L.tileLayer.chinaProvider('TianDiTu.Terrain.Map', {maxZoom : 18, minZoom : 2});
        var terrainAnno = L.tileLayer.chinaProvider('TianDiTu.Terrain.Annotion', {maxZoom : 18, minZoom : 2});
        return L.layerGroup([terrainMap, terrainAnno]);
    })();

    return new BaseMap();
})