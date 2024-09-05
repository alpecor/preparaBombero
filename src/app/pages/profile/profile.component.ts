import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart,
  ChartComponent,
  NgApexchartsModule
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [NgOptimizedImage, HeaderComponent, FooterComponent, CommonModule, NgApexchartsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {
  chartOptions: Partial<ChartOptions>[] | any = [];
  user: any = {subscribed: false , cancellation_pending: false};

  constructor(private requestService: RequestService, private cdRef: ChangeDetectorRef){}

  async ngOnInit(){
    try {
      this.user = await this.requestService.request('GET', `/user`, {}, {}, true);
      const userStats = await this.requestService.request('GET', `/user/stats`, {}, {}, true);

      this.chartOptions = userStats.map( (x: any) => {
        return {
          series: [x.success, x.fail, x.not_answered],
          chart: {
            width: 380,
            type: "pie"
          },
          labels: ["Correctas", "Falladas", "No respondidas"],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: "bottom"
                }
              }
            }
          ]
        }
      })
      console.log(this.chartOptions)
    } catch (error: any) {
      console.log(error);
    }
  }

  async unsubscribed(){
    try {
      await this.requestService.request('DELETE', `/user/subscription`, {}, {}, true);
      this.user.cancellation_pending = true;
      this.cdRef.detectChanges();
    } catch (error: any) {
      console.log(error);
    }
  }

  async subscribed(){
    try {
      const response = await this.requestService.request('POST', `/user/subscription`, {}, {}, true);
      location.href = response.url;
    } catch (error: any) {
      console.log(error);
    }
  }

}