import 'angular-ui-router';
import './detail.css!css';
import angular from 'angular';
import DetailController from './detail.controller.js';
import detailRoutes from './detail.routes.js';
import newsApiService from '../news-api.service.js';

const dependencies = [
    'ui.router'
];

export default angular.module( 'state-news-detail', dependencies )
                      .controller( 'detailController', DetailController )
                      .service( 'newsApiService', newsApiService )
                      .config( detailRoutes );