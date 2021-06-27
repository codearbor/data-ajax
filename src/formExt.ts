import { Attr, DataKey } from "./constants";

const formSubmitSelector = `form[${Attr.AJAX}]`;
const formDisableSelector = [`input[${Attr.DISABLE_WITH}]:enabled`,
`button[${Attr.DISABLE_WITH}]:enabled`,
`textarea[${Attr.DISABLE_WITH}]:enabled`,
`input[${Attr.DISABLE}]:enabled`,
`button[${Attr.DISABLE}]:enabled`,
`textarea[${Attr.DISABLE}]:enabled`,
`select[${Attr.DISABLE}]:enabled`].join(`, `);
const formEnableSelector = [`input[${Attr.DISABLE_WITH}]:disabled`,
`button[${Attr.DISABLE_WITH}]:disabled`,
`textarea[${Attr.DISABLE_WITH}]:disabled`,
`input[${Attr.DISABLE}]:disabled`,
`button[${Attr.DISABLE}]:disabled`,
`textarea[${Attr.DISABLE}]:disabled`,
`select[${Attr.DISABLE}]:disabled`].join(`, `);

export function setupFormExt() {
  const $doc = $(document);

  $doc.on('ajax-send', formSubmitSelector, function (event) {
    if (this === event.target) disableFormElements($(this));
  });

  $doc.on('ajax-success', formSubmitSelector, function (event) {
    if (this === event.target) enableFormElements($(this));
  });

  $doc.on('ajax-error', formSubmitSelector, function (event) {
    if (this === event.target) enableFormElements($(this));
  });
}

function disableFormElements(form: any) {
  formElements(form, formDisableSelector).each(function () {
    disableFormElement($(this));
  });
}

function disableFormElement(element: any) {
  var method: string, replacement;

  method = element.is('button') ? 'html' : 'val';
  replacement = element.data(Attr.DISABLE_WITH);

  if (replacement !== undefined) {
    element.data(DataKey.ENABLE_WITH, element[method]());
    element[method](replacement);
  }

  element.prop('disabled', true);
  element.data(DataKey.DISABLED, true);
}

function enableFormElements(form: JQuery<any>) {
  formElements(form, formEnableSelector).each(function () {
    enableFormElement($(this));
  });
}

function enableFormElement(element: any) {
  var method = element.is('button') ? 'html' : 'val';
  if (element.data(DataKey.ENABLE_WITH) !== undefined) {
    element[method](element.data(DataKey.ENABLE_WITH));
    element.removeData(DataKey.ENABLE_WITH);
  }
  element.prop('disabled', false);
  element.removeData(DataKey.DISABLED);
}

function formElements(form: JQuery<any>, selector: string) {
  return form.is('form') ? $(form[0].elements).filter(selector) : form.find(selector);
}
