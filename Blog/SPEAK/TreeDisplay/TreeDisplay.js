define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
    initialize: function (options) {
        this._super();
        this.set("Nodes", null);  
    },
  
	/* This function is called from the SPEAK application PageCode in the Initialization() function */
    SetNodes: function(nodes)
    {  
        this.set("Nodes", nodes);
    },

  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
        this._super(); 
    },
	
	/* This function is bound to a <input> click event in the .cshtml */
    ToggleNode: function (element)
    {
        var val = $(element).val();
        $(element).val(val === "+" ? "-" : "+"); 
        this.ExpandParent(element); 
    },
	
    ExpandParent: function(element){
        $($(element).parent().siblings()[1]).toggle("fast");
    },
  });

  Sitecore.Factories.createComponent("NodeDisplay", model, view, ".sc-NodeDisplay");
});
