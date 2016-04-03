/**
 * SignUpPageController
 * @description - Sign up Page Controller
 */

module app.pages.signUpPage {

    /**********************************/
    /*           INTERFACES           */
    /**********************************/
    export interface ISignUpPageController {
        ref: Firebase;
        form: ISignUpForm;
        error: ISignUpError;
        register: () => void;
        goToBack: () => void;
        activate: () => void;
    }

    export interface ISignUpForm {
        email: string;
    }

    export interface ISignUpError {
        message: string;
    }

    /****************************************/
    /*           CLASS DEFINITION           */
    /****************************************/
    export class SignUpPageController implements ISignUpPageController {

        static controllerId = 'finApp.pages.signUpPage.SignUpPageController';

        /**********************************/
        /*           PROPERTIES           */
        /**********************************/
        ref: Firebase;
        form: ISignUpForm;
        error: ISignUpError;
        // --------------------------------


        /*-- INJECT DEPENDENCIES --*/
        public static $inject = ['$ionicHistory',
            '$ionicPopup',
            '$state',
            '$stateParams',
            'finApp.auth.AuthService',
            '$filter',
            'finApp.models.UserService',
            '$scope',
            '$rootScope'];

        /**********************************/
        /*           CONSTRUCTOR          */
        /**********************************/
        constructor(private $ionicHistory: ionic.navigation.IonicHistoryService,
            private $ionicPopup: ionic.popup.IonicPopupService,
            private $state: ng.ui.IStateService,
            private AuthService,
            private $filter: angular.IFilterService,
            private User: app.models.user.IUserService,
            private $scope: angular.IScope,
            private $rootScope: app.models.user.IUserRootScope) {

            this.init();

        }

        /*-- INITIALIZE METHOD --*/
        private init() {
            //Create User Object
            this.$rootScope.User = new app.models.user.User();

            //Init form
            this.form = {
                email: ''
            };
            //TODO: AngularFire no me permite crear un Usuario nuevo sin una password valida
            // Asi que le asignaremos una temporal para poder permitir crear el user. Buscar
            // Una solucion màs optima
            //this.user = new app.models.User();

            this.error = {
                message: ''
            };

            this.activate();
        }

        /*-- ACTIVATE METHOD --*/
        activate(): void {
            console.log('signUpPage controller actived');
        }

        /**********************************/
        /*            METHODS             */
        /**********************************/

        /*
        * Register Method
        * @description Create new user if current user doesn`t have an account
        */
        register(): void {

            let self = this;
            //CONSTANTS
            const POPUP_TITLE = this.$filter('translate')('%popup.create_user.title.text');
            const POPUP_BODY_TEXT = this.$filter('translate')('%popup.create_user.body_message.text');
            const POPUP_CANCEL_BUTTON_TEXT = this.$filter('translate')('%popup.general.cancel_button.text');
            const POPUP_OK_BUTTON_TEXT = this.$filter('translate')('%popup.create_user.ok_button.text');
            const POPUP_OK_BUTTON_TYPE = 'button-positive';
            /********************/
            //TODO: Deberia hacer el siente ciclo:
            //      1.Ir a la base de datos y validar si existe un usuario con este email.
            //      2. Si no existe, deberia mostrar el popUp y preguntar si quiere crear un nuevo User.
            //      3. Si presiono: Crear, deberia primero autenticar al usuario, despues crear un nuevo usuario,
            //      4. y despues de eso deberia guardarlo en la base de datos.
            //      5. Traerme a ese usuario y tener el modelo transversal a la App.

            //Bindea el 'user' con la vista y la base de datos
            /*this.$scope.user = new app.models.User();
            var _this = this;
            this.User.getUserByEmail('sergioruizdavila22').$bindTo(this.$scope, 'user').then(function(){
                _this.$scope.user.username = 'Pablo Pedro';
            });*/

            //Save new email in User object
            this.$rootScope.User.email = this.form.email;

            //Validate if the email already exist on database
            this.User.existUserByEmail(this.$rootScope.User.email).then(function(isExist){
                //user exist in database
                if (isExist) {
                    //TODO:Deberia llevarme a loguearme.
                    self.$state.go('page.logIn');
                } else {
                    //TODO: mostrar el popUp para preguntar si quiere crear una nueva cuenta
                    //Show popUp in order to warn the user that if he/she doesn't have account, we are going to create new one
                    let confirmInstance = self.$ionicPopup.show({
                        title: POPUP_TITLE,
                        template: POPUP_BODY_TEXT,
                        buttons: [
                            { text: POPUP_CANCEL_BUTTON_TEXT },
                            {
                                text: POPUP_OK_BUTTON_TEXT,
                                type: POPUP_OK_BUTTON_TYPE,
                                onTap: function(e) {
                                    console.log('onTap Button Event: ', e);
                                    //TODO: Si presiona Ok, deberia crear el usuario en la base,
                                    self.AuthService.getRef().$createUser(self.$rootScope.User).then(function(user) {
                                        console.log('new user: ', user);
                                    }, function(error) {
                                        //Llevar a la pagina de Logging si ese mail ya esta registrado
                                        if (error.code === 'EMAIL_TAKEN') {
                                            self.$state.go('page.logIn');
                                        } else {
                                            self.error = error;
                                        }
                                    });
                                }
                            }
                        ]
                    });

                    confirmInstance.then(function(res) {
                        if (res) {
                            //Si presiona SI, lo deberia llevar a la funcion login()

                        } else {
                            console.log('You are not sure');
                        }
                    });
                }
            });

        };

        /*
        * Go to back method
        * @description this method is launched when user press back button
        */
        goToBack(): void {
            this.$ionicHistory.goBack();
        }

    }

    /*-- MODULE DEFINITION --*/
    angular
        .module('finApp.pages.signUpPage')
        .controller(SignUpPageController.controllerId, SignUpPageController);

}
