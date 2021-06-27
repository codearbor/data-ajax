import { Attr } from './constants'
import { sendRequest } from './request';
import { disableElement, enableElement } from './util';

export function setupLinks() {
  const linkSelector = `a[${Attr.AJAX}]:not([disabled])`;
  const disableLinkSelector = `a[${Attr.DISABLE}], a[${Attr.DISABLE_WITH}]`;

  $(document).on('click', linkSelector, function (evt) {
    const $this = $(this);

    if ($this.is(disableLinkSelector)) disableElement($this);

    const result = sendRequest(this, {
      url: this.href,
      type: 'GET',
      data: []
    });

    if (result === false) {
      enableElement($this);
    } else {
      (result as JQuery.jqXHR).always(function () { enableElement($this); });
    }

    return false;
  });
}
