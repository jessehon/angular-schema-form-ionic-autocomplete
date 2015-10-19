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
