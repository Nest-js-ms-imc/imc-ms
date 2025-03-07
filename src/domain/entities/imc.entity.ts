export class ImcEntity {
  id: string;
  height: number;
  weight: number;
  imc: number;
  userId: string;
  position: number;
  private readonly _errors: Map<string, boolean>;

  constructor(data?: {
    id?: string;
    height?: number;
    weight?: number;
    imc?: number;
    userId?: string;
    position?: number;
  }) {
    this._errors = new Map();

    if (data?.id) this.id = data.id;
    if (data?.height) this.height = data.height;
    if (data?.weight) this.weight = data.weight;
    if (data?.imc) this.imc = data.imc;
    if (data?.userId) this.userId = data.userId;
    if (data?.position) this.position = data.position;
  }

  public create(data: {
    height: number;
    weight: number;
    // imc: number;
    userId: string;
  }): this {
    this.height = data.height;
    this.weight = data.weight;
    // this.imc = data.imc;
    this.userId = data.userId;
    return this;
  }

  public validate(): this {
    if (!this.height) {
      this._errors.set('height', false);
    }

    if (!this.weight) {
      this._errors.set('weight', false);
    }

    if (!this.imc) {
      this._errors.set('imc', false);
    }

    if (!this.userId) {
      this._errors.set('userId', false);
    }

    return this;
  }

  public isValid(): boolean {
    return this._errors.size === 0;
  }

  public getErrors(): Map<string, boolean> {
    return this._errors;
  }
}
