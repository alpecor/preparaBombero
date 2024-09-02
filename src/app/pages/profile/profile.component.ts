import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, CommonModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

  user: any = {subscribed: false , cancellation_pending: false};

  constructor(private requestService: RequestService, private cdRef: ChangeDetectorRef){}


  async ngOnInit(){
    try {
      this.user = await this.requestService.request('GET', `http://localhost:3000/user`, {}, {}, true);
    } catch (error: any) {
      console.log(error);
    }
  }

  async unsubscribed(){
    try {
      await this.requestService.request('DELETE', `http://localhost:3000/user/subscription`, {}, {}, true);
      this.user.cancellation_pending = true;
      this.cdRef.detectChanges();
    } catch (error: any) {
      console.log(error);
    }
  }

  async subscribed(){
    try {
      const response = await this.requestService.request('POST', `http://localhost:3000/user/subscription`, {}, {}, true);
      location.href = response.url;
    } catch (error: any) {
      console.log(error);
    }
  }






}


