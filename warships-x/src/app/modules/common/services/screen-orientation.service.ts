import { Injectable } from '@angular/core';
import { ScreenOrientation } from '@capacitor/screen-orientation';

@Injectable({
  providedIn: 'root',
})
export class ScreenOrientationService {
  async lockPortrait(): Promise<void> {
    return await ScreenOrientation.lock({ orientation: 'portrait' });
  }

  async lockLandscape(): Promise<void> {
    return await ScreenOrientation.lock({ orientation: 'landscape' });
  }

  async unlock(): Promise<void> {
    return ScreenOrientation.unlock();
  }
}
