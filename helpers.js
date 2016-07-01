(function(window) {
    "use strict";
    
    function Helpers() {}
    
    Helpers.prototype.object = {
        isObject: function(object) {
            return (typeof object == 'object');
        },
        
        isEmpty: function(object) {
            if(!this.isObject(object)) {
                return console.log("Not an object: " + typeof object);
            }
            
            return Object.keys(object).length;
        }  
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
        
        // tag -> string
        // properties -> array
        getDirective: function(tag, properties) {

            try {
                    
                var elements = [];
                var htmlElements = document.getElementsByTagName(tag);
                
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
        
        // element -> string
        // by -> string
        getElements: function(element, by) {
            
            if(this.isElement(element, by)) {
                switch (by) {
                    case 'byTag':
                        return document.getElementsByTagName(element);
                }
            }
            
        },
        
        // element -> array
        // replaceElement -> string
        // attributes -> object
        replaceElement: function(element, replaceElement, attributes) {
            
            try {
            
                var elements = this.getElements(element, 'byTag');
                var repalce = document.createElement(replaceElement);
                
                for(var i = 0; i < elements.length; i++) {
                    
                    for(var key in attributes) {
                        repalce.setAttribute(key, attributes[key]);
                    }
                    
                    elements[i].parentNode.replaceChild(repalce, elements[i]);
                }
                
            } catch(error) {
                console.warn(error);
            }
        }
            
    };
    
    window.Helpers = new Helpers;
    
})(window);