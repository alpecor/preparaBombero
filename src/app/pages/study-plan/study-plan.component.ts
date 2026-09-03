import { CommonModule } from '@angular/common';
import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { LocalStorageService } from '../../services/local-storage.service';
import { RequestService } from '../../services/request.service';

interface DurationOption {
  label: string;
  value: number;
}

interface StudySession {
  id: number;
  date: string;
  type: 'NORMAL' | 'SIMULACRO' | 'SPRINT' | string;
  percentage: number | null;
  topics: string[];
  status: 'PENDIENTE' | 'REALIZADA' | 'NO_REALIZADA' | string;
}

interface StudyPlanSummary {
  community?: string;
  city?: string;
  type?: string;
}

interface HistoryWeek {
  key: string;
  sessions: StudySession[];
}

type SetupDropdown = 'community' | 'province' | 'administration' | 'duration' | null;

const SPAIN_TIME_ZONE = 'Europe/Madrid';

@Component({
  selector: 'app-study-plan',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, FooterComponent],
  templateUrl: './study-plan.component.html',
})
export class StudyPlanComponent implements OnInit, OnDestroy {
  configuration: Record<string, Record<string, string[]>> = {};
  communities: string[] = [];
  provinces: string[] = [];
  administrations: string[] = [];

  selectedCommunity = '';
  selectedProvince = '';
  selectedAdministration = '';
  selectedDuration = '';
  activeSetupDropdown: SetupDropdown = null;

  readonly durationOptions: DurationOption[] = this.createDurationOptions();

  sessions: StudySession[] = [];
  todaySession: StudySession | null = null;
  upcomingSessions: StudySession[] = [];
  historySessions: StudySession[] = [];
  historyWeeks: HistoryWeek[] = [];
  historyPage = 0;
  expandedSessionId: number | null = null;
  hasPlan = false;
  isRestDay = false;
  isTodayTopicsExpanded = false;
  isStartingSession = false;
  isReviewingSessionId: number | null = null;
  isDeletingPlan = false;
  showDeleteConfirmation = false;
  isUpdatingExamDate = false;
  showDateConfirmation = false;
  pendingExamDate = '';
  showSettings = false;
  currentPlan: StudyPlanSummary | null = null;
  currentExamDate: string | number | null = null;
  settingsSelectedDuration = '';
  confirmedSettingsDuration = '';
  countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
  countdownExpired = false;
  private countdownTimer: ReturnType<typeof setInterval> | null = null;

