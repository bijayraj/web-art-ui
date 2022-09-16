import { Observable, tap, TeardownLogic } from "rxjs";
import { AuthenticationService } from "../services/authentication.service";


// export function appInitializer(authenticationService: AuthenticationService): () => Observable<any> {
//     return () =>  authenticationService.refreshToken()
//     .subscribe()
//     .add(resolve)

//     //   .pipe(
//     //      tap(user => { })
//     //   );
//    }

export function appInitializer(authenticationService: AuthenticationService) {
    
    return () => new Promise(resolve => {
        // attempt to refresh token on app start up to auto authenticate

        authenticationService.refreshToken()
            .subscribe()
            .add(resolve as TeardownLogic );
        

    });
}