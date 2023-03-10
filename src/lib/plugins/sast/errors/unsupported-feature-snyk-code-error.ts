import { CustomError } from '../../../errors/custom-error';

export class FeatureNotSupportedByw3securityCodeError extends CustomError {
  public readonly feature: string;

  constructor(feature: string, additionalUserHelp = '') {
    super(`Unsupported action for ${feature}.`);
    this.code = 422;
    this.feature = feature;

    this.userMessage = `'${feature}' is not supported for w3security code. ${additionalUserHelp}`;
  }
}
