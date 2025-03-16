import { provideAnimations } from '@angular/platform-browser/animations';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { API_BASE_URL, VatCalculationClient } from './clients/client.generated';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideAnimationsAsync(),
    provideHttpClient(),
    VatCalculationClient,
    { provide: API_BASE_URL, useValue: 'https://localhost:7082' },
  ],
}).catch((err) => console.error(err));
