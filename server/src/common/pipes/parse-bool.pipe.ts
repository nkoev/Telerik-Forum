import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { isBoolean } from 'util';

@Injectable()
export class ParseBoolPipe implements PipeTransform<string, boolean> {
  transform(value: string, metadata: ArgumentMetadata): boolean {
    try {
      JSON.parse(value);
    } catch (e) {
      throw new BadRequestException('Validation failed')
    }
    const val = JSON.parse(value)
    if (!isBoolean(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
