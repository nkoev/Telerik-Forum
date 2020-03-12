export class UsersInMemoryStorage<T extends { id: number, username: string, isDeleted: boolean }> {
  private readonly _data: T[] = [];
  private currentId = 1;

  public all(): T[] {
    return this._data.slice();
  }

  public find(modelId: number): T {
    return this._data.find(x => x.id === modelId);
  }

  public findByUsername(modelUsername: string): T {
    return this._data.find(x => x.username === modelUsername);
  }

  public add(model: T): T {
    model.id = this.currentId++;

    this._data.push(model);

    return model;
  }

  public update(model: T): T {
    const index: number = this._data.findIndex(x => x.id === model.id);
    this._data[index] = model;

    return model;
  }

  public delete(model: T): T {
    model.isDeleted = true;

    return this.update(model);
  }
}
