# Front
- The main website for the Intelligent River project. Refactored and polished.
- Development requires different steps to set up than Deployment. During development, Spring-Boot which is hosted at `./` is served onto <http://localhost:8000> and serves as the API backend. Angular 4 which is hosted at `./frontend` is served onto <http://localhost:4200>. Developing on one does not affect the other. Angular 4 is configured by proxy to redirect all `/api` routes to <http://localhost:8000>. During deployment this will change.
- During Deployment, Angular 4 will be built by npm and located in `./src/main/resources/public`. Then, serving only Spring-Boot at the `./` will run both applications natively.

### BUGS
* Angular 4 build when put in `./src/main/resources/static` does not serve correctly in Spring-Boot even when taking off the proxy config.

### Setting Up the Development Environment
1. **Git**
  * *Windows 10*: Download Git for Windows SCM (A terminal application)
    - https://github.com/git-for-windows/git/releases/tag/v2.14.3.windows.1
  * *macOS*: Install via Xcode Developer Tools
    1. Spotlight > Terminal
        ```shell
        gcc
        ```
    3. accept all terms and conditions -- 1.1Gb download
  * *Ubuntu*: Install through shell
        ```shell
        sudo apt install git
        ```
  * Configure Git for I-SENSE
      ```shell
      git config --global user.email "you@example.com"
      git config --global user.name "Your Name"
      git clone https://github.com/I-SENSE/Front.git
      ```
2. **Java JDK**
  - http://www.oracle.com/technetwork/java/javase/downloads/jdk9-downloads-3848520.html
3. **Spring-Boot**: run and check that <http://localhost:8000> is live
  - Option 1: Via **Gradle**
    * *Windows 10*: Install Gradle and add to PATH
      - https://docs.gradle.org/current/userguide/installation.html
    * *macOS*: Install Gradle through a package manager like brew
      - https://gradle.org/install/#install
    * *Ubuntu*: Install Gradle via shell
        ``` shell
        sudo apt-get install gradle
        ```
    1. Navigate to root directory in cloned repository
    2. Run via Gradle
        ```shell
        gradle bootRun
        ```
  - Option 2: Via **IntelliJ IDEA by JetBrains**
    1. close all projects that you have opened
    2. `Import Project`
    3. Navigate to the cloned repo
    4. Check the radio button `Import project from external model`
    5. Select `Gradle`
    6. `Next`
    7. Check the radio button `Use gradle wrapper task configuration`
    8. `Finish`
    9. Let it build, takes 3 minutes
4. **Angular 4**
	1. Install NodeJS and npm
		* *Windows 10* / *macOS*: Install using installers
			- https://nodejs.org/en/download/current/
		* *Ubuntu*: Install with shell commands
			+ https://nodejs.org/en/download/package-manager/
  2. Install Angular-CLI via npm
      ```shell
      npm install -g @angular/cli
      ```
  3. Install Angular 4 Dependencies
    1. Navigate to `./frontend`
    2. Run in shell
        ```shell
       	npm install
      	npm start
        ```




### Angular CLI Development Particulars
  * Making a new app
    ```shell
    ng new app-name --styles:scss
    ```
  * Configure and old Angular CLI app to use SASS instead of CSS
    ```shell
    ng set defaults.styleExt scss
    ```
  * Adding libraries to npm modules
    ```shell
    npm install --save jquery popper.js bootstrap@4.0.0-beta @ng-bootstrap/ng-bootstrap
    @angular/material @angular/cdk @ngui/map @types/googlemaps
    npm install --save-dev @types/jquery
    ```
  * Add the following to modules
    ```javascript
    NguiMapModule.forRoot({
      apiUrl: 'https://maps.google.com/maps/api/js?key=AIzaSyBH3lG3-zHJdTTOzx-J8ft2v1syC9MGCnE'
    })
    ```
  * modify .angular-cli.json to use these libraries by replacing the following keys with these values
    ```javascript
    "styles": [
        "../node_modules/bootstrap/dist/css/bootstrap.min.css",
        "styles.css"
    ],
    "scripts": [
        "../node_modules/jquery/dist/jquery.min.js",
        "../node_modules/popper.js/dist/popper.min.js",
        "../node_modules/bootstrap/dist/js/bootstrap.min.js"
    ]
    ```
  * if in development mode and using separate servers for front and back ends
    ```shell
    cd ./frontend
    touch proxy.conf.json
    vim proxy.conf.json
    ```
  * add the following text to proxy.conf.json:
    ```javascript
    {
      "/api": {
        "target": "http://http://localhost:8000/",
        "secure": false,
        "logLevel": "debug"
      }
    }
    ```
  * add the following text to packages.json:
    ```javascript
    "scripts": {
      "ng": "ng",
      "start": "ng serve  --proxy-config proxy.conf.json",
      "build": "ng build",
      "test": "ng test",
      "lint": "ng lint",
      "e2e": "ng e2e"
    },
    ```
  * add jquery to the top of  ```./frontend/src/app/app.module.ts```
    ```javascript
    import * from jquery as 'jquery'
    ```
  * add jquery to any components that need it in ```./frontend/src/app/components/*```
    ```javascript
    import * from jquery as $
    ```
  * add some new components as needed
    ```shell
    ng generate component dir-name/component-name
    ```
  * add some routes to ```./frontend/src/app/app.module.ts```
    ```javascript
    import { Route } from '@angular/routes';
    const routes = {
      { path: '/', component: component-name },
      { path: '/resource', component: ResourceComponent}
    };
    // and one other place I forgot. hm.
    ```
  * add some http request functionality
    ```javascript
    import { Http } from '@angular/http';
    imports = [
      HttpClientModule
    ]
    // and one other place I forgot. hm.
    ```

### Angular-Spring Build Particulars
  * change the angular-cli.apps.outDir to be the actual directory of Spring-Boot's static page location
    ```javascript
    "apps": [
      {
        "outDir": "../src/main/resources/static"
      }
    ]
    ```
  * Build with:
    ```shell
    npm build
    ```
  * Spring-Boot with Gradle
    ```shell
    gradle bootRun
    ```










### Decent Links
+ Proxy the server within angular-cli at https://github.com/angular/angular-cli/blob/master/docs/documentation/stories/proxy.md
Important thing is that you use ```npm start instead``` of ng serve
https://stackoverflow.com/questions/37172928/angular-cli-server-how-to-proxy-api-requests-to-another-server
+ BUILD OPTION 1: Inside ./frontend, make sure you modify the build to production so that it compiles straight into the static folder. reference: https://gist.github.com/anonymous/e50db188c8c5f65a241a0d7c8299bacd and https://www.youtube.com/watch?v=Aduicn2FT58.
Modify ./package.json to include:
```javascript
    "build": "ng build -prod",
    "postbuild": "npm run deploy",
    "predeploy": "rimraf ../server/src/main/resources/static && mkdirp ../server/src/main/resources/static",
    "deploy": "copyfiles -f dist/** ../server/src/main/resources/static",
```
+ BUILD OPTION 2: use a proxy on <http://localhost:4200>/api/\*
<http://javasampleapproach.com/java-integration/integrate-angular-4-springboot-web-app-springtoolsuite#6_Integrate_SpringBoot_server_and_Angular_4_client>
