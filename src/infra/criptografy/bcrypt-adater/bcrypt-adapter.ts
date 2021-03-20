import { HashCompare } from '@data/protocols/criptografy/hash-compare';
import bcrypt from 'bcrypt';
import { Hasher } from '../../../data/protocols/criptografy/hasher';

export class BcryptAdapter implements Hasher, HashCompare {
  constructor(private readonly salt: number) {
    this.salt = salt;
  }

  async hash(value: string): Promise<string> {
    return await bcrypt.hash(value, this.salt);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    const isValid = await bcrypt.compare(value, hash);
    return isValid;
  }
}
