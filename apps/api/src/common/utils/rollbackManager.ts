export class RollbackManager {
  private actions: (() => Promise<void>)[] = [];

  register(action: () => Promise<void>) {
    this.actions.push(action);
  }

  async rollback() {
    for (let i = this.actions.length - 1; i >= 0; i--) {
      try {
        await this.actions[i]();
      } catch (e) {
        console.error('Rollback failed:', e);
      }
    }
  }
}

