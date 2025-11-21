import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Catch(HttpException)
export class I18nExceptionFilter implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    const exceptionResponse: any = exception.getResponse();
    
    // Get language from I18nContext
    const i18nContext = I18nContext.current(host);
    const lang = i18nContext?.lang || 'ar';
    
    // Get the message - if it's already translated (has translation key), use it
    // Otherwise, translate based on status code
    let message = typeof exceptionResponse === 'string' 
      ? exceptionResponse 
      : exceptionResponse.message;

    // Translate error field based on status code
    let translatedError = '';
    
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        translatedError = this.i18n.t('errors.badRequest', { lang });
        // If message is the default "Bad Request", translate it
        if (message === 'Bad Request') {
          message = this.i18n.t('errors.badRequestMessage', { lang });
        }
        break;
      case HttpStatus.UNAUTHORIZED:
        translatedError = this.i18n.t('errors.unauthorized', { lang });
        // If message is the default "Unauthorized", translate it
        if (message === 'Unauthorized') {
          message = this.i18n.t('errors.unauthorizedMessage', { lang });
        }
        break;
      case HttpStatus.FORBIDDEN:
        translatedError = this.i18n.t('errors.forbidden', { lang });
        if (message === 'Forbidden') {
          message = this.i18n.t('errors.forbiddenMessage', { lang });
        }
        break;
      case HttpStatus.NOT_FOUND:
        translatedError = this.i18n.t('errors.notFound', { lang });
        if (message === 'Not Found') {
          message = this.i18n.t('errors.notFoundMessage', { lang });
        }
        break;
      case HttpStatus.INTERNAL_SERVER_ERROR:
        translatedError = this.i18n.t('errors.internalServerError', { lang });
        if (message === 'Internal Server Error') {
          message = this.i18n.t('errors.internalServerErrorMessage', { lang });
        }
        break;
      default:
        translatedError = this.i18n.t('errors.error', { lang });
    }

    response.status(status).json({
      message,
      error: translatedError,
      statusCode: status,
    });
  }
}