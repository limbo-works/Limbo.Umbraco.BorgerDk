﻿angular.module("umbraco").controller("Limbo.BorgerDk.Municipality.Controller", function ($scope, borgerDkService) {

    $scope.municipalities = borgerDkService.getMunicipalities();

    $scope.municipality = $scope.municipalities[0];

    $scope.municipalities.forEach(function(m) {
        if (m.id === $scope.model.value) {
            $scope.municipality = m;
        }
    });

    $scope.valueChanged = function() {
        $scope.model.value = $scope.municipality.id;
    };

});