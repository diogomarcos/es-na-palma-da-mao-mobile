import template from './dashboard.html!text';

function dashBoardRoutes($stateProvider) {
    $stateProvider
        .state('app.dashboard', {
            url: 'dashboard',
            data:{title: "Dashboard"},
            views: {
                content: {
                    controller: 'DashBoardController as vm',
                    template: template
                }
            }
        });
}

export default [
    '$stateProvider',
    dashBoardRoutes
];