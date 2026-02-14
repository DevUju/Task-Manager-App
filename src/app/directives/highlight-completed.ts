import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appHighlightCompleted]',
  standalone: true
})
export class HighlightCompleted implements OnChanges {
  @Input('appHighlightCompleted') isCompleted: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnChanges() {
    if (this.isCompleted) {
      this.renderer.setStyle(this.el.nativeElement, 'background-color', '#e0ffe0');
      this.renderer.setStyle(this.el.nativeElement, 'text-decoration', 'line-through');
    } else {
      this.renderer.removeStyle(this.el.nativeElement, 'background-color');
      this.renderer.removeStyle(this.el.nativeElement, 'text-decoration');
    }
  }
}