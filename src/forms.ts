import { Attr, DataKey } from './constants';
import { sendRequest } from './request';

const formSubmitSelector = `form[${Attr.AJAX}]`;
const formInputSubmitSelector = [formSubmitSelector + ` input[type=submit]`
  , formSubmitSelector + ` button[type=submit]`
  , `input[type=submit][${Attr.AJAX}][form]`
  , `button[type=submit][${Attr.AJAX}][form]`
  , `button[${Attr.AJAX}][form]:not([type])`].join(`,`);
const formInputImageSelector = [formSubmitSelector + ` input[type=image]`
  , `input[type=image][${Attr.AJAX}][form]`].join(`,`);

export function setupForms() {
  $(document).on('click', formInputImageSelector, function (evt) {
    const name = evt.target.name,
      $target = $(evt.target),
      $form = $target.attr('form') !== undefined ? $('#' + $target.attr('form')) : $($target.parents('form')[0]),
      offset = $target.offset();

    $form.data(DataKey.CLICK_DATA, [
      { name: name + '.x', value: Math.round(evt.pageX - offset!.left) },
      { name: name + '.y', value: Math.round(evt.pageY - offset!.top) }
    ]);

    setTimeout(function () {
      $form.removeData(DataKey.CLICK_DATA);
    }, 0);
  });

  $(document).on('click', formInputSubmitSelector, function (evt) {
    const name = evt.currentTarget.name,
      $target = $(evt.target),
      $form = $target.attr('form') !== undefined ? $('#' + $target.attr('form')) : $($target.parents('form')[0]);

    $form.data(DataKey.CLICK_DATA, name ? [{ name: name, value: evt.currentTarget.value }] : []);
    $form.data(DataKey.CLICK_TARGET, $target);

    setTimeout(function () {
      $form.removeData(DataKey.CLICK_DATA);
      $form.removeData(DataKey.CLICK_TARGET);
    }, 0);
  });

  $(document).on('submit', formSubmitSelector, function (evt) {
    const $form = $(this),
      clickInfo = $form.data(DataKey.CLICK_DATA) || [],
      $target = $form.data(DataKey.CLICK_TARGET),
      isSkip = $target && ($target.attr(Attr.SKIP) !== undefined),
      isNoValidate = $target && ($target.attr('formnovalidate') !== undefined),
      url = $target.attr('formaction') || this.action,
      method = $target.attr('formmethod') || this.method || 'GET';

    if (isSkip) return;

    evt.preventDefault();

    if (!isNoValidate && !validate(this)) {
      return;
    }

    sendRequest(this, {
      url: url,
      type: method,
      data: clickInfo.concat($form.serializeArray())
    }, $target && $target[0]);
  });
}

function validate(form: HTMLFormElement) {
  const validationInfo = $(form).data(DataKey.VALIDATOR);
  return !validationInfo || !validationInfo.validate || validationInfo.validate();
}
