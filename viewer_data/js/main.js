var app = angular.module('EnotusViewer', []);

app.controller('MainController', function($scope) {
  $scope.notebooks = data.notebooks;
  $scope.entries = data.entries;
});

app.controller('SidebarController', function($scope) {
  var folderFilters = {
    inbox: { state: 'posted', notebook_id: null },
    all: { state: 'posted' },
    favorites: { state: 'posted', favorite: true },
    shared: { state: 'posted', shared_state: 'public' },
    trash: { state: 'deleted' }
  };

  $scope.showFolder = function (folder) {
    $scope.selectedNotebook = null;
    $scope.$parent.selectedEntry = null;
    $scope.selectedFolder = folder;
    $scope.$parent.filters = folderFilters[folder];
  };

  $scope.showNotebook = function (notebook) {
    $scope.selectedFolder = null;
    $scope.$parent.selectedEntry = null;
    $scope.selectedNotebook = notebook;
    $scope.$parent.filters = { state: 'posted', notebook_id: notebook.id };
  };

  $scope.showFolder('inbox');
});

app.controller('ListController', function($scope, $sce) {
  $scope.showEntry = function (entry) {
    $scope.$parent.selectedEntry = entry;
    $scope.$parent.selectedEntry.trustedBody = $sce.trustAsHtml(entry.body);
  };
});

app.filter('title', function() {
  return function(input) { return extractTitle(input) };
});

app.filter('description', function() {
  return function(input) { return stripTags(input).replace(extractTitle(input), '') };
});

function extractTitle(text) {
  var doc = document.implementation.createHTMLDocument('example');
  doc.documentElement.innerHTML = text;

  try {
    var title = stripTags(doc.body.firstChild.innerHTML || '')
  } catch (e) { var title = ''; };

  return title;
}

function stripTags(input) {
  return input.replace(/<(?:.|\n|\s+)*?>/gm, ' ');
}
