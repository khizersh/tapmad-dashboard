import { Component, OnInit } from "@angular/core";
import { NbRegisterComponent } from "@nebular/auth";

@Component({
  selector: "ngx-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent extends NbRegisterComponent {
  myFunc() {
    alert("memon");
  }
  ngOnInit(): void {}

  register() {
    this.service
      .register("email", {
        name: this.user.fullName,
        email: this.user.email,
        password: this.user.password,
        password2: this.user.confirmPassword,
        role: "admin",
      })
      .subscribe((res) => {});
  }
}
