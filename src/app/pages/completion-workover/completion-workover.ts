import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-completion-workover',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './completion-workover.html',
  styleUrl: './completion-workover.css'
})
export class CompletionWorkoverComponent {
  protected readonly pageTitle = 'HIDROSTÁTICA Y FLUIDOS DE COMPLETACIÓN';
  protected readonly imagePath = '/assets/modules/completion.svg';
}
