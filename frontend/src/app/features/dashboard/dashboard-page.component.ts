import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { LeagueItem } from '../../core/models/api.models';

type HomeLeague = LeagueItem & {
  label: string;
  shortLabel: string;
  description: string;
  accent: string;
  logos: string[];
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="home-shell">
      <div class="home-bg home-bg-a"></div>
      <div class="home-bg home-bg-b"></div>
      <div class="home-bg home-bg-c"></div>

      <header class="home-hero">
      <div class="hero-div">
        <div class="hero-copy">
          
          <h1>
            Hockey Línea
            <span>Madrid</span>
          </h1>
        </div>

        <svg xmlns="http://www.w3.org/2000/svg" class="svg-light" viewBox="0 0 980 980" role="img" aria-label="Jugador de hockey línea">
            <g fill="currentColor">
              <path d="M 867 245 L 841 214 L 834 210 L 796 201 L 756 176 L 731 169 L 702 166 L 705 122 L 697 116 L 687 92 L 672 73 L 659 77 L 626 75 L 617 69 L 608 70 L 594 89 L 586 109 L 577 118 L 580 168 L 577 171 L 545 179 L 514 196 L 496 214 L 485 236 L 472 278 L 468 306 L 467 390 L 472 409 L 449 429 L 380 524 L 378 533 L 383 545 L 368 548 L 356 555 L 332 583 L 305 597 L 289 613 L 231 709 L 231 720 L 206 733 L 181 739 L 168 748 L 164 756 L 164 763 L 169 780 L 156 798 L 156 804 L 163 806 L 182 796 L 211 796 L 264 769 L 284 745 L 321 723 L 320 716 L 312 711 L 316 705 L 359 680 L 370 669 L 379 651 L 388 641 L 415 627 L 427 616 L 437 594 L 456 600 L 465 599 L 485 570 L 504 550 L 534 528 L 549 522 L 554 532 L 539 552 L 533 581 L 528 586 L 507 595 L 494 606 L 462 652 L 459 652 L 451 642 L 443 643 L 420 678 L 389 712 L 388 726 L 364 768 L 364 778 L 369 793 L 356 817 L 363 821 L 382 804 L 403 807 L 420 800 L 432 787 L 441 760 L 458 730 L 468 728 L 491 712 L 561 675 L 576 660 L 589 636 L 610 630 L 626 614 L 707 798 L 731 845 L 753 861 L 785 869 L 817 871 L 842 869 L 853 865 L 860 856 L 863 843 L 862 833 L 856 822 L 840 820 L 809 825 L 778 824 L 754 816 L 736 800 L 645 606 L 642 591 L 697 515 L 706 499 L 710 484 L 717 475 L 744 451 L 748 451 L 756 461 L 767 463 L 783 448 L 808 439 L 818 430 L 821 422 L 821 400 L 833 389 L 849 364 L 841 344 L 852 326 L 865 294 L 871 263 Z"/><path d="M 37 815 L 37 829 L 45 843 L 62 857 L 92 871 L 158 888 L 253 899 L 378 901 L 491 894 L 616 877 L 710 856 L 560 875 L 418 883 L 286 880 L 211 871 L 160 860 L 124 846 L 110 837 L 95 819 L 95 799 L 109 778 L 133 758 L 168 737 L 216 716 L 152 736 L 86 766 L 57 786 L 45 799 Z"/><path d="M 870 882 L 870 902 L 880 908 L 920 910 L 937 906 L 942 902 L 942 882 L 934 877 L 920 874 L 892 874 L 874 878 Z"/>
            </g>
        </svg>

        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="svg-dark" role="img" aria-label="Jugador de Hockey Línea dorado">
            

            <defs>
              <linearGradient id="goldFill" x1="160" y1="120" x2="900" y2="900" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#FFF4C2"/>
                <stop offset="0.32" stop-color="#F7D66B"/>
                <stop offset="0.58" stop-color="#DFA928"/>
                <stop offset="0.82" stop-color="#B87812"/>
                <stop offset="1" stop-color="#FFE08A"/>
              </linearGradient>

              <linearGradient id="goldStroke" x1="120" y1="80" x2="920" y2="920" gradientUnits="userSpaceOnUse">
                <stop offset="0" stop-color="#FFF7D1"/>
                <stop offset="0.5" stop-color="#E6B63A"/>
                <stop offset="1" stop-color="#9A5D08"/>
              </linearGradient>

              <filter id="goldGlow" x="-25%" y="-25%" width="150%" height="150%">
                <feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#DFA928" flood-opacity="0.22"/>
                <feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#FFF1B6" flood-opacity="0.28"/>
              </filter>
            </defs>

            <style>
              .hockey-shadow {
                fill: rgba(76, 43, 0, .22);
                transform: translate(14px, 18px);
              }

              .hockey-main {
                fill: url(#goldFill);
                filter: url(#goldGlow);
              }

              .hockey-edge {
                fill: none;
                stroke: url(#goldStroke);
                stroke-width: 3;
                stroke-opacity: .65;
                stroke-linejoin: round;
              }
            </style>

            <g class="hockey-shadow">
              <path d="M 867 245 L 841 214 L 834 210 L 796 201 L 756 176 L 731 169 L 702 166 L 705 122 L 697 116 L 687 92 L 672 73 L 659 77 L 626 75 L 617 69 L 608 70 L 594 89 L 586 109 L 577 118 L 580 168 L 577 171 L 545 179 L 514 196 L 496 214 L 485 236 L 472 278 L 468 306 L 467 390 L 472 409 L 449 429 L 380 524 L 378 533 L 383 545 L 368 548 L 356 555 L 332 583 L 305 597 L 289 613 L 231 709 L 231 720 L 206 733 L 181 739 L 168 748 L 164 756 L 164 763 L 169 780 L 156 798 L 156 804 L 163 806 L 182 796 L 211 796 L 264 769 L 284 745 L 321 723 L 320 716 L 312 711 L 316 705 L 359 680 L 370 669 L 379 651 L 388 641 L 415 627 L 427 616 L 437 594 L 456 600 L 465 599 L 485 570 L 504 550 L 534 528 L 549 522 L 554 532 L 539 552 L 533 581 L 528 586 L 507 595 L 494 606 L 462 652 L 459 652 L 451 642 L 443 643 L 420 678 L 389 712 L 388 726 L 364 768 L 364 778 L 369 793 L 356 817 L 363 821 L 382 804 L 403 807 L 420 800 L 432 787 L 441 760 L 458 730 L 468 728 L 491 712 L 561 675 L 576 660 L 589 636 L 610 630 L 626 614 L 707 798 L 731 845 L 753 861 L 785 869 L 817 871 L 842 869 L 853 865 L 860 856 L 863 843 L 862 833 L 856 822 L 840 820 L 809 825 L 778 824 L 754 816 L 736 800 L 645 606 L 642 591 L 697 515 L 706 499 L 710 484 L 717 475 L 744 451 L 748 451 L 756 461 L 767 463 L 783 448 L 808 439 L 818 430 L 821 422 L 821 400 L 833 389 L 849 364 L 841 344 L 852 326 L 865 294 L 871 263 Z"/><path d="M 37 815 L 37 829 L 45 843 L 62 857 L 92 871 L 158 888 L 253 899 L 378 901 L 491 894 L 616 877 L 710 856 L 560 875 L 418 883 L 286 880 L 211 871 L 160 860 L 124 846 L 110 837 L 95 819 L 95 799 L 109 778 L 133 758 L 168 737 L 216 716 L 152 736 L 86 766 L 57 786 L 45 799 Z"/><path d="M 870 882 L 870 902 L 880 908 L 920 910 L 937 906 L 942 902 L 942 882 L 934 877 L 920 874 L 892 874 L 874 878 Z"/>
            </g>

            <g class="hockey-main">
              <path d="M 867 245 L 841 214 L 834 210 L 796 201 L 756 176 L 731 169 L 702 166 L 705 122 L 697 116 L 687 92 L 672 73 L 659 77 L 626 75 L 617 69 L 608 70 L 594 89 L 586 109 L 577 118 L 580 168 L 577 171 L 545 179 L 514 196 L 496 214 L 485 236 L 472 278 L 468 306 L 467 390 L 472 409 L 449 429 L 380 524 L 378 533 L 383 545 L 368 548 L 356 555 L 332 583 L 305 597 L 289 613 L 231 709 L 231 720 L 206 733 L 181 739 L 168 748 L 164 756 L 164 763 L 169 780 L 156 798 L 156 804 L 163 806 L 182 796 L 211 796 L 264 769 L 284 745 L 321 723 L 320 716 L 312 711 L 316 705 L 359 680 L 370 669 L 379 651 L 388 641 L 415 627 L 427 616 L 437 594 L 456 600 L 465 599 L 485 570 L 504 550 L 534 528 L 549 522 L 554 532 L 539 552 L 533 581 L 528 586 L 507 595 L 494 606 L 462 652 L 459 652 L 451 642 L 443 643 L 420 678 L 389 712 L 388 726 L 364 768 L 364 778 L 369 793 L 356 817 L 363 821 L 382 804 L 403 807 L 420 800 L 432 787 L 441 760 L 458 730 L 468 728 L 491 712 L 561 675 L 576 660 L 589 636 L 610 630 L 626 614 L 707 798 L 731 845 L 753 861 L 785 869 L 817 871 L 842 869 L 853 865 L 860 856 L 863 843 L 862 833 L 856 822 L 840 820 L 809 825 L 778 824 L 754 816 L 736 800 L 645 606 L 642 591 L 697 515 L 706 499 L 710 484 L 717 475 L 744 451 L 748 451 L 756 461 L 767 463 L 783 448 L 808 439 L 818 430 L 821 422 L 821 400 L 833 389 L 849 364 L 841 344 L 852 326 L 865 294 L 871 263 Z"/><path d="M 37 815 L 37 829 L 45 843 L 62 857 L 92 871 L 158 888 L 253 899 L 378 901 L 491 894 L 616 877 L 710 856 L 560 875 L 418 883 L 286 880 L 211 871 L 160 860 L 124 846 L 110 837 L 95 819 L 95 799 L 109 778 L 133 758 L 168 737 L 216 716 L 152 736 L 86 766 L 57 786 L 45 799 Z"/><path d="M 870 882 L 870 902 L 880 908 L 920 910 L 937 906 L 942 902 L 942 882 L 934 877 L 920 874 L 892 874 L 874 878 Z"/>
            </g>

            <g class="hockey-edge">
              <path d="M 867 245 L 841 214 L 834 210 L 796 201 L 756 176 L 731 169 L 702 166 L 705 122 L 697 116 L 687 92 L 672 73 L 659 77 L 626 75 L 617 69 L 608 70 L 594 89 L 586 109 L 577 118 L 580 168 L 577 171 L 545 179 L 514 196 L 496 214 L 485 236 L 472 278 L 468 306 L 467 390 L 472 409 L 449 429 L 380 524 L 378 533 L 383 545 L 368 548 L 356 555 L 332 583 L 305 597 L 289 613 L 231 709 L 231 720 L 206 733 L 181 739 L 168 748 L 164 756 L 164 763 L 169 780 L 156 798 L 156 804 L 163 806 L 182 796 L 211 796 L 264 769 L 284 745 L 321 723 L 320 716 L 312 711 L 316 705 L 359 680 L 370 669 L 379 651 L 388 641 L 415 627 L 427 616 L 437 594 L 456 600 L 465 599 L 485 570 L 504 550 L 534 528 L 549 522 L 554 532 L 539 552 L 533 581 L 528 586 L 507 595 L 494 606 L 462 652 L 459 652 L 451 642 L 443 643 L 420 678 L 389 712 L 388 726 L 364 768 L 364 778 L 369 793 L 356 817 L 363 821 L 382 804 L 403 807 L 420 800 L 432 787 L 441 760 L 458 730 L 468 728 L 491 712 L 561 675 L 576 660 L 589 636 L 610 630 L 626 614 L 707 798 L 731 845 L 753 861 L 785 869 L 817 871 L 842 869 L 853 865 L 860 856 L 863 843 L 862 833 L 856 822 L 840 820 L 809 825 L 778 824 L 754 816 L 736 800 L 645 606 L 642 591 L 697 515 L 706 499 L 710 484 L 717 475 L 744 451 L 748 451 L 756 461 L 767 463 L 783 448 L 808 439 L 818 430 L 821 422 L 821 400 L 833 389 L 849 364 L 841 344 L 852 326 L 865 294 L 871 263 Z"/><path d="M 37 815 L 37 829 L 45 843 L 62 857 L 92 871 L 158 888 L 253 899 L 378 901 L 491 894 L 616 877 L 710 856 L 560 875 L 418 883 L 286 880 L 211 871 L 160 860 L 124 846 L 110 837 L 95 819 L 95 799 L 109 778 L 133 758 L 168 737 L 216 716 L 152 736 L 86 766 L 57 786 L 45 799 Z"/><path d="M 870 882 L 870 902 L 880 908 L 920 910 L 937 906 L 942 902 L 942 882 L 934 877 L 920 874 L 892 874 L 874 878 Z"/>
            </g>
          </svg>
        </div>
      </header>


      <div id="ligas" class="league-grid">
        <a
          class="league-card"
          *ngFor="let league of leagues; let i = index"
          [routerLink]="['/liga', league.league_key]"
          [queryParams]="{ league_name: league.league_name }"
          [style.--card-accent]="league.accent"
        >
          <div class="card-shine"></div>

          <div class="league-logo-cloud" aria-hidden="true">
            <img
              *ngFor="let logo of league.logos; let logoIndex = index"
              class="league-bg-logo"
              [class.logo-pos-0]="logoIndex === 0"
              [class.logo-pos-1]="logoIndex === 1"
              [class.logo-pos-2]="logoIndex === 2"
              [src]="logo"
              alt=""
            />
          </div>

          <div class="card-top">
            <span class="league-index">{{ i + 1 | number:'2.0-0' }}</span>
            <span class="league-chip">{{ league.shortLabel }}</span>
          </div>

          <div class="card-body">
            <h3>{{ league.league_name }}</h3>
            <p>{{ league.description }}</p>
          </div>

        
        </a>
      </div>
    </section>
  `,
  styles: [`
    :host {
      display: block;
      min-height: 100%;
    }

    .home-shell {
      position: relative;
      isolation: isolate;
      overflow: hidden;
      padding: clamp(18px, 3vw, 34px) 0 64px;
    }

    .home-bg {
      position: absolute;
      z-index: -1;
      border-radius: 999px;
      filter: blur(12px);
      opacity: 0.75;
      pointer-events: none;
    }

    .home-bg-a {
      width: 360px;
      height: 360px;
      top: -160px;
      right: -80px;
      background: radial-gradient(circle, rgba(14,165,233,0.32), transparent 68%);
    }

    .home-bg-b {
      width: 420px;
      height: 420px;
      top: 260px;
      left: -180px;
      background: radial-gradient(circle, rgba(37,99,235,0.24), transparent 66%);
    }

    .home-bg-c {
      width: 300px;
      height: 300px;
      right: 18%;
      bottom: 0;
      background: radial-gradient(circle, rgba(125,211,252,0.16), transparent 70%);
    }



    

    .hero-copy,
    .hero-visual {
      position: relative;
      z-index: 1;
    }

    .hero-copy {
      padding: 1rem;
    }

    .hero-kicker {
      width: fit-content;
      display: inline-flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 20px;
      padding: 10px 14px;
      border-radius: 999px;
      color: #7dd3fc;
      background: rgba(14, 165, 233, 0.14);
      border: 1px solid rgba(125, 211, 252, 0.28);
      font-size: 0.82rem;
      font-weight: 900;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-shadow: 0 10px 26px rgba(14, 165, 233, 0.12);
    }

    .live-dot {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: #22c55e;
      box-shadow: 0 0 0 6px rgba(34,197,94,0.12), 0 0 22px rgba(34,197,94,0.7);
    }

    h1 {
      margin: 0;
      max-width: 800px;
      color: #f8fafc;
      font-size: clamp(3.15rem, 8.7vw, 8.4rem);
      line-height: 0.86;
      letter-spacing: -0.085em;
      font-weight: 1000;
      text-wrap: balance;
    }

    h1 span {
      display: block;
      color: transparent;
      background: linear-gradient(90deg, #f8fafc, #7dd3fc 42%, #38bdf8 68%, #e0f2fe);
      -webkit-background-clip: text;
      background-clip: text;
      text-shadow: none;
    }

    .hero-copy p {
      margin: 26px 0 0;
      max-width: 640px;
      color: #b9c7dc;
      font-size: clamp(1rem, 1.8vw, 1.25rem);
      line-height: 1.75;
    }

    .hero-actions {
      display: flex;
      align-items: center;
      gap: 16px;
      margin-top: 32px;
      flex-wrap: wrap;
    }

    .hero-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 52px;
      padding: 0 24px;
      border-radius: 999px;
      color: #031525;
      text-decoration: none;
      font-weight: 950;
      background: linear-gradient(135deg, #7dd3fc, #38bdf8);
      box-shadow: 0 18px 42px rgba(14, 165, 233, 0.34);
      transition: transform .18s ease, box-shadow .18s ease;
    }

    .hero-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 24px 58px rgba(14, 165, 233, 0.44);
    }

    .hero-metric {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      min-height: 52px;
      padding: 0 18px;
      border-radius: 999px;
      color: #dbeafe;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(148, 163, 184, 0.18);
    }

    .hero-metric strong {
      color: #f8fafc;
      font-size: 1.25rem;
    }

    .hero-metric span {
      color: #94a3b8;
      font-size: 0.9rem;
      font-weight: 700;
    }

    .hero-visual {
      min-height: 360px;
    }

    .ice-rink {
      position: relative;
      height: 420px;
      border-radius: 40px;
      background:
        linear-gradient(180deg, rgba(224,242,254,0.12), rgba(15,23,42,0.18)),
        radial-gradient(circle at 50% 50%, rgba(125,211,252,0.16), transparent 34%);
      border: 1px solid rgba(226,232,240,0.16);
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,0.04),
        inset 0 0 54px rgba(14,165,233,0.12),
        0 30px 80px rgba(0,0,0,0.36);
      overflow: hidden;
    }

    .rink-line {
      position: absolute;
      left: 50%;
      top: 0;
      width: 1px;
      height: 100%;
      background: linear-gradient(180deg, transparent, rgba(125,211,252,0.45), transparent);
      transform: translateX(-50%);
    }

    .rink-line-b {
      left: 0;
      top: 50%;
      width: 100%;
      height: 1px;
      transform: translateY(-50%);
    }

    .puck {
      position: absolute;
      left: 50%;
      top: 50%;
      width: 66px;
      height: 66px;
      border-radius: 999px;
      transform: translate(-50%, -50%);
      background:
        radial-gradient(circle at 35% 30%, rgba(255,255,255,0.2), transparent 24%),
        linear-gradient(135deg, #020617, #111827);
      border: 1px solid rgba(255,255,255,0.12);
      box-shadow: 0 20px 40px rgba(0,0,0,0.35);
    }

    .team-logo {
      position: absolute;
      width: clamp(106px, 10vw, 154px);
      height: clamp(106px, 10vw, 154px);
      object-fit: contain;
      padding: 13px;
      border-radius: 32px;
      background: rgba(248,250,252,0.92);
      border: 1px solid rgba(255,255,255,0.68);
      box-shadow: 0 24px 70px rgba(0,0,0,0.34);
      transition: transform .22s ease;
    }

    .team-logo:hover {
      transform: translateY(-8px) scale(1.03) rotate(0deg) !important;
    }

    .team-logo-a {
      left: 8%;
      top: 10%;
      transform: rotate(-9deg);
    }

    .team-logo-b {
      right: 7%;
      top: 30%;
      transform: rotate(8deg);
    }

    .team-logo-c {
      left: 24%;
      bottom: 8%;
      transform: rotate(6deg);
    }

    .section-title {
      display: flex;
      align-items: end;
      justify-content: space-between;
      gap: 24px;
      margin: clamp(32px, 5vw, 54px) 0 20px;
    }

    .section-title span {
      color: #38bdf8;
      font-size: 0.78rem;
      font-weight: 950;
      text-transform: uppercase;
      letter-spacing: 0.16em;
    }

    .section-title h2 {
      margin: 8px 0 0;
      color: #f8fafc;
      font-size: clamp(2.1rem, 5vw, 4rem);
      line-height: 0.96;
      letter-spacing: -0.065em;
      font-weight: 1000;
    }

    .section-title p {
      max-width: 410px;
      margin: 0;
      color: #94a3b8;
      line-height: 1.6;
      text-align: right;
    }

    .league-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 18px;
      padding: clamp(28px, 5vw, 64px);
    }

    .hero-div {
      display: flex;
    }

    .league-card {
      position: relative;
      overflow: hidden;
      min-height: 220px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 24px;
      border-radius: 30px;
      color: inherit;
      text-decoration: none;
      background:
        linear-gradient(150deg, rgba(15,23,42,0.92), rgba(15,23,42,0.78)),
        radial-gradient(circle at 16% 0%, color-mix(in srgb, var(--card-accent) 35%, transparent), transparent 40%);
      border: 1px solid rgba(148, 163, 184, 0.18);
      box-shadow: 0 22px 54px rgba(0,0,0,0.26);
      transition: transform .2s ease, border-color .2s ease, box-shadow .2s ease;
    }

    .league-card::before {
      content: '';
      position: absolute;
      inset: -1px;
      background:
        linear-gradient(135deg, color-mix(in srgb, var(--card-accent) 52%, transparent), transparent 34%, rgba(255,255,255,0.06));
      opacity: 0;
      transition: opacity .2s ease;
      pointer-events: none;
    }

    .league-card::after {
      content: '';
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      background:
        linear-gradient(90deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.92) 38%, rgba(15,23,42,0.58) 100%),
        radial-gradient(circle at 84% 42%, color-mix(in srgb, var(--card-accent) 20%, transparent), transparent 36%);
    }

    .card-shine {
      position: absolute;
      width: 180px;
      height: 180px;
      right: -80px;
      top: -80px;
      border-radius: 999px;
      background: color-mix(in srgb, var(--card-accent) 35%, transparent);
      filter: blur(6px);
      opacity: 0.42;
      pointer-events: none;
    }


    .league-logo-cloud {
      position: absolute;
      inset: 0;
      z-index: 0;
      pointer-events: none;
      overflow: hidden;
    }

    .league-logo-cloud::before {
      content: '';
      position: absolute;
      inset: 18px;
      border-radius: 24px;
      background:
        radial-gradient(circle at 74% 38%, rgba(255,255,255,0.12), transparent 14%),
        linear-gradient(180deg, rgba(226,232,240,0.05), transparent 58%);
      opacity: 0.75;
    }

    .league-bg-logo {
      position: absolute;
      width: clamp(82px, 8.6vw, 132px);
      height: clamp(82px, 8.6vw, 132px);
      object-fit: contain;
      padding: 10px;
      border-radius: 26px;
      background: rgba(248,250,252,0.9);
      border: 1px solid rgba(255,255,255,0.68);
      box-shadow:
        0 18px 44px rgba(0,0,0,0.28),
        inset 0 1px 0 rgba(255,255,255,0.65);
      opacity: 0.34;
      filter: saturate(1.04) contrast(1.04);
      transform-origin: center;
      transition: opacity .2s ease, transform .2s ease, filter .2s ease;
    }

    .logo-pos-0 {
      right: 8%;
      top: 14%;
      transform: rotate(-9deg);
    }

    .logo-pos-1 {
      right: 25%;
      bottom: 6%;
      transform: rotate(7deg);
    }

    .logo-pos-2 {
      right: -5%;
      bottom: 24%;
      transform: rotate(12deg);
    }

    .league-card:hover .league-bg-logo {
      opacity: 0.52;
      filter: saturate(1.15) contrast(1.08) drop-shadow(0 0 18px color-mix(in srgb, var(--card-accent) 45%, transparent));
    }

    .league-card:hover .logo-pos-0 {
      transform: translateY(-5px) rotate(-13deg) scale(1.04);
    }

    .league-card:hover .logo-pos-1 {
      transform: translateY(4px) rotate(10deg) scale(1.04);
    }

    .league-card:hover .logo-pos-2 {
      transform: translateX(-5px) rotate(15deg) scale(1.04);
    }

    .league-card:hover {
      transform: translateY(-8px);
      border-color: color-mix(in srgb, var(--card-accent) 60%, rgba(255,255,255,0.25));
      box-shadow: 0 32px 78px rgba(0,0,0,0.34);
    }

    .league-card:hover::before {
      opacity: 1;
    }

    .card-top,
    .card-body,
    .card-bottom {
      position: relative;
      z-index: 2;
    }

    .card-top {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
    }

    .league-index {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 46px;
      height: 46px;
      border-radius: 16px;
      color: #fff;
      background: color-mix(in srgb, var(--card-accent) 30%, rgba(15,23,42,0.9));
      border: 1px solid color-mix(in srgb, var(--card-accent) 44%, rgba(255,255,255,0.12));
      font-weight: 1000;
      box-shadow: 0 14px 32px rgba(0,0,0,0.22);
    }

    .league-chip {
      padding: 8px 11px;
      border-radius: 999px;
      color: #dbeafe;
      background: rgba(255,255,255,0.06);
      border: 1px solid rgba(148,163,184,0.16);
      font-size: 0.72rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      white-space: nowrap;
    }

    .card-body h3 {
      margin: 32px 0 0;
      color: #f8fafc;
      font-size: clamp(1.65rem, 3vw, 2.35rem);
      line-height: 0.98;
      letter-spacing: -0.055em;
      font-weight: 1000;
      text-wrap: balance;
    }

    .card-body p {
      margin: 14px 0 0;
      color: #9fb0c6;
      line-height: 1.55;
      font-size: 0.95rem;
    }

    .card-bottom {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      margin-top: 28px;
      color: #dbeafe;
      font-weight: 900;
    }

    .card-bottom strong {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 42px;
      height: 42px;
      border-radius: 999px;
      color: #031525;
      background: linear-gradient(135deg, #e0f2fe, var(--card-accent));
      font-size: 1.45rem;
      transition: transform .2s ease;
    }

    .league-card:hover .card-bottom strong {
      transform: translateX(5px);
    }


    .hockey-photo-card {
      position: relative;
      width: min(100%, 460px);
      min-height: 390px;
      margin-left: auto;
      border-radius: 38px;
      overflow: hidden;
      background: rgba(255,255,255,.72);
      border: 1px solid rgba(14,165,233,.18);
      box-shadow: 0 30px 90px rgba(15,23,42,.18);
      isolation: isolate;
    }

    .hockey-photo-card img {
      width: 100%;
      height: 100%;
      min-height: 390px;
      object-fit: cover;
      display: block;
    }

    .floating-logo {
      position: absolute;
      display: grid;
      place-items: center;
      width: 118px;
      height: 118px;
      border-radius: 28px;
      background: rgba(255,255,255,.92);
      border: 1px solid rgba(15,23,42,.08);
      box-shadow: 0 22px 50px rgba(15,23,42,.18);
      z-index: 2;
    }

    .floating-logo img {
      width: 94px;
      height: 94px;
      min-height: auto;
      object-fit: contain;
    }

    .floating-logo-a {
      left: 8%;
      bottom: 10%;
      transform: rotate(-7deg);
    }

    .floating-logo-b {
      right: 8%;
      top: 10%;
      transform: rotate(8deg);
    }

    @media (max-width: 1100px) {
      .home-hero {
        grid-template-columns: 1fr;
        min-height: auto;
      }

      .hero-visual {
        min-height: 300px;
      }

      .ice-rink {
        height: 330px;
      }

      .league-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }

      .section-title {
        align-items: flex-start;
        flex-direction: column;
      }

      .section-title p {
        text-align: left;
      }
    }

    @media (max-width: 720px) {
      .home-shell {
        padding: 10px 0 38px;
      }

      .hero-div {
        flex-direction: column;
      }
   

      .home-hero::after {
        inset: 10px;
        border-radius: 20px;
      }

      .hero-kicker {
        font-size: 0.68rem;
        padding: 8px 11px;
      }

      h1 {
        font-size: clamp(3.25rem, 18vw, 5.4rem);
      }

      .hero-copy p {
        margin-top: 18px;
        font-size: 0.98rem;
      }

      .hero-actions {
        margin-top: 24px;
      }

      .hero-primary,
      .hero-metric {
        width: 100%;
      }

      .hero-primary {
        min-height: 50px;
      }

      .hero-metric {
        justify-content: center;
      }

      .hero-visual {
        min-height: 220px;
      }

      .hockey-photo-card {
        min-height: 250px;
        border-radius: 26px;
      }

      .hockey-photo-card img {
        min-height: 250px;
      }

      .floating-logo {
        width: 82px;
        height: 82px;
        border-radius: 20px;
      }

      .floating-logo img {
        width: 64px;
        height: 64px;
      }

      .ice-rink {
        height: 250px;
        border-radius: 28px;
      }

      .team-logo {
        width: 88px;
        height: 88px;
        border-radius: 22px;
        padding: 9px;
      }

      .team-logo-a {
        left: 4%;
        top: 8%;
      }

      .team-logo-b {
        right: 3%;
        top: 28%;
      }

      .team-logo-c {
        left: 28%;
        bottom: 5%;
      }

      .section-title {
        margin-top: 32px;
      }

      .league-grid {
        grid-template-columns: 1fr;
        gap: 14px;
        padding: clamp(18px, 5vw, 24px) !important;
      }

      .league-card {
        min-height: 190px;
        border-radius: 24px;
        padding: 20px;
      }

      .league-bg-logo {
        width: 96px;
        height: 96px;
        padding: 8px;
        border-radius: 22px;
        opacity: 0.3;
      }

      .logo-pos-0 {
        right: 6%;
        top: 10%;
      }

      .logo-pos-1 {
        right: 28%;
        bottom: 4%;
      }

      .logo-pos-2 {
        right: -9%;
        bottom: 23%;
      }

      .league-card::after {
        background:
          linear-gradient(90deg, rgba(15,23,42,0.98) 0%, rgba(15,23,42,0.9) 50%, rgba(15,23,42,0.64) 100%),
          radial-gradient(circle at 86% 48%, color-mix(in srgb, var(--card-accent) 22%, transparent), transparent 40%);
      }

      .card-body h3 {
        margin-top: 26px;
      }
    }
  `]
})
export class DashboardPageComponent implements OnInit {
  private readonly api = inject(ApiService);

  private readonly teamLogoPool = [
    '/assets/teams/360.png',
    '/assets/teams/cplm.png',
    '/assets/teams/lasrozas.png',
    '/assets/teams/lobos.png',
    '/assets/teams/madridpatina.png',
    '/assets/teams/mamuts.png',
    '/assets/teams/pinguinos.png',
    '/assets/teams/renos.png',
    '/assets/teams/rolleybeers.png',
    '/assets/teams/sobre8ruedas.png',
    '/assets/teams/tirso.png',
    '/assets/teams/trescantos.png',
    '/assets/teams/vikings.png',
    '/assets/teams/pumas.png',
    '/assets/teams/bisontes.png'
  ];

  private readonly leagueLogoGroups = [
    ['/assets/teams/cplm.png', '/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png'],
    ['/assets/teams/360.png', '/assets/teams/lasrozas.png', '/assets/teams/lobos.png'],
    ['/assets/teams/madridpatina.png', '/assets/teams/mamuts.png', '/assets/teams/pinguinos.png'],
    ['/assets/teams/renos.png', '/assets/teams/rolleybeers.png', '/assets/teams/tirso.png'],
    ['/assets/teams/vikings.png', '/assets/teams/cplm.png', '/assets/teams/360.png'],
    ['/assets/teams/trescantos.png', '/assets/teams/sobre8ruedas.png', '/assets/teams/lasrozas.png'],
    ['/assets/teams/pumas.png', '/assets/teams/bisontes.png', '/assets/teams/vikings.png']
  ];

  private readonly leagueOrder = [
    'Liga Senior Femenina',
    'Liga Senior 1',
    'Liga Senior 2',
    'Liga Senior 3 Grupo 1',
    'Liga Senior 3 Grupo 2',
    'Liga Senior 3 Grupo 3'
  ];

  private readonly descriptions: Record<string, string> = {
    'Liga Senior Femenina': 'Competición femenina senior con seguimiento completo de partidos y estadísticas.',
    'Liga Senior 1': 'Máximo nivel senior con equipos, jugadores, porteros y métricas de rendimiento.',
    'Liga Senior 2': 'Liga senior con calendario, resultados y datos detallados por partido.',
    'Liga Senior 3 Grupo 1': 'Grupo 1 de Senior 3 con clasificación y estadísticas filtradas.',
    'Liga Senior 3 Grupo 2': 'Grupo 2 de Senior 3 con navegación directa al panel de la competición.',
    'Liga Senior 3 Grupo 3': 'Grupo 3 de Senior 3 con datos consolidados por equipos y jugadores.'
  };

  private readonly accents = ['#38bdf8', '#22c55e', '#f97316', '#a78bfa', '#f43f5e', '#eab308'];

  leagues: HomeLeague[] = this.buildFallbackLeagues();

  ngOnInit(): void {
    this.api.getLeagues().subscribe({
      next: (data) => {
        if (!data.items?.length) {
          return;
        }

        const byName = new Map(data.items.map((item) => [item.league_name, item]));
        this.leagues = this.leagueOrder.map((name, index) => this.decorateLeague(byName.get(name) || {
          league_name: name,
          league_key: this.slugify(name)
        }, index));
      }
    });
  }

  private buildFallbackLeagues(): HomeLeague[] {
    return this.leagueOrder.map((leagueName, index) => this.decorateLeague({
      league_name: leagueName,
      league_key: this.slugify(leagueName)
    }, index));
  }

  private decorateLeague(league: LeagueItem, index: number): HomeLeague {
    return {
      ...league,
      label: league.league_name,
      shortLabel: this.shortLabel(league.league_name),
      description: this.descriptions[league.league_name] || 'Accede al panel filtrado de esta competición.',
      accent: this.accents[index % this.accents.length],
      logos: this.leagueLogoGroups[index % this.leagueLogoGroups.length] || this.pickLogos(index)
    };
  }

  private pickLogos(index: number): string[] {
    return [0, 1, 2].map((offset) => this.teamLogoPool[(index * 3 + offset) % this.teamLogoPool.length]);
  }

  private shortLabel(value: string): string {
    return value
      .replace('Liga ', '')
      .replace('Senior ', 'S')
      .replace('Grupo ', 'G');
  }

  private slugify(value: string): string {
    return value
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
