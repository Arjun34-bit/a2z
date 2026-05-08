// ── Raw DB row ────────────────────────────────────────────────────────────
export interface StepRow {
  artist_id: string;
  current_step: number;
  steps_completed: number[];
  last_saved_at: string;
}

// ── Domain Entity ─────────────────────────────────────────────────────────
export class ArtistOnboardingStep {
  readonly artistId: string;
  readonly currentStep: number;
  readonly stepsCompleted: number[];
  readonly lastSavedAt: Date;

  /**
   * Step map:
   *  1 = type_selection
   *  2 = basic_info
   *  3 = [RESERVED — service adding]
   *  4 = identity_verify   (solo + parlor owner; sub-artists skip)
   *  5 = portfolio
   */
  constructor(data: StepRow) {
    this.artistId = data.artist_id;
    this.currentStep = data.current_step;
    this.stepsCompleted = data.steps_completed ?? [];
    this.lastSavedAt = new Date(data.last_saved_at);
  }

  hasCompleted(step: number): boolean {
    return this.stepsCompleted.includes(step);
  }

  toPublicJSON() {
    return {
      currentStep: this.currentStep,
      stepsCompleted: this.stepsCompleted,
      lastSavedAt: this.lastSavedAt,
    };
  }
}
