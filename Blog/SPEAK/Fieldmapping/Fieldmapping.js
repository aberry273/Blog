define(["sitecore"], function (Sitecore) {
  var model = Sitecore.Definitions.Models.ControlModel.extend({
      initialize: function (options) {
          this._super();
          this.set("Fields", ""); 
          this.set("SitecoreFields", ["Loading Sitecore Fields"]);
          this.set("CRMFields", ["Loading CRM Fields"]); 
         
    },
        
    GetFieldMappingValues: function () {
        var self = this; 
        var guid = self.get("SourceID");
        if (guid == "" || guid == null)
            return;
        
        var fieldmapping = null; 
        $.get("/api/sitecore/FieldMapping/GetMappingFields",
        { "taskid": guid },
        function (data) {
            if (data != "") { 
                var json = JSON.parse(data); 
                self.set("Fields", json);
            }
        });
    },

    AddField: function () { 
        var fields = this.get("Fields");
        fields.push({ "SC": "", "CRM": "" });
        this.trigger('change:Fields', this.model, fields);
    },

 
    GetSitecoreFields: function (guid) { 
        var page = this; 
        this.set("SitecoreFields", ["Loading Sitecore Fields"]); 
        if (guid === "" || guid == null)
            return;
        $.get("/api/sitecore/FieldMapping/FetchSitecoreFields",
        { "GUID": guid },
        function (data) {
            if (data != "") {
                page.set("SitecoreFields", JSON.parse(data));
            }
        });
    },
 
    GetCRMFields: function () {  
        var page = this; 
        this.set("CRMFields", ["Loading CRM Fields"]);
        var entity = page.get("EntityType");
        if (entity === "" || entity == null)
            return;
        $.get("/api/sitecore/CRMTasks/FetchCRMFields", 
        { "EntityType": entity },
        function (data) {
            if (data != "") {
                page.set("SitecoreFields", JSON.parse(data));
            }
        });
    },
        
  });

  var view = Sitecore.Definitions.Views.ControlView.extend({
    initialize: function (options) {
        this._super();
       
    },

    DeleteField: function (index) {  
        var fields = this.model.get("Fields");   
        fields.splice((index), 1);  
        this.model.trigger('change:Fields', this.model, fields);
    },  

    SetSitecoreValue: function (element, data) {
        var selected = element.options[element.selectedIndex].value;
        $($(element).siblings()[0]).val(selected); 
        data.SC = selected;  
    },

    SetCRMValue: function (element, data) {
        var selected = element.options[element.selectedIndex].value;
        $($(element).siblings()[0]).val(selected); 
        data.CRM = selected; 
    },
   
  });

  Sitecore.Factories.createComponent("FieldMapping", model, view, ".sc-FieldMapping");
});
