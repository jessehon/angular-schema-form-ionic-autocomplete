angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("src/templates/angular-schema-form-search.html","<div class=\"form-group {{form.htmlClass}} schema-form-select\"\n     ng-class=\"{\'has-error\': hasError(), \'has-success\': hasSuccess(), \'has-feedback\': form.feedback !== false}\">\n  <asf-search>\n    <asf-search-input>\n      <md-autocomplete\n        ng-disabled=\"form.readonly\"\n        ng-model=\"$$value$$\"\n        sf-autocomplete\n        sf-field-model=\"replaceAll\"\n        schema-validate=\"form\"\n        md-selected-item=\"$$value$$\"\n        md-search-text=\"searchText\"\n        md-search-text-change=\"closeFilter()\"\n        md-selected-item-change=\"\'todo\';\"\n        md-items=\"item in evalExpr(\'this[\\\'\'+form.optionFilter+\'\\\'](\\\'\'+searchText+\'\\\')\')\"\n        md-item-text=\"item.name\"\n        placeholder=\"{{form.title || form.key.slice(-1)[0]}}\"\n        md-menu-class=\"autocomplete-custom-template\">\n        <md-item-template>\n          <span md-highlight-text=\"searchText\">{{item.title}}</span>\n        </md-item-template>\n        <md-not-found>\n          No matches found\n        </md-not-found>\n      </md-autocomplete>\n      <md-button type=\"button\" id=\"more\" class=\"md-icon-button\" aria-label=\"More\" ng-click=\"toggleFilterOpen()\">\n        <md-icon md-svg-icon=\"ic_arrow_drop_down_black_48px.svg\" aria-hidden=\"true\"></md-icon>\n      </md-button>\n    </asf-search-input>\n    <md-button class=\"asf-search-button md-raised md-primary\">\n      <md-icon md-svg-icon=\"ic_search_white_48px.svg\" aria-hidden=\"true\"></md-icon>\n    </md-button>\n    <md-item-template>\n      <span md-highlight-text=\"searchText\">{{item.title}}</span>\n    </md-item-template>\n    <asf-search-filter ng-show=\"filterOpen\">\n      <md-whiteframe\n          md-auto-shrink md-auto-shrink-min=\"1\"\n          class=\"md-autocomplete-suggestions-container md-whiteframe-z1 md-orient-vertical\"\n          aria-hidden=\"false\"\n          layout-gt-lg=\"column\">\n      </md-whiteframe>\n    </asf-search-filter>\n  </asf-search>\n  <div ng-messages=\"ngModel.$error\">\n    <!--\n       This is a bit of a hack. sf-message does the work, but ng-messages and ng-message\n       is needed for the styling\n    -->\n    <div sf-message ng-message></div>\n  </div>\n</div>\n");}]);
angular.module('angularSchemaFormSearch', [
  'schemaForm',
  'templates'
]).config(function(schemaFormDecoratorsProvider, sfBuilderProvider) {
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
  var sfAutocomplete = function(args) {
    var mdAutocomplete = args.fieldFrag.querySelector('[sf-autocomplete]');
    if (mdAutocomplete) {
      if (args.form.onChange) {
        mdAutocomplete.setAttribute('md-selected-item-change', 'args.form.onChange(searchText)');
      };
      if (args.form.onChange) {
        mdAutocomplete.setAttribute('md-search-text-change', 'args.form.onChange(searchText)');
      };
      // mdAutocomplete.setAttribute('md-items', 'item in $filter(''autocomplete'')(searchText);');
      var minLength = args.form.minLength || 1;
      var maxLength = args.form.maxLength || false;
      mdAutocomplete.setAttribute('md-min-length', minLength);
      if (maxLength) {
        mdAutocomplete.setAttribute('md-max-length', maxLength);
      };
    }
    var mdSearch = args.fieldFrag.querySelector('md-whiteframe');
    if (mdSearch && args.form.items) {
      var mdContent = document.createElement('md-content');
      var childFrag = args.build(args.form.items, args.path, args.state);
      var searchButton = document.createElement('md-button');
      searchButton.setAttribute('class', 'asf-search-button md-raised md-primary');
      var searchIcon = document.createElement('md-icon');
      searchIcon.setAttribute('md-svg-icon', 'ic_search_white_48px.svg');
      searchIcon.setAttribute('aria-hidden', 'true');
      searchButton.appendChild(searchIcon);
      mdContent.appendChild(childFrag);
      mdContent.appendChild(searchButton);
      mdSearch.appendChild(mdContent);
    };
  };

  schemaFormDecoratorsProvider.defineAddOn(
    'materialDecorator',           // Name of the decorator you want to add to.
    'search',                      // Form type that should render this add-on
    'src/templates/angular-schema-form-search.html',  // Template name in $templateCache
    [ sfField, ngModel, ngModelOptions, sfMessages, condition, sfAutocomplete ]   // List of builder functions to apply.
  );

})
.directive('asfSearch', [ 'sfSelect', function(sfSelect) {
  return {
    link: function(scope, element, attrs) {
      scope.filterOpen = false;
      scope.toggleFilterOpen = function() {
        scope.filterOpen = scope.filterOpen === false ? true : false;
      };
      scope.closeFilter = function() {
        scope.filterOpen = false;
      };
    }
  };
}]);
