import { Attr, DataKey, EventOf } from "./constants";

export function processResponse(element: HTMLElement, data: any, contentType: string) {

  if (contentType.indexOf('application/x-javascript') !== -1 || contentType.indexOf('text/javascript') !== -1) {
    return;
  }

  const $element = $(element)
  const mode = ($element.attr(Attr.UPDATE_MODE) || '').toUpperCase();
  const updateQuery = $element.attr(Attr.UPDATE) || '';

  if (updateQuery.length == 0) return;

  $(updateQuery).each(function (_i, update) {
    const $update = $(update);

    $update.trigger(EventOf.BEFORE_UPDATE, [update, data]);
    cleanUpValidator($update[0]);

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
  });

  $(updateQuery).each(function (_i, update) {
    const $update = $(update);
    $update.trigger(EventOf.UPDATED, [update, data]);
    setupValidator($update[0]);
  });
}

function hasValidator(): boolean {
  // @ts-ignore
  return $.validator && $.validator.unobtrusive;
}

function cleanUpValidator(target: HTMLElement) {

  if (!hasValidator()) {
    return;
  }

  var $target = $(target),
    $form = $target.is('form') ? $target : $('form', $target);

  $form.each(function (_idx, frm) {
    $(frm).removeData('validator');
    $(frm).removeData(DataKey.VALIDATOR);
  });
}

function setupValidator(target: HTMLElement) {
  if (!hasValidator()) {
    return;
  }

  var $target = $(target),
    $form = $target.is('form') ? $target : $('form', $target);

  $form.each(function (_idx, frm) {
    setTimeout(function () {
      // @ts-ignore
      $.validator.unobtrusive.parse($(frm));
    }, 50);
  });
}
