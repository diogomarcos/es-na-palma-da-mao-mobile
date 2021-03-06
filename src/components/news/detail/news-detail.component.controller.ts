import { IScope } from 'angular';
import { SocialSharing } from 'ionic-native';
import { NewsDetail, NewsApiService } from '../shared/index';

export class NewsDetailController {

    public static $inject: string[] = [ '$scope', 'newsApiService', '$stateParams' ];

    public news: NewsDetail;

    /**
     * Creates an instance of NewsDetailController.
     * 
     * @param {IScope} $scope
     * @param {NewsApiService} newsApiService
     * @param {angular.ui.IStateParamsService} $stateParams
     */
    constructor( private $scope: IScope,
        private newsApiService: NewsApiService,
        private $stateParams: angular.ui.IStateParamsService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }


    /**
     * Ativa o controller
     *
     * @returns {void}
     */
    public activate(): void {
        angular.element( document.querySelectorAll( 'ion-header-bar' ) ).removeClass( 'espm-header-tabs' );
        this.getNewsById( this.$stateParams[ 'id' ] );
    }

    /**
     * 
     * 
     * @param {string} link
     * 
     * @memberOf NewsDetailController
     */
    public share( news: NewsDetail ): void {
        let shareOptions = {
            message: news.title,
            subject: news.title,
            // files: [ news.image ],
            url: news.url
        };

        // shareOptions.files = shareOptions.files.map(( value ) => value.indexOf( '?' ) >= 0 ? value.substr( 0, news.image.indexOf( '?' ) ) : value );
        // shareOptions.files = shareOptions.files.map(( value ) => value.replace( 'https', 'http' ) );

        SocialSharing.shareWithOptions( shareOptions );
    }

    /**
     * Carrega um notícia
     * 
     * @param {string} id
     */
    public getNewsById( id: string ): void {
        this.newsApiService.getNewsById( id )
            .then( news => this.news = news );
    }
}
