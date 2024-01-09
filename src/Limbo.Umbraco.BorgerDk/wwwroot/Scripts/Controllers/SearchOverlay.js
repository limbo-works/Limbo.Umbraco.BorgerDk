﻿angular.module("umbraco").controller("Limbo.BorgerDk.SearchOverlay.Controller", function ($scope, $element, $http, $timeout) {

    // Borger.dk doesn't appear to have made any changes to the amount of
    // endpoints or their domains in years, so for now they are hardcoded here
    $scope.endpoints = [
        {
            domain: "www.borger.dk",
            name: "Borger.dk"
        },
        {
            domain: "lifeindenmark.borger.dk",
            name: "Life in Denmark"
        }
    ];

    $scope.articles = [];

    $scope.loading = false;

    $scope.params = {
        text: ""
    };

    function search(text) {

        const params = {};

        if (text) params.text = text;

        $scope.loading = true;

        $http.get("/umbraco/backoffice/Limbo/BorgerDk/GetArticles", {params: params}).then(function (r) {
            $scope.articles = r.data;
            $scope.loading = false;
        });

    }

    search("");

    var wait = null;

    $scope.textChanged = function () {

        if (wait) $timeout.cancel(wait);

        // Add a small delay so we dont call the API on each keystroke
        wait = $timeout(function () {
            search($scope.params.text);
        }, 300);

    };

    $timeout(function() {
        const input = $element[0].querySelector("input.text");
        if (input) input.focus();
    }, 100);

});