import { Attr } from './constants';
import { sendRequest } from './request';

export function setupInputChange() {
  const inputChangeSelector = [`select[${Attr.AJAX}]`
    , `input[${Attr.AJAX}]`
    , `textarea[${Attr.AJAX}]`].join(',');

  $(document).on('change', inputChangeSelector, function (evt) {
    const $this = $(this);
    sendRequest(this as HTMLElement, {
      type: 'GET',
      data: [{ name: $this.attr(Attr.NAME) || $this.attr('name') || 'query', value: $this.val() }]
    })
  });
}