  isLoading = true;
  isSubmitting = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private requestService: RequestService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.loadPlan();
  }

  ngOnDestroy(): void {
    this.stopCountdown();
  }

  async loadPlan(): Promise<void> {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const [response, user] = await Promise.all([
        this.requestService.request('GET', '/study', {}, {}, true),
        this.requestService.request('GET', '/user', {}, {}, true)
      ]);
      this.sessions = Array.isArray(response) ? response : [];
      this.currentExamDate = user?.examEstimatedDate ?? null;
      this.hasPlan = this.sessions.length > 0;

      if (this.hasPlan) {
        this.preparePlanView();
      } else {
        await this.loadConfiguration();
      }
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido cargar tu plan de estudio.'
      );
    } finally {
      this.isLoading = false;
      this.startCountdown();
    }
  }

  private async loadConfiguration(): Promise<void> {
    const response = await this.requestService.request(
      'GET',
      '/study/configuration',
      {},
      {},
      true
    );
    this.configuration = response ?? {};
    this.communities = Object.keys(this.configuration).filter(Boolean);
  }

  private preparePlanView(): void {
    const todayKey = this.dateKey(new Date());
    this.isRestDay = this.weekday(new Date()) === 0;
    const sessionForToday = this.sessions.find(
      session => this.dateKey(session.date) === todayKey
    );

    this.todaySession = this.isRestDay
      ? null
      : sessionForToday
        ?? this.sessions.find(session => session.status === 'PENDIENTE')
        ?? null;

    const todayId = this.todaySession?.id;
    this.upcomingSessions = this.sessions
      .filter(session =>
        session.id !== todayId &&
        session.status === 'PENDIENTE' &&
        this.dateKey(session.date) >= todayKey &&
        this.weekday(session.date) !== 0
      )
      .sort((a, b) => this.timestamp(a.date) - this.timestamp(b.date))
      .slice(0, 5);

    this.historySessions = this.sessions
      .filter(session => session.status !== 'PENDIENTE')
      .sort((a, b) => this.timestamp(b.date) - this.timestamp(a.date));
    this.historyWeeks = this.groupHistoryByWeek(this.historySessions);
    this.historyPage = 0;
    this.expandedSessionId = null;
  }

  get visibleHistorySessions(): StudySession[] {
    return this.historyWeeks[this.historyPage]?.sessions ?? [];
  }

  get historyPageCount(): number {
    return this.historyWeeks.length;
  }

  get currentHistoryWeekLabel(): string {
    const currentWeek = this.historyWeeks[this.historyPage];
    return currentWeek ? this.formatHistoryWeekLabel(currentWeek.key) : '';
  }

  previousHistoryPage(): void {
    if (this.historyPage === 0) {
      return;
    }

    this.historyPage -= 1;
    this.expandedSessionId = null;
  }

  nextHistoryPage(): void {
    if (this.historyPage >= this.historyPageCount - 1) {
      return;
    }

    this.historyPage += 1;
    this.expandedSessionId = null;
  }

  onCommunityChange(): void {
    this.selectedProvince = '';
    this.selectedAdministration = '';
    this.provinces = this.selectedCommunity
      ? Object.keys(this.configuration[this.selectedCommunity] ?? {})
      : [];
    this.administrations = [];
  }

  toggleSetupDropdown(dropdown: Exclude<SetupDropdown, null>): void {
    if (
      (dropdown === 'province' && this.provinces.length === 0) ||
      (dropdown === 'administration' && this.administrations.length === 0)
    ) {
      return;
    }

    this.activeSetupDropdown = this.activeSetupDropdown === dropdown ? null : dropdown;
  }

  selectCommunity(community: string): void {
    this.selectedCommunity = community;
    this.onCommunityChange();
    this.activeSetupDropdown = null;
  }

  selectProvince(province: string): void {
    this.selectedProvince = province;
    this.onProvinceChange();
    this.activeSetupDropdown = null;
  }

  selectAdministration(administration: string): void {
    this.selectedAdministration = administration;
    this.activeSetupDropdown = null;
  }

  selectDuration(duration: string): void {
    this.selectedDuration = duration;
    this.activeSetupDropdown = null;
  }

  durationValue(duration: DurationOption): string {
    return String(duration.value);
  }

  selectedDurationLabel(): string {
    return this.durationOptions.find(option => this.durationValue(option) === this.selectedDuration)?.label
      ?? 'Selecciona el tiempo disponible';
  }

  @HostListener('document:click')
  closeSetupDropdown(): void {
    this.activeSetupDropdown = null;
  }

  @HostListener('document:keydown.escape')
  closeSetupDropdownOnEscape(): void {
    this.activeSetupDropdown = null;
  }

  onProvinceChange(): void {
    this.selectedAdministration = '';
    this.administrations = this.selectedCommunity && this.selectedProvince
      ? this.configuration[this.selectedCommunity]?.[this.selectedProvince] ?? []
      : [];
  }

  toggleUpcomingSession(sessionId: number): void {
    this.expandedSessionId = this.expandedSessionId === sessionId ? null : sessionId;
  }

  toggleHistorySession(sessionId: number): void {
    this.expandedSessionId = this.expandedSessionId === sessionId ? null : sessionId;
  }

  toggleTodayTopics(): void {
    this.isTodayTopicsExpanded = !this.isTodayTopicsExpanded;
  }

  get canSubmit(): boolean {
    return Boolean(
      this.selectedCommunity &&
      this.selectedProvince &&
      this.selectedAdministration &&
      this.selectedDuration &&
      !this.isSubmitting
    );
  }

  async createStudyPlan(): Promise<void> {
    if (!this.canSubmit) {
      return;
    }

    this.isSubmitting = true;
    this.errorMessage = '';
    this.successMessage = '';

    try {
      await this.requestService.request(
        'POST',
        '/study',
        {
          community: this.selectedCommunity,
          city: this.selectedProvince,
          type: this.selectedAdministration,
          estimateExamDate: Number(this.selectedDuration)
        },
        {},
        true
      );

      window.location.reload();
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido crear el plan de estudio. Revisa los datos e inténtalo de nuevo.'
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  async startStudySession(session: StudySession | null): Promise<void> {
    if (!session || session.status !== 'PENDIENTE' || this.isStartingSession) {
      return;
    }

    this.isStartingSession = true;
    this.errorMessage = '';

    try {
      const quizzes = await this.requestService.request(
        'GET',
        `/study/${session.id}`,
        {},
        {},
        true
      );

      if (!Array.isArray(quizzes) || quizzes.length === 0) {
        throw new Error('Esta sesión no tiene preguntas disponibles.');
      }

      this.localStorageService.setItem('examQuestions', quizzes);
      this.localStorageService.setItem('examenName', {
        examenName: `Plan de estudio - ${this.sessionTitle(session)}`
      });
      this.localStorageService.setItem('studyPlanSessionId', session.id);
      await this.router.navigate(['/test']);
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido iniciar la sesión de estudio.'
      );
    } finally {
      this.isStartingSession = false;
    }
  }

  async reviewStudySession(session: StudySession): Promise<void> {
    if (session.status !== 'REALIZADA' || this.isReviewingSessionId !== null) {
      return;
    }

    this.isReviewingSessionId = session.id;
    this.errorMessage = '';

    try {
      const quizzes = await this.requestService.request(
        'GET',
        `/study/${session.id}`,
        {},
        {},
        true
      );

      if (!Array.isArray(quizzes) || quizzes.length === 0) {
        throw new Error('Esta sesión no tiene preguntas disponibles.');
      }

      const correctedExamQuestions = this.createStudySessionReview(quizzes);
      this.localStorageService.setItem('correctedExamQuestions', correctedExamQuestions);
      await this.router.navigate(['/check-exam']);
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido cargar la revisión de esta sesión.'
      );
    } finally {
      this.isReviewingSessionId = null;
    }
  }

  private createStudySessionReview(quizzes: any[]) {
    return quizzes.map((question: any) => {
      const optionSelected = question.optionSelected ?? null;
      return {
        ...question,
        optionSelected,
        status: optionSelected === null
          ? 'not_answered'
          : optionSelected === question.result
            ? 'success'
            : 'fail'
      };
    });
  }

  async modifyStudyPlan(): Promise<void> {
    if (this.showSettings) {
      return;
    }

    this.showSettings = true;
    this.errorMessage = '';
    await this.loadSettings();
  }

  backToPlan(): void {
    this.showSettings = false;
    this.errorMessage = '';
  }

  openDeleteConfirmation(): void {
    if (!this.isDeletingPlan) {
      this.showDeleteConfirmation = true;
    }
  }

  closeDeleteConfirmation(): void {
    if (!this.isDeletingPlan) {
      this.showDeleteConfirmation = false;
    }
  }

  async changeAdministrationAndDelete(): Promise<void> {
    if (this.isDeletingPlan) {
      return;
    }

    this.showDeleteConfirmation = false;
    this.isDeletingPlan = true;
    this.errorMessage = '';

    try {
      await this.requestService.request('DELETE', '/study', {}, {}, true);
      window.location.reload();
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido cambiar la administración del plan.'
      );
      this.isDeletingPlan = false;
    }
  }

  currentExamDateLabel(): string {
    if (!this.currentExamDate) {
      return 'Sin fecha configurada';
    }

    return new Intl.DateTimeFormat('es-ES', {
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIME_ZONE
    }).format(new Date(this.currentExamDate));
  }

  currentDurationLabel(): string {
    const duration = this.durationOptions.find(
      option => String(option.value) === String(this.settingsSelectedDuration)
    );

    return duration?.label ?? 'Sin estimación configurada';
  }

  onSettingsDurationChange(value: string): void {
    if (this.isUpdatingExamDate) {
      return;
    }

    if (!value || value === this.confirmedSettingsDuration) {
      this.settingsSelectedDuration = this.confirmedSettingsDuration;
      return;
    }

    this.pendingExamDate = value;
    this.showDateConfirmation = true;
  }

  closeDateConfirmation(): void {
    if (this.isUpdatingExamDate) {
      return;
    }

    this.settingsSelectedDuration = this.confirmedSettingsDuration;
    this.pendingExamDate = '';
    this.showDateConfirmation = false;
  }

  pendingExamDateLabel(): string {
    if (!this.pendingExamDate) {
      return '';
    }

    return new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: SPAIN_TIME_ZONE
    }).format(new Date(Number(this.pendingExamDate)));
  }

  async confirmDateChange(): Promise<void> {
    if (!this.pendingExamDate || this.isUpdatingExamDate) {
      return;
    }

    const newExamDate = Number(this.pendingExamDate);
    this.isUpdatingExamDate = true;
    this.errorMessage = '';

    try {
      await this.requestService.request(
        'PUT',
        '/study',
        { estimateExamDate: newExamDate },
        {},
        true
      );

      this.currentExamDate = newExamDate;
      this.confirmedSettingsDuration = this.pendingExamDate;
      this.settingsSelectedDuration = this.pendingExamDate;
      this.pendingExamDate = '';
      this.showDateConfirmation = false;
      await this.loadPlan();
    } catch (error: any) {
      this.settingsSelectedDuration = this.confirmedSettingsDuration;
      this.pendingExamDate = '';
      this.showDateConfirmation = false;
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se ha podido actualizar la fecha del examen.'
      );
    } finally {
      this.isUpdatingExamDate = false;
    }
  }

  remainingDaysLabel(): string {
    if (!this.currentExamDate) {
      return '';
    }

    const todayKey = this.dateKey(new Date());
    const examKey = this.dateKey(this.currentExamDate);
    const today = new Date(`${todayKey}T00:00:00Z`).getTime();
    const examDate = new Date(`${examKey}T00:00:00Z`).getTime();
    const days = Math.ceil((examDate - today) / (24 * 60 * 60 * 1000));

    if (days === 0) {
      return 'El examen es hoy';
    }

    if (days < 0) {
      return 'La fecha del examen ya ha pasado';
    }

    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    const duration = [];

    if (months > 0) {
      duration.push(`${months} ${months === 1 ? 'mes' : 'meses'}`);
    }

    if (remainingDays > 0) {
      duration.push(`${remainingDays} ${remainingDays === 1 ? 'día' : 'días'}`);
    }

    return `Quedan ${duration.join(' y ')} para el examen`;
  }

  formatCountdownValue(value: number): string {
    return String(value).padStart(2, '0');
  }

  private startCountdown(): void {
    this.stopCountdown();
    this.updateCountdown();

    if (this.countdownExpired || !this.currentExamDate) {
      return;
    }

    this.countdownTimer = setInterval(() => this.updateCountdown(), 1000);
  }

  private stopCountdown(): void {
    if (this.countdownTimer !== null) {
      clearInterval(this.countdownTimer);
      this.countdownTimer = null;
    }
  }

  private updateCountdown(): void {
    if (!this.currentExamDate) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      this.countdownExpired = false;
      return;
    }

    const examKey = this.dateKey(this.currentExamDate);
    const examDate = new Date(`${examKey}T23:59:59`).getTime();
    const remainingMilliseconds = examDate - Date.now();

    if (remainingMilliseconds <= 0) {
      this.countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      this.countdownExpired = true;
      this.stopCountdown();
      return;
    }

    const totalSeconds = Math.floor(remainingMilliseconds / 1000);
    this.countdown = {
      days: Math.floor(totalSeconds / 86400),
      hours: Math.floor((totalSeconds % 86400) / 3600),
      minutes: Math.floor((totalSeconds % 3600) / 60),
      seconds: totalSeconds % 60
    };
    this.countdownExpired = false;
  }

  isCurrentDuration(duration: DurationOption): boolean {
    return String(duration.value) === String(this.confirmedSettingsDuration);
  }

  sessionTitle(session: StudySession): string {
    return session.topics.map(topic => this.formatTopic(topic)).join('\n');
  }

  sessionPreviewTitle(session: StudySession): string {
    if (session.topics.length === 0) {
      return 'Temario no disponible';
    }

    const firstTopic = this.formatTopic(session.topics[0]);
    return session.topics.length > 1 ? `${firstTopic}…` : firstTopic;
  }

  topicPrefix(topic: string): string {
    return topic.trim().match(/^TEMA(?:\s+\d+)?\s*:/i)?.[0] ?? 'TEMA:';
  }

  topicName(topic: string): string {
    const value = topic.trim();
    const prefix = value.match(/^TEMA(?:\s+\d+)?\s*:/i)?.[0];
    return prefix ? value.slice(prefix.length).trim() : value;
  }

  formatTopic(topic: string): string {
    return `${this.topicPrefix(topic)} ${this.topicName(topic)}`.trim();
  }

  sessionDateLabel(session: StudySession): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      timeZone: SPAIN_TIME_ZONE
    }).format(new Date(session.date));
  }

  sessionShortDay(session: StudySession): string {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      timeZone: SPAIN_TIME_ZONE
    })
      .format(new Date(session.date))
      .replace('.', '')
      .toUpperCase();
  }

  sessionStatusLabel(session: StudySession): string {
    if (session.status === 'REALIZADA') {
      return session.percentage !== null
        ? `${session.percentage}% acierto`
        : 'Realizada';
    }

    return session.status === 'NO_REALIZADA' ? 'No realizada' : 'Pendiente';
  }

  todayResultClass(session: StudySession): string {
    if (session.percentage === null || session.percentage >= 80) {
      return 'study-plan-completed-result-high';
    }

    return session.percentage < 50
      ? 'study-plan-completed-result-low'
      : 'study-plan-completed-result-medium';
  }

  historyStatusClass(session: StudySession): string {
    if (session.percentage === null) {
      return 'study-plan-history-status-dot-neutral';
    }

    if (session.percentage < 50) {
      return 'study-plan-history-status-dot-low';
    }

    if (session.percentage < 80) {
      return 'study-plan-history-status-dot-medium';
    }

    return 'study-plan-history-status-dot-high';
  }

  private dateKey(value: string | number | Date): string {
    const parts = Object.fromEntries(
      new Intl.DateTimeFormat('en-US', {
        timeZone: SPAIN_TIME_ZONE,
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      })
        .formatToParts(new Date(value))
        .map(({ type, value: partValue }) => [type, partValue])
    );

    return `${parts['year']}-${parts['month']}-${parts['day']}`;
  }

  private weekday(value: string | Date): number {
    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: SPAIN_TIME_ZONE,
      weekday: 'short'
    }).format(new Date(value));

    return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(weekday);
  }

  private timestamp(value: string | Date): number {
    return new Date(value).getTime();
  }

  private groupHistoryByWeek(sessions: StudySession[]): HistoryWeek[] {
    const sessionsByWeek = new Map<string, StudySession[]>();

    for (const session of sessions) {
      const weekKey = this.weekStartKey(session.date);
      const weekSessions = sessionsByWeek.get(weekKey) ?? [];
      weekSessions.push(session);
      sessionsByWeek.set(weekKey, weekSessions);
    }

    return Array.from(sessionsByWeek.entries())
      .map(([key, weekSessions]) => ({
        key,
        sessions: weekSessions.sort(
          (a, b) => this.timestamp(b.date) - this.timestamp(a.date),
        ),
      }))
      .sort((a, b) => b.key.localeCompare(a.key));
  }

  private weekStartKey(value: string | Date): string {
    const [year, month, day] = this.dateKey(value).split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    const daysFromMonday = (date.getUTCDay() + 6) % 7;

    date.setUTCDate(date.getUTCDate() - daysFromMonday);
    return date.toISOString().slice(0, 10);
  }

  private formatHistoryWeekLabel(weekStartKey: string): string {
    const weekStart = new Date(`${weekStartKey}T12:00:00Z`);
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekEnd.getUTCDate() + 6);
    const format = new Intl.DateTimeFormat('es-ES', {
      day: 'numeric',
      month: 'long',
      timeZone: 'UTC',
    });

    return `Semana del ${format.format(weekStart)} al ${format.format(weekEnd)}`;
  }

  private async loadSettings(): Promise<void> {
    this.isLoading = true;

    try {
      const [user, configuration] = await Promise.all([
        this.requestService.request('GET', '/user', {}, {}, true),
        this.requestService.request('GET', '/study/configuration', {}, {}, true)
      ]);

      this.currentPlan = user?.studyPlan ?? null;
      this.currentExamDate = user?.examEstimatedDate ?? null;
      this.settingsSelectedDuration = this.findClosestDurationValue(this.currentExamDate);
      this.confirmedSettingsDuration = this.settingsSelectedDuration;
      this.configuration = configuration ?? {};
      this.communities = Object.keys(this.configuration).filter(Boolean);
    } catch (error: any) {
      this.errorMessage = this.getApiErrorMessage(
        error,
        'No se han podido cargar los ajustes del plan.'
      );
    } finally {
      this.isLoading = false;
    }
  }

  private findClosestDurationValue(dateValue: string | number | null): string {
    if (!dateValue || this.durationOptions.length === 0) {
      return '';
    }

    const target = new Date(dateValue).getTime();
    const closest = this.durationOptions.reduce((previous, current) => {
      const previousDistance = Math.abs(previous.value - target);
      const currentDistance = Math.abs(current.value - target);
      return currentDistance < previousDistance ? current : previous;
    });

    return String(closest.value);
  }

  private createDurationOptions(): DurationOption[] {
    const weekOptions: DurationOption[] = Array.from({ length: 8 }, (_, index) => index + 1).map(weeks => {
      const examDate = new Date();
      examDate.setHours(12, 0, 0, 0);
      examDate.setDate(examDate.getDate() + weeks * 7);

      return {
        label: `${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`,
        value: examDate.getTime()
      };
    });

    const monthOptions: DurationOption[] = Array.from({ length: 10 }, (_, index) => {
      const months = index + 3;
      const examDate = new Date();

      // El backend recibe un timestamp. Mediodía evita desplazamientos de día por zona horaria.
      examDate.setHours(12, 0, 0, 0);
      examDate.setMonth(examDate.getMonth() + months);

      return {
        label: `${months} ${months === 1 ? 'mes' : 'meses'}`,
        value: examDate.getTime()
      };
    });

    return [...weekOptions, ...monthOptions];
  }

  private getApiErrorMessage(error: any, fallback: string): string {
    const message = error?.error?.message ?? error?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    return typeof message === 'string' && message.trim() ? message : fallback;
  }
}
