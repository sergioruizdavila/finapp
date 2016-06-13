/**
 * FirebaseFactory
 * @description - Firebase Service in order to create Firebase connection
 * @constructor
 */

module app.core.firebase {

    'use strict';

    export interface IFirebaseFactory {
        createFirebase: () => Firebase;
        update: (url: string, data: any) => void;
        add: (url: string, data: any, callback: (err) => void) => void;
        getArray: (url: string) => angular.IPromise<AngularFireArray>;
        getArrayByDate: (url: string, startDate: string, endDate: string) => angular.IPromise<AngularFireArray>;
        getObject: (url: string) => angular.IPromise<AngularFireObject>;
    }

    export class FirebaseFactory implements IFirebaseFactory {

        static serviceId = 'finApp.core.firebase.FirebaseFactory';

        /**********************************/
        /*           PROPERTIES           */
        /**********************************/
        baseUrl: string;
        // --------------------------------


        /*-- INJECT DEPENDENCIES --*/
        static $inject = ['dataConfig',
                          '$firebaseArray',
                          '$firebaseObject'];

        constructor(dataConfig: IDataConfig,
                    private $firebaseArray: AngularFireArrayService,
                    private $firebaseObject: AngularFireObjectService) {
            this.baseUrl = dataConfig.baseUrl;
        }

        /*-- METHODS --*/

        /**
        * Creates a new Firebase JavaScript API Object from this configuration.
        * @returns {Firebase}
        */
        createFirebase(): Firebase {
            return new Firebase(this.baseUrl);
        }

        /**
        * update
        * @description - update service against Firebase
        * @function
        * @params {string} url - uri of firebase
        * @params {any} data - data to send in order to update object on firebase
        */
        update(url, data): void {
            let ref = new Firebase(this.baseUrl + url);
            ref.update(data);
        }

        /**
        * add
        * @description - add item on Array against Firebase
        * @function
        * @params {string} url - uri of firebase
        * @params {any} data - item to send in order to add object on firebase
        */
        add(url, data, callback): void {
            let ref = new Firebase(this.baseUrl + url);
            ref.set(data, callback);
        }

        /**
        * getArray
        * @description - get data array against Firebase
        * @function
        * @params {string} url - uri of firebase
        * @return {angular.IPromise<AngularFireArray>} data - Array gotten from firebase
        */
        getArray(url): angular.IPromise<AngularFireArray> {
            let ref = new Firebase(this.baseUrl + url);
            return this.$firebaseArray(ref).$loaded().then(function(data) {
                return data;
            });
        }

        /**
        * getArrayByDate
        * @description - get data by date range against Firebase
        * @function
        * @params {string} url - uri of firebase
        * @params {string} startDate - start specific Date
        * @params {string} endDate - end specific Date
        * @return {angular.IPromise<AngularFireArray>} data - Array gotten from firebase
        */
        getArrayByDate(url, startDate, endDate): angular.IPromise<AngularFireArray> {
            let ref = new Firebase(this.baseUrl + url);
            let query: any = ref.orderByChild("dateCreated/complete").startAt(startDate).endAt(endDate);
            return this.$firebaseArray(query).$loaded().then(function(data) {
                return data;
            });
        }

        /**
        * getObject
        * @description - get data object against Firebase
        * @function
        * @params {string} url - uri of firebase
        * @params {string} startDate - start specific Date
        * @params {string} endDate - end specific Date
        * @return {angular.IPromise<AngularFireObject>} data - object gotten from firebase
        */
        getObject(url): angular.IPromise<AngularFireObject> {
            let ref = new Firebase(this.baseUrl + url);
            return this.$firebaseObject(ref).$loaded().then(function(data) {
                return data;
            });
        }



        static instance(dataConfig: IDataConfig,
                        $firebaseArray: AngularFireArrayService,
                        $firebaseObject: AngularFireObjectService): IFirebaseFactory {
            return new FirebaseFactory(dataConfig, $firebaseArray, $firebaseObject);
        }

    }

    angular.module('finApp.core.firebase', [])
    .factory(FirebaseFactory.serviceId, [
        'dataConfig',
        '$firebaseArray',
        '$firebaseObject',
        FirebaseFactory.instance]);

}
