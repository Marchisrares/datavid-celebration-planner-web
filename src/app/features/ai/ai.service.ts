import { Injectable, inject } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ApiService } from '../../core/services/api.service';
import { AiMessageRequest, AiMessageResponse } from '../../shared/models/ai.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AiService {
  private api = inject(ApiService);

  generate(req: AiMessageRequest): Observable<AiMessageResponse> {
    // Use mock mode if enabled in environment
    if (environment.mockMode) {
      return this.generateMock(req);
    }

    return this.api.post<any>('/ai/message', req).pipe(
      map((response) => response.data || response),
      catchError(() => this.generateMock(req)) // Fallback to mock on error
    );
  }

  private generateMock(req: AiMessageRequest): Observable<AiMessageResponse> {
    const tone = req.tone || 'friendly';
    const locale = req.locale || 'en';

    // Generate message based on tone and locale
    const messages = this.getMessageTemplates(tone, locale);
    const message = messages[Math.floor(Math.random() * messages.length)];

    const response: AiMessageResponse = {
      message,
      explanation: {
        model: 'mock-ai-v1.0',
        params: {
          tone,
          locale,
          temperature: 0.7,
          maxTokens: 150,
        },
        promptOrMethod: 'generateBirthdayMessage',
        rationale: `Generated a ${tone} birthday message in ${locale} locale. The message considers the celebrant's cultural context and aims to create a warm, personalized greeting appropriate for professional birthday celebrations.`,
      },
      sent: req.sendEmail
        ? {
            dryRun: req.dryRunEmail ?? true,
            provider: 'mock-email-provider',
          }
        : undefined,
    };

    // Simulate network delay
    return of(response).pipe(delay(800));
  }

  private getMessageTemplates(tone: string, locale: string): string[] {
    const templates: Record<string, Record<string, string[]>> = {
      friendly: {
        en: [
          'Happy Birthday! 🎉 Wishing you an amazing day filled with joy, laughter, and wonderful surprises. May this year bring you exciting opportunities and cherished moments!',
          'Happy Birthday! 🎂 Hope your special day is as incredible as you are. Here\'s to another year of success, happiness, and making great memories together!',
          'Wishing you the happiest of birthdays! 🎈 May your day be filled with love, laughter, and everything that makes you smile. Cheers to another fantastic year ahead!',
        ],
        ro: [
          'La mulți ani! 🎉 Îți doresc o zi minunată plină de bucurie, râsete și surprize plăcute. Fie ca acest an să îți aducă oportunități interesante și momente prețioase!',
          'La mulți ani! 🎂 Sper că ziua ta specială va fi la fel de minunată ca tine. Să ai un an plin de succes, fericire și amintiri frumoase!',
        ],
        it: [
          'Buon Compleanno! 🎉 Ti auguro una giornata meravigliosa piena di gioia, risate e sorprese. Che quest\'anno ti porti opportunità eccitanti e momenti preziosi!',
          'Buon Compleanno! 🎂 Spero che il tuo giorno speciale sia incredibile quanto te. Auguri per un altro anno di successo, felicità e bei ricordi!',
        ],
      },
      formal: {
        en: [
          'Warmest wishes on your birthday. May this special occasion mark the beginning of a prosperous year filled with success and fulfillment in all your endeavors.',
          'Please accept my sincere congratulations on your birthday. I wish you continued success, good health, and happiness in the year ahead.',
          'Wishing you a very happy birthday. May the coming year bring you professional achievements and personal satisfaction.',
        ],
        ro: [
          'Cele mai calde urări de ziua dumneavoastră. Fie ca această ocazie specială să marcheze începutul unui an prosper, plin de succes și împliniri în toate demersurile dumneavoastră.',
          'Vă transmit sincere felicitări cu ocazia zilei dumneavoastră de naștere. Vă doresc succes continuu, sănătate și fericire în anul care urmează.',
        ],
        it: [
          'I più calorosi auguri per il tuo compleanno. Che questa occasione speciale segni l\'inizio di un anno prospero, ricco di successi e soddisfazioni in tutti i tuoi progetti.',
          'Ti prego di accettare i miei sinceri auguri per il tuo compleanno. Ti auguro successo continuo, buona salute e felicità nell\'anno a venire.',
        ],
      },
      fun: {
        en: [
          'HAPPY BIRTHDAY! 🎊🎉🎈 Time to party! Another year older means another year of being awesome! Let\'s celebrate YOU today! 🥳',
          'It\'s your BIRTHDAY! 🎂✨ Get ready for cake, laughs, and good times! You deserve all the fun and celebration today brings! 🎁',
          'WOOHOO! Birthday time! 🎉 Let the celebrations begin! May your day be filled with epic moments and unforgettable memories! 🎊',
        ],
        ro: [
          'LA MULȚI ANI! 🎊🎉🎈 E timpul să sărbătorim! Un an în plus înseamnă un an în plus de a fi minunat! Astăzi te sărbătorim pe TINE! 🥳',
          'E ZIUA TA! 🎂✨ Pregătește-te pentru tort, râsete și momente frumoase! Meriți toată distracția și sărbătoarea de azi! 🎁',
        ],
        it: [
          'BUON COMPLEANNO! 🎊🎉🎈 È ora di festeggiare! Un altro anno significa un altro anno di essere fantastico! Celebriamo TE oggi! 🥳',
          'È il TUO COMPLEANNO! 🎂✨ Preparati per torta, risate e bei momenti! Meriti tutto il divertimento che questa giornata porta! 🎁',
        ],
      },
      short: {
        en: [
          'Happy Birthday! 🎂 Wishing you joy and success!',
          'Happy Birthday! 🎉 Have a wonderful day!',
          'Best wishes on your special day! 🎈',
        ],
        ro: [
          'La mulți ani! 🎂 Îți doresc bucurie și succes!',
          'La mulți ani! 🎉 Să ai o zi minunată!',
        ],
        it: [
          'Buon Compleanno! 🎂 Auguri di gioia e successo!',
          'Buon Compleanno! 🎉 Buona giornata!',
        ],
      },
    };

    // Get messages for the specified tone and locale, fallback to English if locale not found
    const toneMessages = templates[tone] || templates['friendly'];
    return toneMessages[locale] || toneMessages['en'];
  }
}
