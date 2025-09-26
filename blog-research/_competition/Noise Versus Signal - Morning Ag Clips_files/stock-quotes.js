/*

Plugin Name: Google Stock Quote Stream
Author: Kenny Ma
Last Update: June 24, 2012

*/

(function($){

$.fn.extend({
    googleStockQuote : function(userOptions){

        var self = {};
        var _symbolsList = {};
        var _symbolArray = [];
        var _titleArray = [];
        var _queryURL;
        var _divID;      

        var options = {
            stocks : {'MUTF_CA:TDB900' : 'TD Canadian Index - e',},
            showName: true,
            showSymbol : true,
            showlastTradeTime : true,
            showPrice : true,
            showChange : true,
            showChangePercentage : true,
        };

        options = $.extend(options, userOptions);    

        self.init = function(symbolsList, divID){
            //alert("hello");
            _symbolsList = symbolsList;

            populateSymbolTitleArrays(); //populate _symbolArray and _symbolArray
            _queryURL = 'https://finance.google.com/finance/info?client=ig&q=' 
                        + encodeURIComponent(_symbolArray.join(','));

            self.getQuote(divID);
        };

        var populateSymbolTitleArrays = function(){
            $.each(_symbolsList, function(key, value){
                _symbolArray.push(key);
                _titleArray.push(value);
            });
        };

        self.getQuote = function(divID){
            $.ajax({
                url: _queryURL, 
                success: function(data){
                    renderQuotes(eval(data), divID);
                },
                error: function(){ alert('error'); },
                dataType: 'jsonp'
            });
        };

        var renderQuotes = function(data, _divID){
            var $quotesDIV = $(_divID);

            for(var i=0; i<data.length; i++){
                var symbol = data[i].t;
                var lastTradeTime = data[i].ltt;
                var change = data[i].c;
                var changePercentage = data[i].cp;
                var l_cur = data[i].l_cur;
                var $quote = $("<div class='quote_item columns large-12 medium-6 quote-" +i+ " "+ symbol +"'></div>");

                if(options.showName)
                    $quote.append("<div class='columns large-4 stock_name'>"+ _titleArray[i] +"</div>");
                if(options.showSymbol)
                    $quote.append("<div class='columns large-2 stock_symbol'>"+ symbol +"</div>");
                if(options.showPrice)
                    $quote.append("<div class='columns large-1 stock_price'>"+ l_cur +"</div>");
                if(options.showChange)
                    $quote.append("<div class='columns large-1 stock_change'>"+ change +"</div>");
                if(options.showChangePercentage)
                    $quote.append("<div class='columns large-2 stock_changePercentage'><span>"+ changePercentage +"%</span></div>");
                if(options.showlastTradeTime)
                    $quote.append("<div class='columns large-2 stock_lastTradeTime'>"+ lastTradeTime +"</div>");

                if(parseFloat(changePercentage) > 0)
                    $quote.addClass("up");
                else if (parseFloat(changePercentage) < 0)
                    $quote.addClass("down");
                    

                $quotesDIV.append($quote);
               
            }
        };

        return this.each(function(){
            self.init(options.stocks, $(this)); 
        });
    } // end of googleStockQuote function

}); // $.fn.extend

})(jQuery);
