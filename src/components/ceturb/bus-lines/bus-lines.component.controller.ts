import { IScope, IPromise } from 'angular';

import { BusLine, CeturbApiService } from '../shared/index';

export class BusLinesController {

    public static $inject: string[] = [
        '$scope',
        '$state',
        '$ionicLoading',
        'ceturbApiService'
    ];

    private defaultPageSize = 50;
    private filter: string;
    private lastFilter: string;
    private filteredLines: BusLine[];
    private cachedLines: BusLine[];
    private lines: BusLine[];
    private populated: boolean;
    private lineCount: number;

    /**
     * Creates an instance of SepConsultaController.
     * @constructor
     * @param {IScope} $scope
     * @param {SepApiService} sepApiService
     */
    constructor( private $scope: IScope,
                 private $state: angular.ui.IState,
                 private $ionicLoading: ionic.loading.IonicLoadingService,
                 private ceturbApiService: CeturbApiService ) {
        this.$scope.$on( '$ionicView.beforeEnter', () => this.activate() );
    }

    /**
     *
     */
    public activate(): void {
        this.populated = false;
        this.filter = '';
        this.lastFilter = '';
        this.lines = this.cachedLines = this.filteredLines = [];
        this.getLines();
    }

    /**
     * 
     * 
     * @param {string} id
     */
    public goToLine( id: string ): void {
        this.$state.go( 'app.busInfo/:id', { id: id });
    }

    /**
     * Indica se existe algum processo carregado
     * 
     * @readonly
     * @type {boolean}
     */
    public get hasLines(): boolean {
        return !!this.filteredLines.length;
    }

    public get hasMoreLines(): boolean {
        return this.lines.length < this.filteredLines.length;
    }

    /**
     * 
     */
    public getLines(): void {
        this.$ionicLoading.show();
        this.ceturbApiService.getLines()
            .then( lines => {
                this.cachedLines = this.filteredLines = <BusLine[]>lines;
                this.populated = true;
                return this.cachedLines;
            })
            .catch(() => {
                this.cachedLines = this.filteredLines = [];
            }).finally( () => {
                this.$ionicLoading.hide();
            } );
    }

    public getFilteredLines( lineCount ): void {
        let lengthLines = this.lines.length;
        this.lines = this.lines.concat( this.filteredLines.slice( lengthLines, lengthLines + lineCount ) );
        this.$scope.$broadcast( 'scroll.infiniteScrollComplete' );
    }

    /**
     * Propriedade utilizada no debounce da função de filtro. Salva o setTime caso precise ser cancelado.
     * 
     * @private
     */
    private fnLastFilter = undefined;

    /**
     * Função de filtro implementada com debounce de 500ms
     * 
     * @param {string} filter
     */
    public filterLines( filter: string ): void {
        if ( this.fnLastFilter ) {
            clearTimeout( this.fnLastFilter );
        }

        this.fnLastFilter = setTimeout( () => {
            this.lines = [];
            let upperFilter = filter.toUpperCase();
            this.filteredLines = this.cachedLines.filter( x => ( x.name.indexOf( upperFilter ) >= 0 ) || ( x.number.indexOf( upperFilter ) >= 0 ) );
            this.fnLastFilter = undefined;
            this.getFilteredLines( this.defaultPageSize );

            if ( this.filteredLines.length === 0 ) {
                this.lastFilter = filter;
            }

            this.$scope.$apply();
        }, 500 );
    }
}
