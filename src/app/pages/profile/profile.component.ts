import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterLink } from '@angular/router';
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
  imports: [NgOptimizedImage, HeaderComponent, FooterComponent, CommonModule, NgApexchartsModule, RouterLink],
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  chartOptions: any[] = [];
  recentStats: any[] = [];
  user: any = {subscribed: false , cancellation_pending: false};
  averageScore = 0;
  bestScore = 0;
  totalQuestions = 0;
  isSubscriptionUpdating = false;
  subscriptionError = '';

  constructor(private requestService: RequestService, private cdRef: ChangeDetectorRef){}

  async ngOnInit(){
    try {
      this.user = await this.requestService.request('GET', `/user`, {}, {}, true);
      const userStats = await this.requestService.request('GET', `/user/stats`, {}, {}, true);

      this.recentStats = Array.isArray(userStats) ? userStats : [];
      this.chartOptions = this.recentStats.map( (x: any) => {
        return {
          series: [x.success, x.fail, x.not_answered],
          chart: {
            width: 190,
            height: 190,
            type: "donut"
          },
          labels: ["Correctas", "Falladas", "No respondidas"],
          colors: ['#2788d9', '#e97845', '#f2b233'],
          dataLabels: {
            enabled: false
          },
          legend: {
            show: false
          },
          stroke: {
            width: 3,
            colors: ['#ffffff']
          },
          plotOptions: {
            pie: {
              donut: {
                size: '68%'
              }
            }
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 170,
                  height: 170
                },
              }
            }
          ]
        }
      })
      this.updateSummary();
    } catch (error: any) {
      console.log(error);
    }
  }

  async unsubscribed(){
    if (this.isSubscriptionUpdating) {
      return;
    }

    this.isSubscriptionUpdating = true;
    this.subscriptionError = '';

    try {
      await this.requestService.request('DELETE', `/user/subscription`, {}, {}, true);
      this.user.cancellation_pending = true;
    } catch (error: any) {
      console.error('Error cancelando la suscripción:', error);
      this.subscriptionError = 'No se ha podido cancelar la suscripción. Inténtalo de nuevo.';
    } finally {
      this.isSubscriptionUpdating = false;
      this.cdRef.detectChanges();
    }
  }

  async subscribed(){
    if (this.isSubscriptionUpdating) {
      return;
    }

    this.isSubscriptionUpdating = true;
    this.subscriptionError = '';

    try {
      const response = await this.requestService.request('POST', `/user/subscription`, {}, {}, true);
      location.href = response.url;
    } catch (error: any) {
      console.error('Error creando la suscripción:', error);
      this.subscriptionError = 'No se ha podido iniciar la suscripción. Inténtalo de nuevo.';
      this.isSubscriptionUpdating = false;
      this.cdRef.detectChanges();
    }
  }

  getStatTotal(stat: any): number {
    return Number(stat?.success || 0) + Number(stat?.fail || 0) + Number(stat?.not_answered || 0);
  }

  getStatScore(stat: any): number {
    const total = this.getStatTotal(stat);
    return total > 0 ? (Number(stat?.success || 0) / total) * 100 : 0;
  }

  getScoreClass(stat: any): string {
    const score = this.getStatScore(stat);

    if (score >= 80) {
      return 'profile-score-good';
    }

    if (score >= 50) {
      return 'profile-score-medium';
    }

    return 'profile-score-low';
  }

  getScoreLabel(stat: any): string {
    const score = this.getStatScore(stat);

    if (score >= 80) {
      return 'Muy buen resultado';
    }

    if (score >= 50) {
      return 'A seguir mejorando';
    }

    return 'Necesita repaso';
  }

  private updateSummary() {
    const scores = this.recentStats.map(stat => this.getStatScore(stat));

    this.averageScore = scores.length
      ? scores.reduce((total, score) => total + score, 0) / scores.length
      : 0;
    this.bestScore = scores.length ? Math.max(...scores) : 0;
    this.totalQuestions = this.recentStats.reduce(
      (total, stat) => total + this.getStatTotal(stat),
      0
    );
  }

}
