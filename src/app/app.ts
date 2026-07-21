import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HelpLauncherComponent } from './features/apply/help-launcher.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HelpLauncherComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
