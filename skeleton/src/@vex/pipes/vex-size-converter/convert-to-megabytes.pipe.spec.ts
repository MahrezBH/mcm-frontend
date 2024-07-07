import { ConvertToMegabytesPipe } from './convert-to-megabytes.pipe';

describe('ConvertToMegabytesPipe', () => {
  it('create an instance', () => {
    const pipe = new ConvertToMegabytesPipe();
    expect(pipe).toBeTruthy();
  });
});
