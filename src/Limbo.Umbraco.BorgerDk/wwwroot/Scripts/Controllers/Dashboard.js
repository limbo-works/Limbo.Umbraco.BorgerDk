﻿angular.module("umbraco").controller("Limbo.BorgerDk.Dashboard.Controller", function ($http) {

    const vm = this;

    vm.loading = false;

    vm.import = function () {

        vm.result = null;

        vm.buttonState = "busy";

        $http.get("/umbraco/backoffice/Limbo/BorgerDk/Import").then(function (res) {

            vm.result = res.data;
            vm.buttonState = "success";

        }, function(res) {

            // oh noes

        });

    }

});