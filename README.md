# Angular Ionic Decorator - Autocomplete

Simple autocomplete component for the angular schema form 1 ionic decorator. It uses the https://github.com/guylabs/ion-autocomplete directive for the autocomplete behavior.

## Installation

1. Install via bower

    ```
    bower install angular-schema-form-ionic-autocomplete
    ```

2. Include the library scripts after the ionic decorator

    ```html
    <script src="bower_components/ion-google-autocomplete/dist/ion-autocomplete.js"></script>
    <script src="bower_components/angular-schema-form-ionic-autocomplete/dist/angular-schema-form-ionic-autocomplete.js"></script>
    ```

3. Include the ion-autocomplete styles

    ```html
    <link href="bower_components/ion-autocomplete/dist/ion-autocomplete.css" rel="stylesheet">
    ```

4. Inject into your app

    ```js
    angular.module('myApp', [..., 'angularSchemaFormIonicAutocomplete']);
    ```

## Usage

See demo [test/index.html](test/index.html) for example

## Contributing

We will be much grateful if you help us making this project to grow up. Feel free to contribute by forking, opening issues, pull requests etc.
