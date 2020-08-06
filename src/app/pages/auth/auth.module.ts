import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";

import {
  NbAuthModule,
  NbAuthComponent,
  NbPasswordAuthStrategy,
  NbAuthJWTToken,
  NbRegisterComponent,
} from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";

const Routes: Routes = [
  {
    path: "",
    component: NbAuthComponent,
    children: [
      {
        path: "login",
        component: LoginComponent,
      },
      {
        path: "register",
        component: RegisterComponent,
      },
    ],
  },
  // {
  //   path: 'login',
  //   component: NbLoginComponent,
  // },
  // {
  //   path: 'register',
  //   component: NbRegisterComponent,
  // },
  // {
  //   path: 'logout',
  //   component: NbLogoutComponent,
  // },
  // {
  //   path: 'request-password',
  //   component: NbRequestPasswordComponent,
  // },
  // {
  //   path: 'reset-password',
  //   component: NbResetPasswordComponent,
  // },
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: "email",
          token: {
            class: NbAuthJWTToken,
            key: "token",
          },
          baseEndpoint: "http://localhost:4200",
          login: {
            // ...
            endpoint: "/api/auth/login",
            method: "POST",
          },
          register: {
            // ...
            endpoint: "/api/auth/register",
            method: "POST",
          },
        }),
      ],
      forms: {
        login: {
          redirectDelay: 0,
          showMessages: {
            success: true,
          },
        },
      },
    }),
    RouterModule.forChild(Routes),
  ],
  declarations: [LoginComponent, RegisterComponent],
})
export class AuthModule {}
