import { Component, OnInit } from "@angular/core";
import { DashbaordChartService } from "../../../services/dashboard-chart";

@Component({
  selector: "ngx-add-channel",
  templateUrl: "./add-channel.component.html",
  styleUrls: ["./add-channel.component.scss"],
})
export class AddChannelComponent implements OnInit {
  constructor(private _dashboard: DashbaordChartService) {}

  obj = {
    ChannelFilterName: null,
  };

  channelList : any = []
  ngOnInit(): void {
    this.getChannelList()
  }

  onSubmit() {
    if (!this.obj.ChannelFilterName) {
      return alert("Enter channel Name!");
    }

    this._dashboard.addChannel(this.obj).subscribe((res: any) => {
      console.log("Response in add..", res);
      if (res.response.status) {
        alert(this.obj.ChannelFilterName + " add successfully!");
        window.location.href = "/pages/channel";
      }else{
        alert("Something went wrong!");
      }
    });
  }

  getChannelList(){
    this._dashboard.getChannelList().subscribe((res : any)=>{

      for(let channel of res.Data){
        this.channelList.push(channel.ChannelFilterName)

      }
    })
  }
}
