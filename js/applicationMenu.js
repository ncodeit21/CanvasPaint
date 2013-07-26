//Application menu object
//Implements the singleton pattern
var ApplicationMenu = (function(){
    //private ApplicationMenu instance
    //backstore variable
    var instance;
    //singleton instance creator, aka the private constructor
    function createInstance(){
        return new function(){
            var self = this,
                behaviours = {};
            self.initializeMenu = function(){
                //attach submenu activation handler to declared
                //submenu activators
                $(".submenu-activator").click(function(){
                    //get the submenu to be activated and call
                    //the activation function
                    var submenuID = $(this).attr("submenu-id");
                    self.showSubmenu(this,submenuID);
                });
            };
            self.showSubmenu = function(activator, submenuID){
                $(activator).addClass("active");
                var submenu  = $("#" + submenuID);
                var submenuBehaviour = getSubmenuBehaviour(submenu);
                if(existsBehaviour(submenuBehaviour))
                    applyBehaviour(submenuBehaviour,activator,submenu);
                else{
                    //TODO : Handle non existent behaviours
                }
                self.toggleSubmenu(activator,submenu);
            };
            self.toggleSubmenu = function(activator, submenu){
                //the submenu is absolute positioned,
                //get the top left corner from the
                //activator page offset
                var submenuX = $(activator).parent("li").offset().left,
                submenuY = $(activator).parent("li").offset().top,
                submenuW = $(activator).parent("li").width();
                var hidden = $(submenu).hasClass("submenu-hidden"),
                    closing = !hidden;
                //submenu toggle
                $(submenu)
                    .css("left",submenuX + submenuW)
                    .css("top",(submenuY-1))
                    .removeClass(((hidden)?"submenu-hidden":"submenu-visible"))
                    .addClass((hidden)?"submenu-visible":"submenu-hidden");
                //if the submenu is in closing, detach all handlers
                if(closing){
                    $(submenu).children("li").unbind("click");
                    $(activator).removeClass("active");
                }
            };
            self.registerBehaviour = function(behaviour,handler){
                behaviours[behaviour] = handler;
            };
            self.unregisterBehaviour = function(behaviour){
                delete behaviours[behaviour];
            };
            function existsBehaviour(behaviour){
                return behaviours.hasOwnProperty(behaviour);
            };
            function getSubmenuBehaviour(submenu){
                var behaviourID = $(submenu).attr("submenu-behaviour");
                return (behaviourID === undefined ||
                        behaviourID === '' ||
                        behaviourID === 'defaultBehaviour')?
                        'defaultBehaviour': behaviourID;
            }
            function applyBehaviour(behaviour,activator,submenu){
                return behaviours[behaviour](self,activator,submenu);
            };
        };
    };
    //give back an object with the instance
    //retrieval function
    return{
        getInstance : function(){
            if(!instance)
                instance = createInstance();
            return instance;
        }
    };
//this function builds the object by
//self-invoking
})();
//register menu behaviours
//default menu behaviour
ApplicationMenu.getInstance().registerBehaviour("defaultBehaviour",function(appMenuObj,activator,submenu){
    $(submenu).children("li").click(function(){
        appMenuObj.toggleSubmenu(activator,submenu);
    });
});
//color menu behaviour
//ApplicationMenu.getInstance().registerBehaviour("colorSubmenuBehaviour",function(appMenuObj,activator,submenu){
    ////save current color, for possible restore
    //var currentColor = $(submenu).find("#color").val();
    //var updateActivatorIconColor = function(){
        //var color = $.farbtastic("#colorpicker").color;
        //$(activator).children("i").css("color", color);
    //};
    //$(submenu).find("button[type='confirmColor']").off("click").on("click",function(){
        //var self = this;
        //if($(self).hasClass("action-discard"))
            //$.farbtastic("#colorpicker").setColor(currentColor);
        //appMenuObj.toggleSubmenu(activator,submenu);
        //updateActivatorIconColor();
        //$(self).unbind("click");
    //});
//});