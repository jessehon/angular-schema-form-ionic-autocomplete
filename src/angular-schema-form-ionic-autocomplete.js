angular.module('angularSchemaFormIonicAutocomplete', [
  'schemaForm',
  'templates',
  'ionic',
  'ion-autocomplete'
])
.config(function(schemaFormDecoratorsProvider, sfBuilderProvider) {
  var sfField            = sfBuilderProvider.builders.sfField;
  var ngModel            = sfBuilderProvider.builders.ngModel;
  var ngModelOptions     = sfBuilderProvider.builders.ngModelOptions;
  var condition          = sfBuilderProvider.builders.condition;
  var sfMessages = function(args) {
    var messagesDiv = args.fieldFrag.querySelector('[sf-messages]');
    if (messagesDiv) {
      messagesDiv.setAttribute('ng-messages', 'ngModel.$error');
      var child = document.createElement('div');
      child.setAttribute('sf-message', '');
      child.setAttribute('ng-message', '');
      messagesDiv.appendChild(child);
    }
  };

  schemaFormDecoratorsProvider.defineAddOn(
    'ionicDecorator',           // Name of the decorator you want to add to.
    'autocomplete',                      // Form type that should render this add-on
    'src/templates/angular-schema-form-ionic-autocomplete.html',  // Template name in $templateCache
    [ sfField, ngModel, ngModelOptions, sfMessages, condition ]   // List of builder functions to apply.
  );

})
.directive('asfIonicAutocomplete', function() {
  return {
    link: function(scope, element, attrs) {

      // For getting a standardised titleMap since the property can be passed in multiple formats
      scope.getTitleMapAsArray = function() {
        if (_.isArray(scope.form.titleMap)) {
          return scope.form.titleMap;
        }

        if (_.isPlainObject(scope.form.titleMap)) {
          return _.map(scope.form.titleMap, function(value, name) {
            return {
              value: value,
              name: name
            };
          })

        }

        if (_.isUndefined(scope.form.titleMap)) {
          var values = scope.schema.enum || scope.schema.items.enum;
          return _.map(values, function(value) {
            return {
              value: value,
              name: name
            };
          });
        }

        throw new Error("Unexpected format for titleMap");
      }

      // Helper to merge propertmaps
      scope.mergePropertiesMaps = function(propertiesMap1, propertiesMap2) {
        var propertiesMap1ByValue = _.keyBy(propertiesMap1, 'value');
        var propertiesMap2ByValue = _.keyBy(propertiesMap2, 'value');
        var mergedPropertiesMap = _.merge({}, propertiesMap1ByValue, propertiesMap2ByValue);

        // Convert object back into array
        return _.values(mergedPropertiesMap);
      }

      scope.getItems = function(query) {
        // Search each word of the query independently
        var queryTerms = _.split(_.lowerCase(query), " ");

        // Get titleMap and index by value to
        var titlePropertiesMap = scope.getTitleMapAsArray();
        var filterPropertiesMap = scope.form.filterPropertiesMap;
        var fields = scope.mergePropertiesMaps(filterPropertiesMap, titlePropertiesMap);

        // Return fields that contain any of the query terms
        var matchingFields = _.filter(fields, function(field) {

          // Return true every query term matches a property of this field
          var fieldPropertyValues = _.map(_.values(field), _.lowerCase);
          return _.every(queryTerms, function(queryTerm) {
            var hasMatchingProperty = !!_.find(fieldPropertyValues, function(fieldPropertyValue) {
              return _.includes(fieldPropertyValue, queryTerm);
            })

            return hasMatchingProperty;
          });

        });

        return matchingFields;
      };
    }
  };
});
