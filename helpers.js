(function(window) {
    "use strict";
    
    function Helpers() {}
    
    Helpers.prototype.object = {
        isObject: function(object) {
            return (typeof object == 'object');
        },
        
        isEmpty: function(object) {
            if(!this.isObject(object)) {
                return console.warn("Not an object: " + typeof object);
            }
            
            return Object.keys(object).length;
        }  
    };
    
    Helpers.prototype.generateId = function(prefix, length) {
        var text = "";
        
        if(length == undefined) {
            length = 5;
        }
        
        if(prefix != undefined) {
            text += prefix;
        }
        
        var possible = "abcdefghijklmnopqrstuvwxyz0123456789";
    
        for(var i = 0; i < length; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
    
        return text;
    };
    
    Helpers.prototype.dom = {
        
        // element -> string
        // type -> string
        isElement: function(element, by) {
            switch (by) {
                case 'byTag':
                    return document.getElementsByTagName(element).length;
            }
        },
        
        // element -> string
        // by -> string
        getElements: function(element, by) {
            if(this.isElement(element, by)) {
                switch (by) {
                    case 'byTag':
                        return document.getElementsByTagName(element);
                }
            }
            
            return [];
        },
        
        // element -> string
        // by -> string
        getElement: function(element, by) {
            var element = this.getElements(element, by)
            if(element.length) {
                return element[0];   
            }
        },
        
        // tag -> string
        // properties -> array
        getDirective: function(tag, properties) {

            try {
                    
                var elements = [];
                var htmlElements = this.getElements(tag, 'byTag');
                
                for(var i = 0; i < htmlElements.length; i++) {
                    var obj = {};
                    
                    for(var j = 0; j < properties.length; j++) {
                        if(htmlElements[i].hasAttribute(properties[j])) {
                            obj[properties[j]] = htmlElements[i].getAttribute(properties[j]);
                        }
                    }
                    
                    elements.push(obj);
                }
                
                if(!elements.length) {
                    console.warn('No elements fund!');
                }
                
                return elements;
                
            } catch(error) {
                console.warn(error);
            }
            
        },
        
        // element -> array
        // replaceElement -> string
        // id -> string
        // attributes -> object
        replaceElement: function(element, replaceElement, attributes) {
            
            try {
                
                var element = this.getElement(element, 'byTag');
                var replace = document.createElement(replaceElement);
                
                for(var key in attributes) {
                    replace.setAttribute(key, attributes[key]);
                }
                
                element.parentNode.replaceChild(replace, element);
                
            } catch(error) {
                console.warn(error);
            }
        }
            
    };
    
    window.Helpers = new Helpers;
    
})(window);
