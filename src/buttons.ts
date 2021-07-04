import { Attr } from './constants';
import { sendRequest } from './request';
import { disableElement, enableElement } from './util';

export function setupButtons() {
  const buttonSelector = `button[${Attr.AJAX}]:not([form]):not([type=submit])`;
  const disableButtonSelector = `button[${Attr.DISABLE}], button[${Attr.DISABLE_WITH}]`;

  $(document).on('click', buttonSelector, function () {
    const $this = $(this);

    if ($this.is(disableButtonSelector)) disableElement($this);

    const result = sendRequest(this, {
      type: 'GET',
      data: [{ name: $this.attr(Attr.NAME) || $this.attr('name') || 'query', value: $this.val() }]
    });

    if (result === false) {
      enableElement($this);
    } else {
      (result as JQuery.jqXHR).always(function () { enableElement($this); });
    }
  });
}
