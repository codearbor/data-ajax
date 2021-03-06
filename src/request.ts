import { Attr, EventOf } from './constants';
import { showConfirm, fireEvent, isMethodSafe } from './util';
import { csrfAvailable, csrfHeader, csrfToken } from './csrf';
import { processResponse } from './response';

const HTTP_OVERRIDE = 'X-HTTP-Method-Override';

export function sendRequest(element: HTMLElement, options: any, clickElement: HTMLElement | null = null): boolean | JQuery.jqXHR {
  const $element = $(element),
    confirm = $element.attr(Attr.CONFIRM),
    loading = $($element.attr(Attr.LOADING) || ''),
    loadDuration = parseInt($element.attr(Attr.LOADING_DURATION) as any || 0, 10),
    clickEle = clickElement ?? element;
  var method = $element.attr(Attr.METHOD) || undefined;

  if (!fireEvent($element, EventOf.BEFORE, [element, clickEle])) {
    return false;
  }

  if (confirm && !showConfirm(confirm)) {
    return false;
  }

  $.extend(options, {
    type: method,
    url: $element.attr(Attr.URL) || $element.attr('formaction') || undefined,
    cache: ($element.attr(Attr.CACHE) || '').toLowerCase() === 'true',
    beforeSend: function (xhr: JQueryXHR, settings: any) {
      setupXhr(xhr, method!, $element.is(`[${Attr.SKIP_CSRF}]`));

      var result = fireEvent($element, EventOf.BEFORE_SEND, [element, xhr, settings, clickEle]);

      if (result !== false) {
        loading.show(loadDuration);
        $(element).trigger(EventOf.SEND, [element, xhr, settings, clickEle]);
      }

      return result;
    },
    complete: function (xhr: JQueryXHR, status: string) {
      loading.hide(loadDuration);
      $element.trigger(EventOf.COMPLETE, [element, xhr, status, clickEle]);
    },
    success: function (data: any, status: string, xhr: JQueryXHR,) {
      $element.trigger(EventOf.SUCCESS, [element, xhr, status, data, clickEle]);
      processResponse(element, data, xhr.getResponseHeader('Content-Type') || 'text/html');
    },
    error: function (xhr: JQueryXHR, status: string, err: any) {
      $element.trigger(EventOf.ERROR, [element, xhr, status, err, clickEle]);
    }
  });

  options.data.push({ name: 'X-Requested-With', value: 'XMLHttpRequest' });

  method = (options.type || 'GET').toUpperCase();

  if (!isMethodSafe(method!)) {
    options.type = 'POST';
    options.data.push({ name: HTTP_OVERRIDE, value: method });
  }

  if ($element.is('form') && $element.attr('enctype') == 'multipart/form-data') {
    const formdata = new FormData();
    $.each(options.data, function (_i, v) {
      formdata.append(v.name, v.value);
    });
    $('input[type=file]', $element).each(function () {
      const file = this as HTMLInputElement;
      $.each(file.files, function (_n, v) {
        formdata.append(file.name, v);
      });
    });
    $.extend(options, {
      processData: false,
      contentType: false,
      data: formdata
    });
  }

  return $.ajax(options);
}

function setupXhr(xhr: JQueryXHR, method: string, skipCsrf: boolean = false) {
  if (!isMethodSafe(method)) {
    xhr.setRequestHeader(HTTP_OVERRIDE, method);
  }

  if (!skipCsrf && csrfAvailable()) {
    // @ts-ignore
    xhr.setRequestHeader(csrfHeader(), csrfToken());
  }
}
