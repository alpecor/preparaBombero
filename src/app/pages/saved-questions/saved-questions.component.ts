import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { RequestService } from '../../services/request.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { TextSanitizerComponent } from "../../components/text-sanitizer/text-sanitizer.component";

// ---- Tipos (fuera de la clase)
interface Topic { id: string; name: string; }
type BlockKey = 'all' | 'leg' | 'esp' | 'otr';

@Component({
  selector: 'app-saved-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent, TextSanitizerComponent],
  templateUrl: './saved-questions.component.html',
  styleUrls: ['./saved-questions.component.css']
})
export class SavedQuestionsComponent implements OnInit {

  savedQuestions: any[] = [];
  topics = new Set();
  topicSelected: string = '';

  constructor(private requestService: RequestService,private localStorageService: LocalStorageService) {}


  ngOnInit(): void {
    this.loadSavedQuestions();
  }



  //************************* PETICIÓN PARA OBTENER PREGUNTAS GUARDADAS ****************************//

  async loadSavedQuestions() {
    // Primero cargamos las preguntas reportadas
    this.savedQuestions = await this.requestService.request('GET', `/quiz/favorite`, {}, {}, true);
    this.topics = new Set(this.savedQuestions.map( (x:any) => x.topicTitle));
    if (this.topicSelected != ''){
      this.savedQuestions = this.savedQuestions.filter( (x:any) => x.topicTitle == this.topicSelected); 
    }
    this.savedQuestions.map((x:any)=>x.isCorrected = false);
    this.savedQuestions.map((x:any)=>x.showJustification = false);
    this.savedQuestions.map((x:any)=>x.optionSelected = null);
    // Iteramos sobre cada pregunta reportada para añadir el título del tema (topic.title)
    // for (let question of data) {
    //   // Hacemos una petición para obtener el título del tema según el topicId de la pregunta
    //   let topicData = null;
    //   if (question.quiz.topicId != null) {
    //     topicData = await this.requestService.request('GET', `/topic/${question.quiz.topicId}`, {}, {}, true);
    //   }
    //   // Añadimos el título del tema a la pregunta
    //   question.quiz.topicTitle = topicData?.title ?? "Esta pregunta todavía no está asignada a ningún tema";
    // }
    // Asignamos los datos modificados a la propiedad this.questions
    //this.questions = data;
  }


  async handleButtonClick(id:number, selectedOption: string) {
    const payload = {
      quizzes: [
        {
          quizId: id,
          optionSelected: selectedOption
        }
      ],
      type: "REVIEW"
    };
    try {
      const response = await this.requestService.request('POST', '/quiz/check', payload, {}, true);
      const quizResponse = response.quizzes[0];

      // Guardar la respuesta correcta en la pregunta correspondiente
      this.savedQuestions = this.savedQuestions.map((question: any) => {
        if (question.id === id) {
          return {
            ...question,
            optionSelected: selectedOption,
            isCorrected :true,// Marcar como corregida
            correctAnswer: quizResponse.result, // Guardar la respuesta correcta
            showJustification: false // Nueva propiedad para controlar la visibilidad del motivo
          };
        }
        return question;
      });
    } catch (error) {
      console.error('Error al corregir la pregunta:', error);
    }
  }



  async showJustification(id:number, value:boolean) {
    try {
      // Guardar la respuesta correcta en la pregunta correspondiente
      this.savedQuestions = this.savedQuestions.map((question: any) => {
        if (question.id === id) {
          return {
            ...question,
            showJustification: value // Nueva propiedad para controlar la visibilidad del motivo
          };
        }
        return question;
      });
    } catch (error) {
      console.error('Error al corregir la pregunta:', error);
    }
  }


  

 
  //************************* FUNCIÓN PARA ELIMINAR LA PREGUNTA GUARDADA ****************************//
  async deleteSavedQuestion(id: number) {
    try{
      await this.requestService.request('DELETE', `/quiz/${id}/favorite`,{},{}, true);
      this.loadSavedQuestions();
      alert("se ha eliminado la pregunta guardada.");
    }catch(error: any){
      console.log(error);
    }
  }


}

