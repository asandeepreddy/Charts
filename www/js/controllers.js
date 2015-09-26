angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $ionicPopover, $http) {
    // var config = {};
    // config.bindto = '#chart';
    // config.data = {};
    // config.data.json = {};
    // config.data.json.data1 = $scope.config.data1.split(",");
    // config.data.json.data2 = $scope.config.data2.split(",");
    // config.data.json.data3 = $scope.config.data3.split(",");
    // console.log(config.data.json)
    // config.axis = {
    //   "x":{"label":{"text":"Age","position":"outer-middle"}},
    //   "y":{"label":{"text":"No of claims","position":"outer-middle"}}};
    // config.data.types={"data1":$scope.config.type1,"data2":$scope.config.type2, "data3":$scope.config.type3};
  var template = '<ion-popover-view style="height: 140px;"><ion-content> <button class="button button-block  button-clear button-positive" ng-click="reportType()">Report Type</button><button class="button button-block  button-clear button-positive" ng-click="selection()">Selection</button></ion-content></ion-popover-view>';
  $scope.reportType = function(){
    alert("show ");
  };
  $scope.selection = function(){
    alert("select");
  };
  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });

  // .fromTemplateUrl() method
  // $ionicPopover.fromTemplateUrl('my-popover.html', {
  //   scope: $scope
  // }).then(function(popover) {
  //   $scope.popover = popover;
  // });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };

  $scope.closePopover = function() {
    $scope.popover.hide();
  };

  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });

  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  $http.get("http://m.fhpl.net/Providerservice/ProviderServices.svc/getAgeingData")
  .then(
    function(data){
      // alert("getting");
      //console.log(data);
    },
    function(err){
      // console.log(err);
      //alert("getting error");
    }
    );


    $scope.chart = c3.generate({
    data: {
        x: 'x',
        columns: [
            ['x', '0-18', '19-25', '26-35', '36-45', '46-55'],
            ['No Of Claims Recd', 39, 200, 400, 250, 100],
            ['No. of Settled', 35, 150, 300, 200, 20],
            ['% of Settled Claims', 90, 80, 75, 78, 35]
        ],
        colors: {
            'No Of Claims Recd': '#17B6A4',//'#3989E0',//'#5D78E4',
            'No. of Settled': '#2184DA',//'#0C75AE',//'#BDB6B6',//'#504E4A',
            '% of Settled Claims': 'red'
        },
        types : {'No Of Claims Recd' : 'bar', "No. of Settled":'bar', '% of Settled Claims': "line"  }
    },
    axis : {
        x : {
            type : 'category',
            tick: {
                multiline: false,
                //format: "%e %b %y"
            }
        }
    }
});//c3.generate(config); 
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
