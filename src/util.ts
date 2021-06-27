import { Attr, DataKey } from "./constants";

export function showConfirm(message: string): boolean {
  return window.confirm(message);
}

export function fireEvent(obj: any, name: string, data: any) {
  const event = $.Event(name) as any;
  obj.trigger(event, data);
  return event.result !== false;
}

export function isMethodSafe(method: string) {
  return method === 'GET' || method === 'POST';
}

export function disableElement(element: any) {
  var replacement = element.data(DataKey.DISABLE_WITH);

  if (replacement !== undefined) {
    element.data(DataKey.ENABLE_WITH, element.html());
    element.html(replacement);
  }

  element.on(`click.${Attr.AJAX}`, function (e: any) {
    // prevent multiple clicking
    return stopEvent(e);
  });
  element.data(DataKey.DISABLED, true);
}

export function enableElement(element: any) {
  if (element.data(DataKey.ENABLE_WITH) !== undefined) {
    element.html(element.data(DataKey.ENABLE_WITH));
    element.removeData(DataKey.ENABLE_WITH);
  }
  element.off(`click.${Attr.AJAX}`);
  element.removeData(DataKey.DISABLED);
}

function stopEvent(e: Event) {
  e.stopImmediatePropagation();
  return false;
}
