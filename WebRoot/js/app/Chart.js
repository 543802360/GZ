define(['jquery', 'echarts', 'echartsDark'], function($, echarts, dark){

    /**
     * 图标操作封装类
     * @constructor
     */
    function Charts(container){
        var that = this;
        if(container){
            this._container = container;
            this._chart = echarts.init(container, 'dark');
        }
    }

    /**
     * 图标配置项
     * @param option
     */
    Charts.prototype.setOptions = function(option){
        this._chart.setOption(option);
    };
    /**
     * 定义Charts的属性
     */
    Object.defineProperties(Charts.prototype, {
        container : {
            get : function(){
                return this._container;
            }
        },
        chart : {
            get : function(){
                return this._chart;
            }
        }
    })
    return {
        'create' : function(container){
            return new Charts(container);
        }
    }
});
