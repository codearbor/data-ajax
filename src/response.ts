import { Attr, EventOf } from "./constants";

export function processResponse(element: HTMLElement, data: any, contentType: string) {

  if (contentType.indexOf('application/x-javascript') !== -1 || contentType.indexOf('text/javascript') !== -1) {
    return;
  }

  const $element = $(element)

  const mode = ($element.attr(Attr.UPDATE_MODE) || '').toUpperCase();

  $($element.attr(Attr.UPDATE) || '').each(function (_i, update) {
    const $update = $(update);
    $update.trigger(EventOf.BEFORE_UPDATE, [update, data]);
    switch (mode) {
      case 'BEFORE':
        $update.prepend(data);
        break;
      case 'AFTER':
        $update.append(data);
        break;
      case 'REPLACE-WITH':
        $update.replaceWith(data);
        break;
      default:
        $update.html(data);
        break;
    }
    $update.trigger(EventOf.UPDATED, [update, data]);
  });
}
