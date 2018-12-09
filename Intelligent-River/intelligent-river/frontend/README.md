# Frontend
This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 1.4.9.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

#### Generating new components
If the component is likely to be used everywhere, run `ng generate component components/all/componentName`
Else if the component is going to map to a dedicated route, run `ng generate component components/routes/routeName`
Else if the component is going to be a part of a dediated route, like a column or a row of it, Run `ng generate component components/routes/routeName/subcomponentName`

#### Generating other Angular things
You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.
Servies go in src/app/services
Models have to be made with `touch src/app/modles/model-name.model.ts`

## Examples of project flow
#### Components sharing data with other components
  * ALL COMPONENTS SUBSCRIBE TO SERVICE SUBJECTS: Each component is injected with a service like IntelligentRiverService or AuthService. this gives them access to Event Emitting Behavior Subjects. RxJS Behavior Subjects emit their current value on subscription or 'event listening' and also emit their current value whenever it is automatically or manually changed. This allows the NAVBAR COMPONENT to have access to the entire websites -projects- resource as well as the PROJECTS-MAP COMPONENT having access. In their initialization, both subscribe to the IntelligentRiverService's -observeProjects- behavior subject, and when that subject finally gets back data from the API, it alerts both the navbar and map so the navbar can populate its project selector dropdown and the map can populate all of the project location markers.
  * COMPONENTS NEST OTHER COMPONENTS: some components like the ones named after routes actually just host others. For example, the DATA COMPONENT hosts 4 different components--the DATA-CURRENT COMPONENT, the DATA-HISTORICAL COMPONENT, the PROJECTS-MAP COMPONENT, and the DEPLOYMENTS-MAP COMPONENT. Depending on the status of its class members like whether projects, deployments, deployments by projectID or tab selection changes which component is loaded by *ngIF. It's a primitive use of flagging to signal which component should be used in what application state.
  * A NESTED ROUTER COMPONENT SERVES TO COLLECT ROUTER INFO: a dummy router component is necessary to be nested at the 'right depth' of the application within other components in order to acquire the right routing information. Because the way the router works in angular, subscribing to routing events on the top-level APP COMPONENT or even the second-level NAVBAR COMPONENT ends up leaving out critical information like the projectID of the route or the resoure name itself. There are other workarounds but this seemed most reasonable. 


#### Feature: "login"
  * src/app/services/auth.service.ts
    1. On construction, AuthService looks for a reference to 'intelligentriver.org-currentUser' key in LocalStorage. If none exists, it sets its this.currentUser to null and notifies all listeners to the observeCurrentUser behavior subject that its current value is now null. If one exists, it is parsed and set to this.currentUser and all listeners listening to the observeCurrentUser behavior subject get notified of that value.
  * src/app/components/all/navbar/navbar.componennt.html
    1. on init, the navbar listens to the AuthService observeCurrentUser behavior subject for any indication of the existence of a current user. If it finds null, then the login button becomes available
    2. user clicks login button
    3. opens a modal which contains the LOGIN COMPONENT
	src/app/components/all/login.componennt.html	
  * LOGIN COMPONENT opens
    1. a form is passed from the HTML to onSignIn() in the typescript logic
  * src/app/components/all/login.componennt.ts
    1. onSignIn(value, invalid) - validates the form, calls the AuthService.postSignOut and passes in the information from the HTML like login and SHA1-ed password
  * src/app/services/auth.service.ts
    1. postSignIn(login: string, passwordSHA1: string) takes in the login name and the hashed password and calls the API asynchronously. While it waits, it returns an observable object that the login component is listening to anyway.
    2. When the response comes back, if the user is successfully logged in, the AuthService observeCurrentUser is updated and notifies any other listening component but also resolves the observable object it originally returned. It also saves the current user information which includes the API Token in LocalStorage under the key 'intelligentriver.org-currentUser'. We return to the LOGIN COMPONENT
	src/app/components/all/login.componennt.ts
    3. resolving the Observable object coming from the AuthService, the login component finally deals with the return if it was successful or not. it then updates the HTML with the results.
  * src/app/components/all/login.componennt.html
    1. currentUser is !null so the *ngIf on the button changes to 'logout'