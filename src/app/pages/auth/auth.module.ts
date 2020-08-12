import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import {
  NbAuthModule,
  NbAuthComponent,
  NbPasswordAuthStrategy,
  NbAuthJWTToken,
} from "@nebular/auth";
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
} from "@nebular/theme";
import { LoginComponent } from "./login/login.component";
import { RegisterComponent } from "./register/register.component";
import { ApiLinks } from "../../services/apilinks";

const _api = new ApiLinks();

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
            key: "auth-token",
          },
          baseEndpoint: _api.baseUrl,
          login: {
            // ...
            endpoint: _api.login,
            method: "POST",
            redirect: {
              success: "auth/register/",
              failure: null,
            },
          },
          register: {
            // ...
            endpoint: _api.register,
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
